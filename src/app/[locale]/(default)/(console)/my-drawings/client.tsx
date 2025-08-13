"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Drawing {
  uuid: string;
  generated_image_url: string;
  original_image_url: string | null;
  style: string;
  ratio: string | null;
  created_at: Date | null;
  filename: string | null;
}

interface MyDrawingsClientProps {
  drawings: Drawing[];
}

export default function MyDrawingsClient({ drawings }: MyDrawingsClientProps) {
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [drawingsList, setDrawingsList] = useState(drawings);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drawingToDelete, setDrawingToDelete] = useState<Drawing | null>(null);

  const handleDelete = async (drawing: Drawing) => {
    try {
      const response = await fetch(`/api/delete-drawing/${drawing.uuid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete drawing");
      }

      setDrawingsList(prev => prev.filter(d => d.uuid !== drawing.uuid));
      toast.success("Drawing deleted successfully");
      setIsDeleteDialogOpen(false);
      setDrawingToDelete(null);
    } catch (error) {
      console.error("Error deleting drawing:", error);
      toast.error("Failed to delete drawing");
    }
  };

  const handleDownload = async (drawing: Drawing) => {
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
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStyle = (style: string) => {
    return style
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (drawingsList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Drawings Yet</h1>
            <p className="text-gray-600 mb-8">
              You haven't created any drawings yet. Start by converting your first image!
            </p>
          </div>
          <Link href="/#drawing-generator">
            <Button size="lg" className="px-8">
              Convert to Drawing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Drawings</h1>
        <p className="text-gray-600">View and manage your converted drawings</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {drawingsList.map((drawing) => (
          <Card key={drawing.uuid} className="group relative overflow-hidden shadow-none py-0 cursor-pointer" onClick={() => setSelectedDrawing(drawing)}>
            <div className="aspect-square relative">
              <Image
                src={drawing.generated_image_url}
                alt={`Drawing in ${drawing.style} style`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              
              {/* Style badge - shown on hover */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800">
                  {formatStyle(drawing.style)}
                </div>
              </div>

              {/* Delete button - shown on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDrawingToDelete(drawing);
                  setIsDeleteDialogOpen(true);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Image Detail Modal */}
      <Dialog open={!!selectedDrawing} onOpenChange={() => setSelectedDrawing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedDrawing && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative aspect-square bg-gray-100 rounded-lg md:col-span-2">
                <Image
                  src={selectedDrawing.generated_image_url}
                  alt={`Drawing in ${selectedDrawing.style} style`}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Drawing Details</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Style</label>
                    <p className="text-gray-900">{formatStyle(selectedDrawing.style)}</p>
                  </div>
                  
                  {selectedDrawing.ratio && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Aspect Ratio</label>
                      <p className="text-gray-900">{selectedDrawing.ratio}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">{formatDate(selectedDrawing.created_at)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleDownload(selectedDrawing)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Drawing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this drawing? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => drawingToDelete && handleDelete(drawingToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
