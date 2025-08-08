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

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {section.items?.map((item, i) => (
            <div key={i} className="text-center">
              <Card className={`${i === 1 ? 'bg-red-50 border-red-200' : i === 2 ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <CardContent className="p-6">
                  {item.image && (
                    <div className="aspect-square mb-6 overflow-hidden rounded-lg">
                      <img
                        src={item.image.src}
                        alt={item.title || "Comparison example"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  {i === 1 && (
                    <div className="mt-4">
                      <Badge variant="destructive" className="bg-red-500">
                        ❌ Basic Filter
                      </Badge>
                    </div>
                  )}
                  {i === 2 && (
                    <div className="mt-4">
                      <Badge variant="default" className="bg-green-500">
                        ✓ Our AI
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}