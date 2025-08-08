import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransformationExamples({ section }: { section: SectionType }) {
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

        <div className="space-y-16">
          {section.items?.map((item, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-8 items-center">
              <div className={`space-y-6 ${i % 2 === 1 ? 'order-2 md:order-1' : ''}`}>
                <Card className="bg-gray-50 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {item.icon && <Icon name={item.icon} className="mr-3 text-blue-600" />}
                      <h4 className="text-lg font-semibold">Original Photo</h4>
                    </div>
                    {item.image && (
                      <img
                        src={item.image.src}
                        alt={item.title || "Original photo"}
                        className="w-full rounded-lg shadow-lg"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className={`space-y-6 ${i % 2 === 1 ? 'order-1 md:order-2' : ''}`}>
                <Card className="bg-purple-50 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Icon name="RiPencilLine" className="mr-3 text-purple-600" />
                      <h4 className="text-lg font-semibold">Picture to Drawing Result</h4>
                    </div>
                    {item.children?.[0]?.image && (
                      <img
                        src={item.children[0].image.src}
                        alt={item.children[0].title || "Transformed drawing"}
                        className="w-full rounded-lg shadow-lg"
                      />
                    )}
                  </CardContent>
                </Card>
                {item.children?.[0]?.description && (
                  <p className="text-muted-foreground italic text-center">
                    {item.children[0].description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {section.buttons && section.buttons.length > 0 && (
          <div className="text-center mt-16">
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