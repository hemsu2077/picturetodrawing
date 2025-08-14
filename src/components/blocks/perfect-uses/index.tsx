import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerfectUses({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16 lg:py-20 bg-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <h2 className="mb-4 text-pretty text-2xl font-bold sm:text-3xl lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-12 max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed">
            {section.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {section.items?.map((item, i) => (
            <Card key={i} className="bg-white border-none shadow-none transition-colors duration-200">
              {item.image ? (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={item.image.src}
                    alt={item.title + " - Picture to Drawing"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-orange-100 to-orange-200">
                  <img
                    src={`https://picsum.photos/400/225?random=${i + 1}`}
                    alt={item.title || "Use case example"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl text-gray-900">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}