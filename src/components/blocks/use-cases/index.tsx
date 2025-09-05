import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UseCases({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {section.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items?.map((item, i) => (
            <Card key={i} className="bg-white rounded-lg p-6 shadow-sm border-none">
              {item.icon && (
                <div className="mb-4">
                  <Icon name={item.icon} className="text-3xl text-gray-700" />
                </div>
              )}
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
                {item.children && Array.isArray(item.children) && (
                  <ul className="text-gray-600 space-y-2">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex} className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>{typeof child === 'string' ? child : child.description || ''}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
