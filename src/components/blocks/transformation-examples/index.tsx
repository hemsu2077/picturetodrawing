import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Button } from "@/components/ui/button";

export default function TransformationExamples({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>

        {/* Examples Grid */}
        <div className="space-y-16">
          {section.items?.map((item, i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image side */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                {item.image && (
                  <div className="relative">
                    <div className="absolute -inset-4"></div>
                    <img
                      src={item.image.src}
                      alt={item.title + " - Picture to Drawing style example"}
                      className="relative w-full transition-transform duration-500 hover:scale-[1.02] px-8"
                    />
                  </div>
                )}
              </div>
              
              {/* Content side */}
              <div className={`${i % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="space-y-8">
                  {/* Icon & Title */}
                  <div className="space-y-4">
                    {item.icon && (
                      <div className="inline-flex w-14 h-14 bg-slate-900 rounded-2xl items-center justify-center">
                        <Icon name={item.icon} className="text-white text-xl" />
                      </div>
                    )}
                    <h3 className="text-3xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-4">
                    {item.description && (
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    
                    {item.children?.[0]?.description && (
                      <p className="text-base text-muted-foreground border-l-2 border-border pl-4">
                        {item.children[0].description}
                      </p>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className=""
                    asChild
                  >
                    <a href="#drawing-generator" target="_self">
                      <Icon name="RiBrushLine" className="mr-2 text-lg" />
                     Convert your photo to drawing
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