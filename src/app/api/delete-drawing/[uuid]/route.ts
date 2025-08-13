import { auth } from "@/auth";
import { deleteImage, findImageByUuid } from "@/models/image";
import { respData, respErr } from "@/lib/resp";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.uuid) {
      return Response.json(
        { code: -1, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { uuid } = await params;

    // Check if the image exists and belongs to the user
    const image = await findImageByUuid(uuid);
    if (!image) {
      return Response.json(
        { code: -1, message: "Image not found" },
        { status: 404 }
      );
    }

    if (image.user_uuid !== session.user.uuid) {
      return Response.json(
        { code: -1, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete the image from database
    await deleteImage(uuid);

    return respData({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return respErr("Failed to delete image");
  }
}
