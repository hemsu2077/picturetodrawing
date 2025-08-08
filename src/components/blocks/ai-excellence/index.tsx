import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AIExcellence({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-2 text-center">
          <h2 className="mb-2 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.items?.map((item, i) => (
                    <div key={i} className="flex items-start">
                      <Icon name="RiStarFill" className="text-yellow-500 mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {section.image && (
                <div className="text-center">
                  <img
                    src={section.image.src}
                    alt={section.title || "AI technology"}
                    className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                  />
                  {section.description && (
                    <p className="text-sm text-muted-foreground mt-4 italic">
                      {section.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {section.buttons && section.buttons.length > 0 && (
          <div className="text-center mt-12">
            {section.buttons.map((button, i) => (
              <Button
                key={i}
                variant="default"
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white mr-4"
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