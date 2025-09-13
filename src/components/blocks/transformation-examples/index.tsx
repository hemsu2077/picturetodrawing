import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Button } from "@/components/ui/button";

export default function TransformationExamples({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24 bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {section.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Examples Grid */}
        <div className="space-y-0">
          {section.items?.map((item, i) => (
            <div 
              key={i} 
              className="grid lg:grid-cols-2 gap-16 items-center animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${300 + i * 200}ms` }}
            >
              {/* Image side */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : 'lg:order-1'} relative group`}>
                {item.image && (
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-background via-muted/20 to-background rounded-3xl blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-70"></div>
                    <img
                      src={item.image.src}
                      alt={item.title + " - Picture to Drawing style example"}
                      className="relative w-[80%] justify-self-center rounded-lg object-contain aspect-square transition-all duration-300 hover:scale-[1.02]"
                    />
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-3xl rounded-full transition-all duration-500 group-hover:bg-accent/10"></div>
                  </div>
                )}
              </div>
              
              {/* Content side */}
              <div className={`${i % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="space-y-8">
                  {/* Icon & Title */}
                  <div className="space-y-6">
                    {item.icon && (
                      <div className="inline-flex w-14 h-14 bg-primary/10 text-primary rounded-2xl items-center justify-center transition-all duration-200 hover:bg-primary/15 hover:scale-110">
                        <Icon name={item.icon} className="text-xl" />
                      </div>
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-6">
                    {item.description && (
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    
                    {item.children?.[0]?.description && (
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full"></div>
                        <p className="text-sm md:text-base text-muted-foreground/80 leading-relaxed italic">
                          {item.children[0].description}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 group"
                    asChild
                  >
                    <a href="#drawing-generator" target="_self">
                      <Icon name="RiBrushLine" className="mr-2 text-lg transition-transform duration-200 group-hover:rotate-12" />
                      {item.buttons?.[0]?.title}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}