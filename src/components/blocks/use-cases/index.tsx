import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

export default function UseCases({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((item, i) => (
            <div key={i} className="group relative">
              <div className="h-full bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 border border-gray-100">
                {/* Icon & Title */}
                <div className="space-y-6 mb-6">
                  {item.icon && (
                    <div className="inline-flex w-14 h-14 bg-slate-900 rounded-2xl items-center justify-center">
                      <Icon name={item.icon} className="text-white text-xl" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                </div>
                
                {/* Description */}
                <div className="space-y-4">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Children List */}
                  {item.children && Array.isArray(item.children) && (
                    <ul className="space-y-3 mt-6">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex} className="flex items-start text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 mr-3 flex-shrink-0"></div>
                          <span className="leading-relaxed">
                            {typeof child === 'string' ? child : child.description || ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Subtle hover accent */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
