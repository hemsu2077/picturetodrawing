import { toast } from "sonner";
import { Drawing } from "./shared-types";

export const formatStyle = (style: string) => {
  return style
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDate = (date: Date | null) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const handleDownload = async (drawing: Drawing, showToast = false) => {
  try {
    const response = await fetch(drawing.generated_image_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = drawing.filename || `drawing-${drawing.style}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    if (showToast) {
      toast.success("Download started");
    }
  } catch (error) {
    console.error("Download failed:", error);
    if (showToast) {
      toast.error("Failed to download image");
    }
  }
};
