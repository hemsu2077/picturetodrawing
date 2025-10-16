"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePreview } from "./image-preview";
import { UploadControl } from "./upload-control";
import { ProcessingProgress } from "./processing-progress";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    ort?: any;
  }
}

const ONNX_RUNTIME_URL =
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.10.0/dist/ort.min.js";
const DEFAULT_MODEL_URL =
  "https://huggingface.co/rocca/informative-drawings-line-art-onnx/resolve/main/model.onnx";
const EXTRA_PROCESSING_DELAY_MS = 40_000;

export function FreeLineArtTool({
  className,
  modelUrl = DEFAULT_MODEL_URL,
  maxDim = 1024,
}: {
  className?: string;
  modelUrl?: string;
  maxDim?: number;
}) {
  const t = useTranslations("free_line_art");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any | null>(null);
  const isLoadingModelRef = useRef(false);

  // Lazy load model and runtime only when needed
  const loadModelIfNeeded = async () => {
    if (sessionRef.current) return sessionRef.current;
    if (isLoadingModelRef.current) {
      // Wait for ongoing load
      while (isLoadingModelRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return sessionRef.current;
    }

    isLoadingModelRef.current = true;
    try {
      // Load ONNX runtime if not present
      if (!window.ort) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = ONNX_RUNTIME_URL;
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load runtime"));
          document.head.appendChild(s);
        });
      }

      const ort = window.ort;
      if (!ort) throw new Error("ONNX Runtime not available");

      // Setup WASM
      if ((self as any).crossOriginIsolated) {
        ort.env.wasm.numThreads = (navigator as any).hardwareConcurrency || 1;
      }
      ort.env.wasm.proxy = true;

      // Load model
      const sess = await ort.InferenceSession.create(modelUrl, {
        executionProviders: ["wasm"],
      });

      sessionRef.current = sess;
      return sess;
    } finally {
      isLoadingModelRef.current = false;
    }
  };

  const handleFileSelect = (file: File) => {
    setInputFile(file);
    // Don't set previewUrl here - upload control will handle its own preview
    setOutputUrl(null);
    setError(null);
  };

  const handleClearFile = () => {
    setInputFile(null);
    setPreviewUrl(null);
    setOutputUrl(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!inputFile) return;
    
    setIsProcessing(true);
    setError(null);
    setOutputUrl(null);

    try {
      // Load model on demand
      const session = await loadModelIfNeeded();
      
      // Process image
      const { data, width, height } = await fileToTensorData(inputFile, maxDim);

      const feeds = {
        input: new window.ort.Tensor("float32", data, [1, 3, height, width]),
      };

      const results = await session.run(feeds);
      const out = results["output"];
      
      const blob = await greyscaleArrayToBlob(out.data as Float32Array | number[], {
        width: out.dims[3],
        height: out.dims[2],
      });
      
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Processing failed");
    } finally {
      // Intentionally delay completion to increase perceived processing time
      await new Promise((resolve) => setTimeout(resolve, EXTRA_PROCESSING_DELAY_MS));
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl || !inputFile) return;
    const fileName = inputFile.name.replace(/\.[^/.]+$/, "") + ".lines.jpg";
    const a = document.createElement("a");
    a.href = outputUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCloseResult = () => {
    setOutputUrl(null);
    setError(null);
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto pb-16", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Right: Upload & Controls - Shows first on mobile */}
        <div className="bg-background rounded-lg p-4 shadow-sm h-[420px] sm:h-[480px] flex flex-col gap-3 md:order-2">
          {/* Upload control - flexible height */}
          <div className="flex-1 min-h-0">
            <UploadControl
              onFileSelect={handleFileSelect}
              selectedFile={inputFile}
              onClearFile={handleClearFile}
            />
          </div>

          {/* Generate button - fixed at bottom */}
          <Button
            onClick={handleGenerate}
            disabled={!inputFile || isProcessing}
            className="w-full h-11 text-base flex-shrink-0"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t("generating")}
              </>
            ) : (
              t("generate_button")
            )}
          </Button>
        </div>

        {/* Left: Preview - Shows second on mobile */}
        <div className="bg-background rounded-lg p-4 shadow-sm h-[420px] sm:h-[480px] md:order-1">
          <div className="h-full">
            {isProcessing ? (
              <ProcessingProgress 
                upgradeHint={t("upgrade_hint")}
                upgradeButtonText={t("upgrade_button")}
              />
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3 mx-auto">
                    <span className="text-destructive text-xl">⚠</span>
                  </div>
                  <div className="text-sm font-medium text-destructive mb-1">{t("processing_failed")}</div>
                  <div className="text-xs text-muted-foreground">{error}</div>
                </div>
              </div>
            ) : (
              <ImagePreview
                imageUrl={outputUrl}
                isResult={!!outputUrl}
                onDownload={handleDownload}
                onClose={handleCloseResult}
                upgradeHint={t("upgrade_hint")}
                upgradeButtonText={t("upgrade_button")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function fileToTensorData(file: File, maxDim: number) {
  const imgUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(imgUrl);
    const { canvas, width, height } = drawToCanvas(img, maxDim);
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convert RGBA to Float32 [1,3,H,W]
    const W = canvas.width;
    const H = canvas.height;
    const d = imageData.data;
    const rgb = new Float32Array(3 * W * H);
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const r = d[i] / 255;
      const g = d[i + 1] / 255;
      const b = d[i + 2] / 255;
      const x = p % W;
      const y = (p / W) | 0;
      // NCHW: (c * H + y) * W + x
      rgb[(0 * H + y) * W + x] = r;
      rgb[(1 * H + y) * W + x] = g;
      rgb[(2 * H + y) * W + x] = b;
    }
    return { data: rgb, width: W, height: H };
  } finally {
    URL.revokeObjectURL(imgUrl);
  }
}

function drawToCanvas(img: HTMLImageElement, maxDim: number) {
  let W = img.naturalWidth || img.width;
  let H = img.naturalHeight || img.height;
  if (maxDim > 0) {
    const scale = Math.min(1, maxDim / Math.max(W, H));
    if (scale < 1) {
      W = Math.max(1, Math.round(W * scale));
      H = Math.max(1, Math.round(H * scale));
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, W, H);
  return { canvas, width: W, height: H };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function greyscaleArrayToBlob(
  linearArr: Float32Array | number[],
  dims: { width: number; height: number }
) {
  const len = linearArr.length;
  const dataArray = new Uint8ClampedArray(len * 4);
  for (let i = 0; i < len; i++) {
    const v = Math.max(0, Math.min(255, Math.round((linearArr as any)[i] * 255)));
    const j = i * 4;
    dataArray[j] = v; // R
    dataArray[j + 1] = v; // G
    dataArray[j + 2] = v; // B
    dataArray[j + 3] = 255; // A
  }
  const imageData = new ImageData(dataArray, dims.width, dims.height);
  const canvas = document.createElement("canvas");
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(imageData, 0, 0);
  return await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg"));
}

export default FreeLineArtTool;
