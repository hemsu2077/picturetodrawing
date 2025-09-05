import { respData, respErr } from "@/lib/resp";
import { experimental_generateImage as generateImage } from "ai";
import { replicate } from "@ai-sdk/replicate";
import { newStorage } from "@/lib/storage";
import { auth } from "@/auth";
import { getUserCredits, decreaseCredits, CreditsTransType } from "@/services/credit";
import { isAuthEnabled } from "@/lib/auth";
import { insertImage } from "@/models/image";
import { getUuid } from "@/lib/hash";
import { checkDailyTrial, recordDailyTrial } from "@/services/trial";

export async function POST(req: Request) {
try {
    let userUuid = "";
    let isTrialUsage = false;
    
    // Get user session if auth is enabled
    if (isAuthEnabled()) {
      const session = await auth();
      if (session?.user?.uuid) {
        userUuid = session.user.uuid;
      }
    }

    // Check daily trial availability
    const trialCheck = await checkDailyTrial(userUuid || undefined);
    
    if (trialCheck.canUseTrial) {
      // User can use daily trial
      isTrialUsage = true;
      console.log(`Using daily trial for ${userUuid ? `user ${userUuid}` : 'anonymous user'}`);
    } else if (isAuthEnabled()) {
      // Trial already used, check authentication and credits
      if (!userUuid) {
        return Response.json(
          { code: -1, message: "Authentication required or daily trial already used" }, 
          { status: 401 }
        );
      }

      // Check user credits
      const userCredits = await getUserCredits(userUuid);
      if (userCredits.left_credits < 2) {
        return Response.json(
          { code: -1, message: "Insufficient credits and daily trial already used" }, 
          { status: 402 }
        );
      }
    } else {
      // Auth disabled but trial used
      return Response.json(
        { code: -1, message: "Daily trial already used" }, 
        { status: 429 }
      );
    }

    const { style, model, image, ratio } = await req.json();

    // Validate required inputs
    if (!style || !image) {
      return respErr("Missing required parameters: style and image");
    }

    // Map style IDs to descriptive prompts
    const styleMap: Record<string, string> = {
      'pencil-sketch': 'black and white pencil sketch',
      'charcoal-drawing': 'black and white charcoal drawing',
      'color-pencil-drawing': 'color pencil drawing',
      'watercolor-painting': 'watercolor painting',
      'inkart': 'ink art',
      'superhero-comic': 'American superhero comic style, rough lines, exaggerated colors. Just like a real comic',
      'manga': 'Japanese/Korean manga style, clean lines, black and white tones, expressive emotions, dynamic composition. Just like a real manga'
    };

    // Special handling for line-drawing with custom prompt
    let prompt: string;
    if (style === 'line-drawing') {
      prompt = 'Convert this photo into a clean black and white line illustration. Keep only the main outlines, no shading. Make it look like a coloring book page with clear contours and simplified details. Remove the background and focus on the subject.';
    } else {
      const styleName = styleMap[style] || style;
      prompt = `transform the image to a drawing, the drawing should be in the style of ${styleName}, Try to make it look as painted as possible.`;
    }
    
    // Select model based on user choice
    const selectedModel = model === 'nano-banana' ? "google/nano-banana" : "black-forest-labs/flux-kontext-pro";
    
    
    let inputImageUrl: string;
    
    // Check if image is already a URL (sample image)
    if (image.startsWith('https://')) {
      inputImageUrl = image;
      console.log("Using sample image URL:", inputImageUrl);
    } else {
      // Upload the input image to get a URL
      const storage = newStorage();
      const inputFilename = `input_${new Date().getTime()}.png`;
      const inputKey = `picturetodrawing/inputs/${inputFilename}`;
      const inputBody = Buffer.from(image, "base64");

      try {
        const inputUploadResult = await storage.uploadFile({
          body: inputBody,
          key: inputKey,
          contentType: "image/png",
          disposition: "inline",
        });
        inputImageUrl = inputUploadResult.url;
        console.log("Input image uploaded to:", inputImageUrl);
      } catch (uploadError) {
        console.error("Failed to upload input image:", uploadError);
        throw new Error("Failed to upload input image");
      }
    }
    const imageModel = replicate.image(selectedModel);
    
    // Configure provider options based on model
    let providerOptions: any;
    if (model === 'nano-banana') {
      // Nano Banana uses image_input array and doesn't support ratio
      providerOptions = {
        replicate: {
          image_input: [inputImageUrl],
          output_format: "png",
        },
      };
    } else {
      // Default model (flux-kontext-pro) uses input_image and supports ratio
      providerOptions = {
        replicate: {
          input_image: inputImageUrl,
          output_format: "png",
        },
      };
    }

    // Configure generateImage options based on model
    const generateOptions: any = {
      model: imageModel,
      prompt: prompt,
      n: 1,
      providerOptions,
    };

    // Only add aspectRatio for default model
    if (model !== 'nano-banana') {
      generateOptions.aspectRatio = ratio || "match_input_image";
    }

    const { images, warnings } = await generateImage(generateOptions);

      if (warnings.length > 0) {
        console.warn("Generation warnings:", warnings);
        // Don't throw error for warnings, just log them
      }

      if (!images || images.length === 0) {
        throw new Error("No images generated");
      }
       
    const provider = "replicate";

    const storage = newStorage();
    const processedImages = await Promise.all(
      images.map(async (image) => {
        const filename = `PicturetoDrawing_${new Date().getTime()}.png`;
        const key = `picturetodrawing/${filename}`;
        const body = Buffer.from(image.base64, "base64");

        try {
          const res = await storage.uploadFile({
            body,
            key,
            contentType: "image/png",
            disposition: "inline",
          });

          // Store image data to database (for both logged-in and trial users)
          if (userUuid || isTrialUsage) {
            try {
              const imageUuid = getUuid();
              const currentTime = new Date();
              
              await insertImage({
                uuid: imageUuid,
                user_uuid: userUuid || "", // Empty string for trial users
                original_image_url: inputImageUrl,
                generated_image_url: res.url || "",
                style: style,
                model: model || "default",
                ratio: ratio || "match_input_image",
                provider: provider,
                filename: filename,
                status: "completed",
                created_at: currentTime,
                updated_at: currentTime,
              });
              console.log(`Image data stored to database for ${userUuid ? `user ${userUuid}` : 'trial user'}`);
            } catch (dbError) {
              console.error("Failed to store image data to database:", dbError);
              // Don't fail the request if database storage fails
            }
          }

          return {
            ...res,
            provider,
            filename,
          };
        } catch (err) {
          console.log("upload file failed:", err);
          return {
            provider,
            filename,
          };
        }
      })
    );

    // Handle credits and trial recording after successful generation
    if (isTrialUsage) {
      // Record daily trial usage
      try {
        await recordDailyTrial(userUuid || undefined);
        console.log(`Daily trial recorded for ${userUuid ? `user ${userUuid}` : 'anonymous user'}`);
      } catch (trialError) {
        console.error("Failed to record daily trial:", trialError);
        // Don't fail the request if trial recording fails
      }
    } else if (userUuid) {
      // Deduct credits for non-trial usage
      try {
        await decreaseCredits({
          user_uuid: userUuid,
          trans_type: CreditsTransType.DrawingGeneration,
          credits: 2,
        });
        console.log(`Successfully deducted 2 credits from user ${userUuid}`);
      } catch (creditError) {
        console.error("Failed to deduct credits:", creditError);
        // Note: We don't fail the request if credit deduction fails
        // as the image has already been generated successfully
      }
    }
  
    return respData(processedImages)   
} catch (e) {
    console.error("Generation error:", e);
    const errorMessage = e instanceof Error ? e.message : "Transform failed";
    return respErr(errorMessage); 
}
}