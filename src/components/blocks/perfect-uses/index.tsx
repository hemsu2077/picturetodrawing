import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent } from "@/components/ui/card";

export default function PerfectUses({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center mb-16 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {section.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {section.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {section.items?.map((item, i) => (
            <div 
              key={i} 
              className="group animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-both h-full"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <Card className="border-0 bg-white backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg p-4 md:p-6 text-center h-full flex flex-col">
                <CardContent className="p-0 space-y-3 md:space-y-4 flex flex-col flex-1">
                  {item.image && (
                    <div className="flex justify-center flex-shrink-0">
                      <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-110">
                          <img
                            src={item.image.src}
                            alt={item.title + " - Picture to Drawing"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    <h3 className="text-sm md:text-base font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}