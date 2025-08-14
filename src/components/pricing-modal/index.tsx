"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Pricing from "@/components/blocks/pricing";
import { Pricing as PricingType } from "@/types/blocks/pricing";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pricing: PricingType;
}

export default function PricingModal({ open, onOpenChange, pricing }: PricingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-7xl h-[95vh] max-h-[95vh] overflow-y-auto p-2 sm:p-6">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-sm text-muted-foreground text-center">
         
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <Pricing pricing={pricing} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
