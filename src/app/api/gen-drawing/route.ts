import { respData, respErr } from "@/lib/resp";
import { experimental_generateImage as generateImage } from "ai";
import { replicate } from "@ai-sdk/replicate";
import { newStorage } from "@/lib/storage";
import { auth } from "@/auth";
import { getUserCredits, decreaseCredits, CreditsTransType } from "@/services/credit";
import { isAuthEnabled } from "@/lib/auth";
import { insertImage } from "@/models/image";
import { getUuid } from "@/lib/hash";

export async function POST(req: Request) {
try {
    let userUuid = "";
    
    // Check authentication and credits only if auth is enabled
    if (isAuthEnabled()) {
      const session = await auth();
      if (!session?.user?.uuid) {
        return Response.json(
          { code: -1, message: "Authentication required" }, 
          { status: 401 }
        );
      }

      userUuid = session.user.uuid;

      // Check user credits
      const userCredits = await getUserCredits(userUuid);
      if (userCredits.left_credits < 2) {
        return Response.json(
          { code: -1, message: "Insufficient credits." }, 
          { status: 402 }
        );
      }
    }

    const { style, image, ratio } = await req.json();

    // Validate required inputs
    if (!style || !image) {
      return respErr("Missing required parameters: style and image");
    }

    // Map style IDs to descriptive prompts
    const styleMap: Record<string, string> = {
      'pencil-sketch': 'black and white pencil sketch',
      'line-drawing': 'black and white line drawing',
      'charcoal-drawing': 'black and white charcoal drawing',
      'color-pencil-drawing': 'color pencil drawing',
      'watercolor-painting': 'watercolor painting',
      'inkart': 'ink art'
    };

    const styleName = styleMap[style] || style;
    const prompt = `transform the image to a drawing, the drawing should be in the style of ${styleName}`
    
    // Choose model based on style
    const model = style === 'line-drawing' 
      ? "black-forest-labs/flux-kontext-dev" 
      : "black-forest-labs/flux-kontext-pro";
    
    console.log(`Using model: ${model} for style: ${style}`);
    
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
    const imageModel = replicate.image(model);
    const providerOptions = {
      replicate: {
        input_image: inputImageUrl,
        output_format:"png",
      },
    }

    const { images, warnings } = await generateImage({
        model: imageModel,
        prompt: prompt,
        n: 1,
        providerOptions,
        aspectRatio:ratio || "match_input_image",
      });

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

          // Store image data to database if auth is enabled and we have user UUID
          if (isAuthEnabled() && userUuid) {
            try {
              const imageUuid = getUuid();
              const currentTime = new Date();
              
              await insertImage({
                uuid: imageUuid,
                user_uuid: userUuid,
                original_image_url: inputImageUrl,
                generated_image_url: res.url || "",
                style: style,
                ratio: ratio || "match_input_image",
                provider: provider,
                filename: filename,
                status: "completed",
                created_at: currentTime,
                updated_at: currentTime,
              });
              console.log(`Image data stored to database for user ${userUuid}`);
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

    // Deduct credits after successful generation (only if auth is enabled)
    if (isAuthEnabled() && userUuid) {
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