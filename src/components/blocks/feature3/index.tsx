import { Badge } from "@/components/ui/badge";
import { Section as SectionType } from "@/types/blocks/section";
import { Upload, Wand2, Download } from "lucide-react";

export default function Feature3({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-indigo-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          {section.label && (
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/60 backdrop-blur-sm border-0 text-slate-700">
              {section.label}
            </Badge>
          )}
         <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl tracking-tight">
            {section.title}
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-base lg:text-lg leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Horizontal Layout */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
            {/* Connection lines */}
            <div className="absolute top-16 left-0 right-0 hidden md:flex items-center justify-between px-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-slate-300"></div>
              <div className="w-8"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {section.items?.map((item, index) => (
              <div key={index} className="relative text-center">
                {/* Step content */}
                <div className="space-y-6">
                  {/* Icon container */}
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:border-slate-300">
                      {index === 0 && <Upload className="h-10 w-10" />}
                      {index === 1 && <Wand2 className="h-10 w-10" />}
                      {index === 2 && <Download className="h-10 w-10" />}
                    </div>
                    
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base text-slate-600 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Mobile connection line */}
                {index < (section.items?.length || 0) - 1 && (
                  <div className="absolute left-1/2 top-full mt-6 h-12 w-px bg-gradient-to-b from-slate-300 to-transparent md:hidden transform -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
