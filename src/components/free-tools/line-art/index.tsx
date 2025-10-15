"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    ort?: any;
  }
}

type Status =
  | { type: "idle" }
  | { type: "loading"; message: string }
  | { type: "ready" }
  | { type: "processing" }
  | { type: "error"; message: string };

const DEFAULT_SAMPLE = "/imgs/bg/bg.webp";
const ONNX_RUNTIME_URL =
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.10.0/dist/ort.min.js";
const DEFAULT_MODEL_URL =
  "https://huggingface.co/rocca/informative-drawings-line-art-onnx/resolve/main/model.onnx";

export function FreeLineArtTool({
  className,
  modelUrl = DEFAULT_MODEL_URL,
  maxDim = 1024,
}: {
  className?: string;
  modelUrl?: string;
  maxDim?: number; // downscale long side to speed up demo
}) {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [session, setSession] = useState<any | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(DEFAULT_SAMPLE);
  const [fileName, setFileName] = useState<string>("result.lines.jpg");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load onnxruntime-web from CDN if not already present
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!window.ort) {
          setStatus({ type: "loading", message: "Loading runtime..." });
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.src = ONNX_RUNTIME_URL;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load onnxruntime-web"));
            document.head.appendChild(s);
          });
        }

        if (cancelled) return;

        const ort = window.ort;
        if (!ort) throw new Error("ONNX Runtime not available");

        // Basic WASM setup; threads auto when crossOriginIsolated
        if ((self as any).crossOriginIsolated) {
          ort.env.wasm.numThreads = (navigator as any).hardwareConcurrency || 1;
        }
        ort.env.wasm.proxy = true;

        setStatus({ type: "loading", message: "Loading model..." });
        const sess = await ort.InferenceSession.create(modelUrl, {
          executionProviders: ["wasm"],
        });

        if (cancelled) return;
        setSession(sess);
        setStatus({ type: "ready" });
      } catch (err: any) {
        console.error(err);
        if (!cancelled) setStatus({ type: "error", message: err?.message || "Init error" });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [modelUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputFile(file);
    setFileName(file.name.replace(/\.[^/.]+$/, "") + ".lines.jpg");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOutputUrl(null);
  };

  const processImage = async () => {
    if (!session) return;
    if (!inputFile) return;
    try {
      setStatus({ type: "processing" });

      const { data, width, height } = await fileToTensorData(inputFile, maxDim);

      const feeds = {
        input: new window.ort.Tensor("float32", data, [1, 3, height, width]),
      };

      const t0 = Date.now();
      const results = await session.run(feeds);
      const dt = Date.now() - t0;
      console.log(`Inference finished in ${dt}ms`);

      const out = results["output"];
      const blob = await greyscaleArrayToBlob(out.data as Float32Array | number[], {
        width: out.dims[3],
        height: out.dims[2],
      });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setStatus({ type: "ready" });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", message: err?.message || "Processing failed" });
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement("a");
    a.href = outputUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Upload/Controls */}
        <div className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-3">Photo to Line Drawing (Free)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Runs entirely in your browser. No upload. Great for quick sketches.
          </p>
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Large images are auto downscaled to {maxDim}px on the long
                side for speed.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={processImage}
                disabled={status.type !== "ready" || !inputFile}
              >
                {status.type === "processing" ? "Processing..." : "Generate"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {status.type === "loading" && status.message}
                {status.type === "ready" && "Model ready"}
                {status.type === "error" && status.message}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-medium">Preview</div>
            <div>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!outputUrl}
              >
                Download
              </Button>
            </div>
          </div>
          <div className="aspect-square md:aspect-auto md:h-[520px] w-full bg-muted flex items-center justify-center">
            {outputUrl ? (
              // show generated line art
              <img
                src={outputUrl}
                alt="Line art result"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              // show sample or selected preview
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
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

