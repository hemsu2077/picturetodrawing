import { Badge } from "@/components/ui/badge";
import { Section as SectionType } from "@/types/blocks/section";
import { Upload, Wand2, Download } from "lucide-react";

export default function Feature3({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in duration-700 slide-in-from-bottom-4">
          {section.label && (
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs font-medium bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
              {section.label}
            </Badge>
          )}
          <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {section.title}
          </h2>
          <p className="max-w-3xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Horizontal Layout */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connection lines */}
            <div className="absolute top-12 left-0 right-0 hidden md:flex items-center justify-between px-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/30 to-border/30"></div>
              <div className="w-6"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-border/30 to-transparent"></div>
            </div>

            {section.items?.map((item, index) => (
              <div 
                key={index} 
                className="relative text-center animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-both"
                style={{ animationDelay: `${300 + index * 200}ms` }}
              >
                {/* Step content */}
                <div className="space-y-4">
                  {/* Icon container */}
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-background shadow-sm">
                      {index === 0 && <Upload className="h-6 w-6 md:h-8 md:w-8 text-primary" />}
                      {index === 1 && <Wand2 className="h-6 w-6 md:h-8 md:w-8 text-primary" />}
                      {index === 2 && <Download className="h-6 w-6 md:h-8 md:w-8 text-primary" />}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Mobile connection line */}
                {index < (section.items?.length || 0) - 1 && (
                  <div className="absolute left-1/2 top-full mt-4 h-8 w-px bg-gradient-to-b from-border/30 to-transparent md:hidden transform -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
