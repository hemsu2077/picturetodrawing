import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerfectUses({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-2 text-center">
          <h2 className="mb-2 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items?.map((item, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              {item.image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={item.image.src}
                    alt={item.title || "Use case example"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
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