"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Loader } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pricing as PricingType, PricingItem } from "@/types/blocks/pricing";
import { useAppContext } from "@/contexts/app";
// Defer sonner until it's used
const showError = async (msg: string) => {
  const { toast } = await import("sonner");
  toast.error(msg);
};

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pricing: PricingType;
}

const BASIC_MONTHLY_PRODUCT_ID = "basic-monthly";

export default function PricingModal({ open, onOpenChange, pricing }: PricingModalProps) {
  const t = useTranslations("pricing_modal");
  const locale = useLocale();
  const { user, setShowSignModal } = useAppContext();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const basicPlan = useMemo<PricingItem | undefined>(() => {
    return pricing.items?.find((item) => item.product_id === BASIC_MONTHLY_PRODUCT_ID);
  }, [pricing.items]);

  const featuresToDisplay = useMemo(() => {
    if (!basicPlan?.features) {
      return [] as string[];
    }

    const featureIndices = [0, 1, 3];
    const selected = featureIndices
      .map((index) => basicPlan.features?.[index])
      .filter((feature): feature is string => Boolean(feature));

    return [...selected, t("cancel_anytime")];
  }, [basicPlan?.features, t]);

  const handleCheckout = async () => {
    if (!basicPlan) {
      await showError("Plan not available");
      return;
    }

    if (!user) {
      setShowSignModal(true);
      return;
    }

    try {
      setIsCheckingOut(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: basicPlan.product_id,
          currency: basicPlan.currency,
          locale: locale || "en",
        }),
      });

      if (response.status === 401) {
        setShowSignModal(true);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        await showError(message || "checkout failed");
        return;
      }

      const { checkout_url: checkoutUrl } = data || {};
      if (!checkoutUrl) {
        await showError("checkout failed");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed", error);
      await showError("checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-md p-6 sm:p-8">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-lg font-semibold">
            {t("headline")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        {basicPlan ? (
          <Card className="mt-4 shadow-sm !py-4 !gap-3">
            <CardHeader className="text-center !px-5 !pb-2 !gap-1">
              <CardTitle className="text-lg font-semibold">
                {basicPlan.title}
              </CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {basicPlan.price}
                </span>
                <span className="text-sm font-medium text-muted-foreground ml-1">
                  {basicPlan.unit}
                </span>
              </div>
            </CardHeader>
            <CardContent className="!px-5 !pb-3">
              {basicPlan.features_title && (
                <div className="mb-3 text-center">
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {basicPlan.features_title}
                  </span>
                </div>
              )}
              <div className="space-y-2.5">
                {featuresToDisplay.map((feature, index) => (
                  <div key={`${basicPlan.product_id}-feature-${index}`} className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 !px-5 !pt-0">
              <Button 
                className="w-full h-10 text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-shadow" 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
              >
                {isCheckingOut && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {t("cta")}
              </Button>
              <Link href={`/${locale || "en"}/pricing`} className="text-xs text-muted-foreground hover:text-primary transition-colors text-center font-medium">
                {t("view_all")}
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="mt-6 text-sm text-center">
            <Link href={`/${locale || "en"}/pricing`} className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t("view_all")}
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
