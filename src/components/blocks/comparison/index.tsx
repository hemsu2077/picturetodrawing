import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Comparison({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24 bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center mb-16 animate-in fade-in duration-700 slide-in-from-bottom-4">
          <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {section.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {section.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {section.items?.map((item, i) => (
            <div 
              key={i} 
              className="group animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${300 + i * 150}ms` }}
            >
              <Card className={`
                relative border-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl text-center p-4 h-full flex flex-col
                ${i === 2 ? 'bg-primary/5 ring-2 ring-primary/20 shadow-lg' : 
                  i === 1 ? 'bg-red-50/50 ring-1 ring-red-200/50' : 
                  'bg-card/30 ring-1 ring-border/50'}
              `}>
                {i === 2 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium shadow-md">
                      ⭐ Recommended
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-0 space-y-4 flex flex-col flex-1">
                  {item.image && (
                    <div className="relative group/img">
                      <div className="aspect-square overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                        <img
                          src={item.image.src}
                          alt={item.title + " - Picture to Drawing"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-background via-muted/20 to-background rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                    </div>
                  )}
                  
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className={`text-base md:text-lg font-semibold mb-2 transition-colors duration-200 ${i === 2 ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                        {item.title}
                      </h3>
                      
                      <p className={`text-sm leading-relaxed ${i === 2 ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="mt-3">
                      {i === 0 && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium">
                          Original Photo
                        </div>
                      )}
                      {i === 1 && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                          Traditional Filter
                        </div>
                      )}
                      {i === 2 && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-sm">
                          AI Conversion
                        </div>
                      )}
                    </div>
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