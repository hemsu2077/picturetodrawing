import { respData, respErr } from "@/lib/resp";
import { experimental_generateImage as generateImage } from "ai";
import { replicate } from "@ai-sdk/replicate";
import { newStorage } from "@/lib/storage";
import { auth } from "@/auth";
import { getUserCredits, decreaseCredits, CreditsTransType } from "@/services/credit";
import { isAuthEnabled } from "@/lib/auth";
import { insertImage } from "@/models/image";
import { getUuid } from "@/lib/hash";
import { checkDailyTrial, recordDailyTrial, getClientIP } from "@/services/trial";
import { getDrawingPrompt, getModelForStyle } from "@/config/drawing-prompts";

export async function POST(req: Request) {
try {
    let userUuid = "";
    let isTrialUsage = false;
    const clientIP = await getClientIP();
    
    // Get user session if auth is enabled
    if (isAuthEnabled()) {
      const session = await auth();
      if (session?.user?.uuid) {
        userUuid = session.user.uuid;
      }
    }

    // Daily trial now requires login
    if (!userUuid && isAuthEnabled()) {
      return Response.json(
        { code: -1, message: "Authentication required" }, 
        { status: 401 }
      );
    }

    // Check daily trial availability (only for logged-in users)
    const trialCheck = await checkDailyTrial(userUuid || undefined);
    
    if (trialCheck.canUseTrial && userUuid) {
      // Logged-in user can use daily trial
      isTrialUsage = true;
    } else if (userUuid) {
      // Trial already used, check user credits
      const userCredits = await getUserCredits(userUuid);
      if (userCredits.left_credits < 2) {
        return Response.json(
          { code: -1, message: "Insufficient credits and daily trial already used" }, 
          { status: 402 }
        );
      }
    } else {
      // No user and auth disabled (shouldn't happen but handle it)
      return Response.json(
        { code: -1, message: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { style, image, ratio } = await req.json();

    // Validate required inputs
    if (!style || !image) {
      return respErr("Missing required parameters: style and image");
    }

    // Auto-select model based on style
    const modelType = getModelForStyle(style);
    const selectedModel = modelType === 'nano-banana' ? "google/nano-banana" : "black-forest-labs/flux-kontext-pro";
    
    // Get model-specific prompt for the requested style
    const prompt = getDrawingPrompt(modelType, style);
    
    
    let inputImageUrl: string;
    
    // Check if image is already a URL (sample image)
    if (image.startsWith('https://')) {
      inputImageUrl = image;
      if (process.env.NODE_ENV !== 'production') {
        console.log("Using sample image URL:", inputImageUrl);
      }
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
        if (process.env.NODE_ENV !== 'production') {
          console.log("Input image uploaded to:", inputImageUrl);
        }
      } catch (uploadError) {
        console.error("Failed to upload input image:", uploadError);
        const errorMsg = uploadError instanceof Error ? uploadError.message : "Unknown error";
        
        // Provide user-friendly error message
        if (errorMsg.includes('timeout') || errorMsg.includes('ETIMEDOUT')) {
          throw new Error("Image upload timed out. Please try again with a smaller image or check your connection.");
        } else if (errorMsg.includes('ECONNRESET') || errorMsg.includes('ECONNREFUSED')) {
          throw new Error("Network connection issue. Please check your internet connection and try again.");
        } else {
          throw new Error("Failed to upload image. Please try again.");
        }
      }
    }
    const imageModel = replicate.image(selectedModel);
    
    // Configure provider options based on model
    let providerOptions: any;
    if (modelType === 'nano-banana') {
      // Nano Banana now supports aspect_ratio
      const aspect = ratio || "match_input_image";
      providerOptions = {
        replicate: {
          image_input: [inputImageUrl],
          aspect_ratio: aspect,
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

    // Only add aspectRatio for default model (AI SDK maps to provider param)
    if (modelType !== 'nano-banana') {
      generateOptions.aspectRatio = ratio || "match_input_image";
    }

    let images, warnings;
    
    try {
      const result = await generateImage(generateOptions);
      images = result.images;
      warnings = result.warnings;

      if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
        console.warn("Generation warnings:", warnings);
      }

      if (!images || images.length === 0) {
        throw new Error("No images generated");
      }
    } catch (aiError: any) {
      // Extract Replicate error from AI SDK error
      console.error("AI SDK Error:", aiError);
      
      // Try to get the actual Replicate error message
      let replicateError = "Unknown error";
      
      if (aiError.cause?.value?.error) {
        // This is the actual Replicate error message
        replicateError = aiError.cause.value.error;
      } else if (aiError.message) {
        replicateError = aiError.message;
      }
      
      // Map Replicate errors to user-friendly i18n keys
      let errorKey = "error_unknown";
      
      if (replicateError.includes("flagged as sensitive") || replicateError.includes("E005")) {
        errorKey = "error_sensitive_content";
      } else if (replicateError.includes("timeout") || replicateError.includes("timed out")) {
        errorKey = "error_timeout";
      } else if (replicateError.includes("invalid") || replicateError.includes("Invalid")) {
        errorKey = "error_invalid_input";
      } else if (replicateError.includes("ModelError") || replicateError.includes("model")) {
        errorKey = "error_model_failed";
      }
      
      // Return error with i18n key for frontend to translate
      return Response.json(
        { 
          code: -1, 
          message: replicateError,
          errorKey: errorKey // Frontend can use this for i18n
        }, 
        { status: 500 }
      );
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

          // Store image data to database (only for logged-in users)
          if (userUuid) {
            try {
              const imageUuid = getUuid();
              const currentTime = new Date();
              
              await insertImage({
                uuid: imageUuid,
                user_uuid: userUuid,
                original_image_url: inputImageUrl,
                generated_image_url: res.url || "",
                style: style,
                model: modelType,
                ratio: ratio || "match_input_image",
                provider: provider,
                filename: filename,
                status: "completed",
                created_at: currentTime,
                updated_at: currentTime,
              });
              if (process.env.NODE_ENV !== 'production') {
                console.log(`Image data stored to database for user ${userUuid}`);
              }
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
          console.error("[Critical] Failed to upload generated image:", err);
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          
          // Log detailed error for monitoring
          console.error(`[Storage Error] Key: ${key}, Size: ${body.length} bytes, Error: ${errorMsg}`);
          
          // Return partial result - image was generated but upload failed
          // Frontend can still show the base64 image
          return {
            provider,
            filename,
            uploadError: true,
            errorMessage: "Image generated but storage failed. Please download and save manually.",
          };
        }
      })
    );

    // Handle credits and trial recording after successful generation
    if (isTrialUsage && userUuid) {
      // Record daily trial usage for logged-in user
      try {
        await recordDailyTrial(userUuid);
      } catch (trialError) {
        console.error('CRITICAL: Failed to record daily trial:', trialError);
        // Don't fail the request as image is already generated, but this needs investigation
      }
    } else if (userUuid) {
      // Deduct credits for non-trial usage
      try {
        await decreaseCredits({
          user_uuid: userUuid,
          trans_type: CreditsTransType.DrawingGeneration,
          credits: 2,
        });
      } catch (creditError) {
        console.error('Failed to deduct credits:', creditError);
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
