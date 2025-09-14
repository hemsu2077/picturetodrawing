"use client";

import { Check, Loader } from "lucide-react";
import { PricingItem, Pricing as PricingType } from "@/types/blocks/pricing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useLocale } from "next-intl";

export default function Pricing({ pricing }: { pricing: PricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const locale = useLocale();

  const { user, setShowSignModal } = useAppContext();

  const [group, setGroup] = useState(() => {
    // First look for a group with is_featured set to true
    const featuredGroup = pricing.groups?.find((g) => g.is_featured);
    // If no featured group exists, fall back to the first group
    return featuredGroup?.name || pricing.groups?.[0]?.name;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const handleCheckout = async (item: PricingItem, cn_pay: boolean = false) => {
    try {
      if (!user) {
        setShowSignModal(true);
        return;
      }

      const params = {
        product_id: item.product_id,
        currency: cn_pay ? "cny" : item.currency,
        locale: locale || "en",
      };

      setIsLoading(true);
      setProductId(item.product_id);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setProductId(null);

        setShowSignModal(true);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      const { checkout_url } = data;
      if (!checkout_url) {
        toast.error("checkout failed");
        return;
      }

      window.location.href = checkout_url;
    } catch (e) {
      console.log("checkout failed: ", e);

      toast.error("checkout failed");
    } finally {
      setIsLoading(false);
      setProductId(null);
    }
  };

  useEffect(() => {
    if (pricing.items) {
      const featuredItem = pricing.items.find((i) => i.is_featured);
      setProductId(featuredItem?.product_id || pricing.items[0]?.product_id);
      setIsLoading(false);
    }
  }, [pricing.items]);

  return (
    <section id={pricing.name} className="py-4 sm:py-8 lg:py-16">
      <div className="container px-2 sm:px-4">
        <div className="mx-auto mb-6 sm:mb-8 lg:mb-12 text-center">
          <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold">
            {pricing.title}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-2">
            {pricing.description}
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          {pricing.groups && pricing.groups.length > 0 && (
            <div className="flex flex-col sm:flex-row h-auto sm:h-12 mb-6 sm:mb-8 lg:mb-12 items-center rounded-md bg-muted p-1 text-lg gap-1 sm:gap-0">
              <RadioGroup
                value={group}
                className={`h-full w-full sm:grid-cols-${pricing.groups.length} flex flex-col sm:grid`}
                onValueChange={(value) => {
                  setGroup(value);
                }}
              >
                {pricing.groups.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className='h-10 sm:h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'
                    >
                      <RadioGroupItem
                        value={item.name || ""}
                        id={item.name}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={item.name}
                        className="flex h-full cursor-pointer items-center justify-center px-4 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                      >
                        {item.title}
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-primary bg-primary px-1.5 ml-1 text-primary-foreground"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}
          <div
            className={`w-full mt-0 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${
              Math.min(3, pricing.items?.filter(
                (item) => !item.group || item.group === group
              )?.length || 1)
            }`}
          >
            {pricing.items?.map((item, index) => {
              if (item.group && item.group !== group) {
                return null;
              }

              return (
                <div
                  key={index}
                  className={`rounded-lg p-4 sm:p-6 ${
                    item.is_featured
                      ? "border-primary border-2 bg-card text-card-foreground"
                      : "border-muted border bg-card"
                  }`}
                >
                  <div className="flex h-full flex-col justify-between gap-3 sm:gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        {item.title && (
                          <h3 className="text-lg sm:text-xl font-semibold">
                            {item.title}
                          </h3>
                        )}
                        <div className="flex-1"></div>
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-primary bg-primary px-1.5 text-primary-foreground text-xs"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-end gap-2 mb-3 sm:mb-4">
                        {item.original_price && (
                          <span className="text-lg sm:text-xl text-muted-foreground font-semibold line-through">
                            {item.original_price}
                          </span>
                        )}
                        {item.price && (
                          <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
                            {item.price}
                          </span>
                        )}
                        {item.unit && (
                          <span className="block font-semibold text-sm sm:text-base">
                            {item.unit}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {item.description}
                        </p>
                      )}
                      {item.features_title && (
                        <p className="mb-2 sm:mb-3 mt-4 sm:mt-6 font-semibold text-sm sm:text-base">
                          {item.features_title}
                        </p>
                      )}
                      {item.features && (
                        <ul className="flex flex-col gap-2 sm:gap-3">
                          {item.features.map((feature, fi) => {
                            return (
                              <li className="flex gap-2 text-sm sm:text-base" key={`feature-${fi}`}>
                                <Check className="mt-0.5 sm:mt-1 size-3 sm:size-4 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-2 sm:mt-0">
                      {item.cn_amount && item.cn_amount > 0 ? (
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-x-2 mt-2">
                          <span className="text-xs sm:text-sm">人民币支付 👉</span>
                          <div
                            className="inline-block p-1.5 sm:p-2 hover:cursor-pointer hover:bg-base-200 rounded-md"
                            onClick={() => {
                              if (isLoading) {
                                return;
                              }
                              handleCheckout(item, true);
                            }}
                          >
                            <img
                              src="/imgs/cnpay.png"
                              alt="cnpay"
                              className="w-16 sm:w-20 h-8 sm:h-10 rounded-lg"
                            />
                          </div>
                        </div>
                      ) : null}
                      {item.button && (
                        <Button
                          className="w-full flex items-center justify-center gap-2 font-semibold h-10 sm:h-11 text-sm sm:text-base"
                          disabled={isLoading}
                          onClick={() => {
                            if (isLoading) {
                              return;
                            }
                            handleCheckout(item);
                          }}
                        >
                          {(!isLoading ||
                            (isLoading && productId !== item.product_id)) && (
                            <p>{item.button.title}</p>
                          )}

                          {isLoading && productId === item.product_id && (
                            <p>{item.button.title}</p>
                          )}
                          {isLoading && productId === item.product_id && (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {item.button.icon && (
                            <Icon name={item.button.icon} className="size-4" />
                          )}
                        </Button>
                      )}
                      {item.tip && (
                        <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                          {item.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
