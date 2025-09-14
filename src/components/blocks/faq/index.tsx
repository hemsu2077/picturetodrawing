"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Section as SectionType } from "@/types/blocks/section";
import { ChevronDown } from "lucide-react";

export default function FAQ({ section }: { section: SectionType }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  if (section.disabled) {
    return null;
  }

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id={section.name} className="py-16">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          {section.label && (
            <Badge variant="outline" className="text-xs font-medium mb-4">
              {section.label}
            </Badge>
          )}
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            {section.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {section.description}
          </p>
        </div>
        
        <div className="space-y-2 max-w-3xl mx-auto">
          {section.items?.map((item, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200"
              >
                <h3 className="font-medium text-foreground pr-4">
                  {item.title}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                    openItems.has(index) ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openItems.has(index)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4 pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
