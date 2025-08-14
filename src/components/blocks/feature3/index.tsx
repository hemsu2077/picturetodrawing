import { Badge } from "@/components/ui/badge";
import { Section as SectionType } from "@/types/blocks/section";
import { Upload, Wand2, Download } from "lucide-react";

export default function Feature3({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section className="py-16 bg-teal-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center mb-16">
          {section.label && (
            <Badge variant="outline" className="mb-4">
              {section.label}
            </Badge>
          )}
          <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            {section.description}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            {section.items?.map((item, index) => (
              <div key={index} className="relative">
                {/* line */}
                {index < (section.items?.length || 0) - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-gradient-to-r from-primary/20 to-transparent md:block"></div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  {/* step icon */}
                  <div className="relative mb-6">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index === 0 && <Upload className="h-8 w-8" />}
                      {index === 1 && <Wand2 className="h-8 w-8" />}
                      {index === 2 && <Download className="h-8 w-8" />}
                    </div>
                    {index < (section.items?.length || 0) - 1 && (
                      <div className="absolute left-1/2 top-full mt-2 h-8 w-px bg-primary/20 md:hidden"></div>
                    )}
                  </div>

                  {/* content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
