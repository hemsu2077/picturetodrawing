import Image from "next/image";
import Link from "next/link";
import { Section as SectionType } from "@/types/blocks/section";

export default function Showcase({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section className="container">
      <div className="mx-auto mb-12 text-center">
        <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
          {section.title}
        </h2>
        <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
          {section.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.items?.map((item, index) => (
          <Link key={index} href={item.url || ""} target={item.target}>
            <div className="group overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 transition-all hover:border-primary/30">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={item.image?.src || ""}
                  alt={item.image?.alt || item.title || ""}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
