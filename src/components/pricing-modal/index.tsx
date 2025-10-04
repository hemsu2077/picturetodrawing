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
import { toast } from "sonner";

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

    const featureIndices = [0, 2, 3];
    const selected = featureIndices
      .map((index) => basicPlan.features?.[index])
      .filter((feature): feature is string => Boolean(feature));

    return [...selected, t("cancel_anytime")];
  }, [basicPlan?.features, t]);

  const handleCheckout = async () => {
    if (!basicPlan) {
      toast.error("Plan not available");
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
        toast.error(message || "checkout failed");
        return;
      }

      const { checkout_url: checkoutUrl } = data || {};
      if (!checkoutUrl) {
        toast.error("checkout failed");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed", error);
      toast.error("checkout failed");
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
          <Card className="mt-4 bg-card text-card-foreground border border-border">
            <CardHeader className="items-center gap-2 text-center">
              <CardTitle className="text-xl font-semibold">
                {basicPlan.title}
              </CardTitle>
              <div className="text-4xl font-bold">
                {basicPlan.price}{" "}
                <span className="text-base font-medium text-muted-foreground">
                  {basicPlan.unit}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {basicPlan.features_title && (
                <p className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wide">
                  {basicPlan.features_title}
                </p>
              )}
              <ul className="flex flex-col gap-3">
                {featuresToDisplay.map((feature, index) => (
                  <li key={`${basicPlan.product_id}-feature-${index}`} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {t("cta")}
              </Button>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors text-center">
                {t("view_all")}
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="mt-6 text-sm text-center text-muted-foreground">
            <p>{t("view_all")}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
