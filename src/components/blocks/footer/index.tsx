import { Footer as FooterType } from "@/types/blocks/footer";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

export default function Footer({ footer }: { footer: FooterType }) {
  if (footer.disabled) {
    return null;
  }

  return (
    <section id={footer.name} className="py-16">
      <div className="max-w-7xl mx-auto px-8">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              {footer.brand && (
                <div>
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    {footer.brand.logo && (
                      <img
                        src={footer.brand.logo.src}
                        alt={footer.brand.logo.alt || footer.brand.title}
                        className="h-11"
                      />
                    )}
                    {footer.brand.title && (
                      <p className="text-3xl font-semibold">
                        {footer.brand.title}
                      </p>
                    )}
                  </div>
                  {footer.brand.description && (
                    <p className="mt-6 text-md text-muted-foreground">
                      {footer.brand.description}
                    </p>
                  )}
                </div>
              )}
              {/* {footer.social && (
                <ul className="flex items-center space-x-6 text-muted-foreground">
                  {footer.social.items?.map((item, i) => (
                    <li key={i} className="font-medium hover:text-primary">
                      <a href={item.url || ""} target={item.target}>
                        {item.icon && (
                          <Icon name={item.icon} className="size-4" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )} */}
            </div>
            <div className="grid grid-cols-3 gap-6">
              {footer.nav?.items?.map((item, i) => (
                <div key={i}>
                  <p className="mb-6 font-bold">{item.title}</p>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    {item.children?.map((iitem, ii) => (
                      <li key={ii} className="font-medium hover:text-primary">
                        <Link href={iitem.url || ""} target={iitem.target}>
                          {iitem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            {footer.copyright && (
              <p>
                {footer.copyright}
                {process.env.NEXT_PUBLIC_SHOW_POWERED_BY === "false" ? null : (
                  <a
                    href="https://picturetodrawing.com"
                    target="_blank"
                    className="px-2 text-primary"
                  >
                  </a>
                )}
              </p>
            )}
            {footer.agreement && (
              <ul className="flex justify-center gap-4 lg:justify-start">
                {footer.agreement.items?.map((item, i) => (
                  <li key={i} className="hover:text-primary">
                    <a href={item.url || ""} target={item.target}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="https://www.toolify.ai/tool/picture-to-drawing-1" target="_blank" rel="noopener noreferrer"><img src="https://cdn.toolify.ai/featured_light.svg" alt="U-Tools badge" width="160" height="54"/></a>
            <a href="https://fazier.com/launches/picturetodrawing.com" target="_blank"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=neutral" width="160" height="60" alt="Fazier badge" /></a>
            <a href="https://turbo0.com/item/picture-to-drawing" target="_blank" rel="noopener noreferrer"><img src="https://img.turbo0.com/badge-listed-light.svg" alt="Listed on Turbo0" width="120" height="54"/></a>       
            <a href="https://twelve.tools" target="_blank"><img src="https://twelve.tools/badge2-light.svg" alt="Featured on Twelve Tools" width="150" height="54"/></a>
            <a title="ai tools code.market" href="https://code.market?code.market=verified"><img alt="ai tools code.market" title="ai tools code.market" src="https://code.market/assets/manage-product/featured-logo-bright.svg" width="160" height="54"/></a>
            <a href="https://tinylaunch.com" target="_blank" rel="noopener"> <img src="https://tinylaunch.com/tinylaunch_badge_featured_on.svg" alt="TinyLaunch Badge" width="140" height="54"/></a>
            <a href="https://dang.ai/" target="_blank" ><img src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png" alt="Dang.ai" width="120" height="54"/></a>
            <a href="https://toolsfine.com/" target="_blank" ><img src="https://toolsfine.com/wp-content/uploads/2023/08/Toolsfine-logo-day-0531-80x320-1.webp" alt="Toolsfine" width="120" height="54"/></a>
            <a href="https://findly.tools/picture-to-drawing?utm_source=picture-to-drawing" target="_blank"> <img  src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on findly.tools"  width="120" /></a>
            <a href="https://dofollow.tools" target="_blank"><img src="https://dofollow.tools/badge/badge_light.svg" alt="Featured on Dofollow.Tools" width="135" height="30" /></a>
          </div>
        </footer>
      </div>
    </section>
  );
}
