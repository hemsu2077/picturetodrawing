import { respData, respErr } from "@/lib/resp";
import { experimental_generateImage as generateImage } from "ai";
import { replicate } from "@ai-sdk/replicate";
import { newStorage } from "@/lib/storage";

export async function POST(req: Request) {
try {
    const { style, image, ratio } = await req.json();


    const prompt = ` transform the image to a drawing, the drawing should be in the style of ${style}`
    const model = "black-forest-labs/flux-kontext-pro";

    const imageModel = replicate.image(model);
    const providerOptions = {
      replicate: {
        input_image:image,
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
        throw new Error("gen images failed");
      }
       
    const storage = newStorage();
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
    return respErr("Transform failed"); 
}
}