import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

export default function Feature({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl tracking-tight">
            {section.title}
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-base lg:text-lg leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((item, i) => (
            <div 
              key={i} 
              className="group relative"
            >
              {/* Feature Card */}
              <div className="flex flex-col items-center text-center space-y-6 p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm">
                {/* Icon Container */}
                {item.icon && (
                  <div className="relative">
                    <div className="flex w-16 h-16 lg:w-18 lg:h-18 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-blue-300 group-hover:from-blue-100 group-hover:to-indigo-100">
                      <Icon name={item.icon} className="text-primary text-2xl lg:text-3xl" />
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-blue-200/30 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"></div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base max-w-sm">
                    {item.description}
                  </p>
                </div>

                {/* Subtle bottom accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
