import { respData, respErr } from "@/lib/resp";
import { experimental_generateImage as generateImage } from "ai";
import { replicate } from "@ai-sdk/replicate";
import { newStorage } from "@/lib/storage";

export async function POST(req: Request) {
try {
    const { style, image, ratio } = await req.json();

    // Validate required inputs
    if (!style || !image) {
      return respErr("Missing required parameters: style and image");
    }

    // Map style IDs to descriptive prompts
    const styleMap: Record<string, string> = {
      'pencil-sketch': 'pencil sketch',
      'line-drawing': 'line drawing',
      'charcoal-drawing': 'charcoal drawing',
      'color-pencil-drawing': 'color pencil drawing',
      'watercolor-painting': 'watercolor painting',
      'inkart': 'ink art'
    };

    const styleName = styleMap[style] || style;
    const prompt = `transform the image to a drawing, the drawing should be in the style of ${styleName}`
    
    // First, upload the input image to get a URL
    const storage = newStorage();
    const inputFilename = `input_${new Date().getTime()}.png`;
    const inputKey = `picturetodrawing/inputs/${inputFilename}`;
    const inputBody = Buffer.from(image, "base64");

    let inputImageUrl: string;
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

    const model = "black-forest-labs/flux-kontext-pro";
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
  
    return respData(processedImages)   
} catch (e) {
    console.error("Generation error:", e);
    const errorMessage = e instanceof Error ? e.message : "Transform failed";
    return respErr(errorMessage); 
}
}