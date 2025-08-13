"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Drawing } from "@/components/drawing-generator/shared-types";
import { DrawingCard } from "@/components/drawing-generator/drawing-card";
import { DrawingDetailModal } from "@/components/drawing-generator/drawing-detail-modal";
import { DeleteConfirmationDialog } from "@/components/drawing-generator/delete-confirmation-dialog";

interface MyDrawingsClientProps {
  drawings: Drawing[];
}

export default function MyDrawingsClient({ drawings }: MyDrawingsClientProps) {
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [drawingsList, setDrawingsList] = useState(drawings);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drawingToDelete, setDrawingToDelete] = useState<Drawing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (drawing: Drawing) => {
    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
    }
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
          <DrawingCard
            key={drawing.uuid}
            drawing={drawing}
            onClick={() => setSelectedDrawing(drawing)}
            showDeleteButton={true}
            showDownloadButton={true}
            showToast={true}
            onDelete={() => {
              setDrawingToDelete(drawing);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      {/* Image Detail Modal */}
      <DrawingDetailModal
        drawing={selectedDrawing}
        isOpen={!!selectedDrawing}
        onClose={() => setSelectedDrawing(null)}
        showToast={true}
        showDeleteButton={true}
        onDelete={(drawing) => {
          setSelectedDrawing(null);
          setDrawingToDelete(drawing);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        drawing={drawingToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
