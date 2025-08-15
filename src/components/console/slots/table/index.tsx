import { Separator } from "@/components/ui/separator";
import TableBlock from "@/components/blocks/table";
import { Table as TableSlotType } from "@/types/slots/table";
import Toolbar from "@/components/blocks/toolbar";

export default function ({ ...table }: TableSlotType) {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h3 className="text-base sm:text-lg font-medium truncate">{table.title}</h3>
        {table.description && (
          <p className="text-sm text-muted-foreground mt-1">{table.description}</p>
        )}
      </div>
      {table.tip && (
        <p className="text-xs sm:text-sm text-muted-foreground bg-muted/50 p-2 sm:p-3 rounded-md">
          {table.tip.description || table.tip.title}
        </p>
      )}
      {table.toolbar && (
        <div className="flex flex-wrap gap-2">
          <Toolbar items={table.toolbar.items} />
        </div>
      )}
      <Separator className="hidden sm:block" />
      <TableBlock {...table} />
    </div>
  );
}
