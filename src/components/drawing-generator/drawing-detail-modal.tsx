"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Trash2 } from 'lucide-react';
import { Drawing } from './shared-types';
import { formatStyle, formatModel, formatRatio, formatDate, handleDownload } from './shared-utils';
import { useTranslations } from 'next-intl';

interface DrawingDetailModalProps {
  drawing: Drawing | null;
  isOpen: boolean;
  onClose: () => void;
  showToast?: boolean;
  showDeleteButton?: boolean;
  onDelete?: (drawing: Drawing) => void;
}

export function DrawingDetailModal({ 
  drawing, 
  isOpen, 
  onClose,
  showToast = false,
  showDeleteButton = false,
  onDelete
}: DrawingDetailModalProps) {
  const t = useTranslations('drawing_generator');
  if (!drawing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="relative aspect-square bg-gray-100 rounded-lg md:col-span-2">
            <Image
              src={drawing.generated_image_url}
              alt={t('drawing_alt', { style: drawing.style })}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t('drawing_details')}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">{t('style')}</label>
                <p className="text-gray-900">{formatStyle(drawing.style)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('ai_model_label')}</label>
                <p className="text-gray-900">{formatModel(drawing.model)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('aspect_ratio_label')}</label>
                <p className="text-gray-900">{formatRatio(drawing.ratio)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('created')}</label>
                <p className="text-gray-900">{formatDate(drawing.created_at)}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => handleDownload(drawing, showToast)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('download')}
              </Button>
              
              {showDeleteButton && onDelete && (
                <Button 
                  variant="destructive"
                  onClick={() => {
                    onDelete(drawing);
                    onClose();
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('delete')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
