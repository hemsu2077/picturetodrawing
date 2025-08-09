import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Button } from "@/components/ui/button";

export default function TransformationExamples({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Examples Grid */}
        <div className="space-y-32">
          {section.items?.map((item, i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image side */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                {item.image && (
                  <div className="relative">
                    <div className="absolute -inset-4 bg-white rounded-3xl shadow-sm"></div>
                    <img
                      src={item.image.src}
                      alt={item.title || "Art style example"}
                      className="relative w-full rounded-2xl border border-slate-200/60 transition-transform duration-500 hover:scale-[1.02]"
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
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-4">
                    {item.description && (
                      <p className="text-lg text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    
                    {item.children?.[0]?.description && (
                      <p className="text-base text-slate-500 border-l-2 border-slate-200 pl-4">
                        {item.children[0].description}
                      </p>
                    )}
                  </div>
                  
                  {/* CTA Button */}
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-slate-900 hover:bg-slate-800 text-white border-0 rounded-xl px-8 py-3 h-auto font-medium transition-colors duration-200"
                    asChild
                  >
                    <a href="/pricing" target="_self">
                      <Icon name="RiBrushLine" className="mr-2 text-lg" />
                      Try {item.title} Style
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Buttons */}
        {section.buttons && section.buttons.length > 0 && (
          <div className="text-center mt-20">
            <div className="flex flex-wrap justify-center gap-4">
              {section.buttons.map((button, i) => (
                <Button
                  key={i}
                  variant={button.variant === "outline" ? "outline" : "default"}
                  size="lg"
                  className={
                    button.variant === "outline" 
                      ? "border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl px-8 py-3 h-auto font-medium"
                      : "bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 py-3 h-auto font-medium"
                  }
                  asChild
                >
                  <a href={button.url} target={button.target || "_self"}>
                    {button.icon && <Icon name={button.icon} className="mr-2" />}
                    {button.title}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}