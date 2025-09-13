import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

export default function Feature1({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24 bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20 animate-in fade-in duration-700 slide-in-from-bottom-4">
          {section.image && (
            <div className="relative order-2 lg:order-1 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-background via-muted/20 to-background rounded-3xl blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-70"></div>            
                  <video
                    src={section.image?.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    className="w-[420px] justify-self-center rounded-lg object-cover aspect-square"
                  >
                    Your browser does not support the video tag.
                  </video>
  
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-3xl rounded-full transition-all duration-500 group-hover:bg-accent/10"></div>
            </div>
          )}
          
          <div className="flex flex-col space-y-8 order-1 lg:order-2">
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-both delay-150">
                {section.title}
              </h2>
            )}
            
            {section.description && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-both delay-300">
                {section.description}
              </p>
            )}
            
            <ul className="space-y-6 mt-4">
              {section.items?.map((item, i) => (
                <li 
                  key={i} 
                  className="flex items-start animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-both group hover:translate-x-1 transition-transform duration-200"
                  style={{ animationDelay: `${450 + i * 100}ms` }}
                >
                  {item.icon && (
                    <div className="mr-4 p-2 rounded-md bg-primary/5 text-primary transition-all duration-200 group-hover:bg-primary/10 group-hover:scale-110">
                      <Icon
                        name={item.icon}
                        className="size-5 shrink-0"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-medium text-foreground mb-2 transition-colors duration-200 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
