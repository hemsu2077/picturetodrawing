import { Button } from "@/components/ui/button";
import { Button as ButtonType } from "@/types/blocks/base";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

export default function Toolbar({ items }: { items?: ButtonType[] }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-8">
      {items?.map((item, idx) => (
        <Button
          key={idx}
          variant={item.variant}
          size="sm"
          className={`text-xs sm:text-sm ${item.className || ""}`}
        >
          <Link
            href={item.url as any}
            target={item.target}
            className="flex items-center gap-1"
          >
            {item.icon && <Icon name={item.icon} className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="truncate">{item.title}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
