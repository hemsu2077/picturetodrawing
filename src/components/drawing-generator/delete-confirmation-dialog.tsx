"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawing } from './shared-types';

interface DeleteConfirmationDialogProps {
  drawing: Drawing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (drawing: Drawing) => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({ 
  drawing, 
  isOpen, 
  onClose, 
  onConfirm,
  isDeleting = false
}: DeleteConfirmationDialogProps) {
  if (!drawing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onConfirm(drawing)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
