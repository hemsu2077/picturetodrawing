import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ArtStyles({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-2 text-center">
          <h2 className="mb-2 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {section.items?.map((item, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
              {item.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image.src}
                    alt={item.title || "Art style example"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {section.buttons && section.buttons.length > 0 && (
          <div className="text-center">
            {section.buttons.map((button, i) => (
              <Button
                key={i}
                variant={button.variant === "outline" ? "outline" : "default"}
                size="lg"
                className="mr-4"
                asChild
              >
                <a href={button.url} target={button.target || "_self"}>
                  {button.icon && <Icon name={button.icon} className="mr-2" />}
                  {button.title}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}