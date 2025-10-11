import { toast } from "sonner";
import { Drawing } from "./shared-types";

export const formatStyle = (style: string) => {
  return style
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatModel = (model: string) => {
  if (model === 'nano-banana') {
    return 'Nano Banana 🍌';
  }
  return 'Classic';
};

export const formatRatio = (ratio: string | null) => {
  if (!ratio) return 'Auto';
  if (ratio === 'match_input_image') return 'Auto';
  return ratio;
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

// Helper function to fetch with timeout
const fetchWithTimeout = async (url: string, timeout = 30000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      // Add cache control to avoid cached failures
      cache: 'no-cache',
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const handleDownload = async (drawing: Drawing, showToast = false) => {
  try {
    // Validate URL first
    if (!drawing.generated_image_url) {
      throw new Error("Image URL is missing");
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log("Downloading image from:", drawing.generated_image_url);
    }

    // Try to fetch with timeout and retry once
    let response: Response;
    try {
      response = await fetchWithTimeout(drawing.generated_image_url, 30000);
    } catch (firstError) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("First download attempt failed, retrying...", firstError);
      }
      // Retry once after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = await fetchWithTimeout(drawing.generated_image_url, 30000);
    }
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}, url: ${drawing.generated_image_url}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    
    // Check if blob is valid
    if (!blob || blob.size === 0) {
      throw new Error("Downloaded image is empty");
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Downloaded blob size: ${blob.size} bytes`);
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = drawing.filename || `drawing-${drawing.style}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
    
    if (showToast) {
      toast.success("Download started");
    }
  } catch (error) {
    console.error("Download failed:", error);
    if (process.env.NODE_ENV !== 'production') {
      console.error("Drawing data:", {
        uuid: drawing.uuid,
        url: drawing.generated_image_url,
        filename: drawing.filename,
      });
    }
    
    // Fallback: Open image in new tab for manual download
    try {
      window.open(drawing.generated_image_url, '_blank');
      if (showToast) {
        toast.info("Opening image in new tab. Please right-click and save.");
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      if (showToast) {
        toast.error("Failed to download image");
      }
    }
  }
};
