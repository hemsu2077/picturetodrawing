"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawing } from './shared-types';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
  if (!drawing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete_dialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            {t("delete_dialog.message")}
          </p>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isDeleting}
            >
              {t("delete_dialog.cancel")}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onConfirm(drawing)}
              disabled={isDeleting}
            >
              {isDeleting ? t("delete_dialog.deleting") : t("delete_dialog.delete")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
