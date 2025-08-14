import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Comparison({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-2 text-center">
          <h2 className="mb-2 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {section.items?.map((item, i) => (
            <div key={i} className="text-center">
              <div className={`
                relative rounded-xl border-2 
                ${i === 2 ? 'border-primary bg-background ring-primary/20' : 
                  i === 1 ? 'border-red-200 bg-background' : 
                  'border-gray-200 bg-white'}
              `}>
                {i === 2 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1 text-sm font-semibold">
                      ⭐ Recommended
                    </Badge>
                  </div>
                )}
                
                <div className="p-6">
                  {item.image && (
                    <div className="aspect-square mb-6 overflow-hidden rounded-xl border-2 border-gray-100">
                      <img
                        src={item.image.src}
                        alt={item.title + " - Picture to Drawing"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className={`text-xl font-bold mb-4 ${i === 2 ? 'text-primary' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  
                  <p className={`${i === 2 ? 'text-gray-700' : 'text-muted-foreground'} leading-relaxed`}>
                    {item.description}
                  </p>
                  
                  <div className="mt-6">
                    {i === 0 && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                       Original Photo
                      </div>
                    )}
                    {i === 1 && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm">
                        Traditional Filter
                      </div>
                    )}
                    {i === 2 && (
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-white font-medium">
                         AI Conversion
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}