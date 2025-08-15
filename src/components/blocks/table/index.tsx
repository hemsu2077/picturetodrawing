import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableColumn } from "@/types/blocks/table";
import TableItemImage from "./image";
import TableItemLabel from "./label";
import TableItemTime from "./time";
import Copy from "./copy";
import { Card, CardContent } from "@/components/ui/card";

export default function TableComponent({
  columns,
  data,
  emptyMessage,
}: {
  columns?: TableColumn[];
  data?: any[];
  emptyMessage?: string;
}) {
  if (!columns) {
    columns = [];
  }

  const renderCellContent = (column: TableColumn, item: any) => {
    const value = item[column.name as keyof typeof item];
    const content = column.callback ? column.callback(item) : value;

    let cellContent = content;

    if (column.type === "image") {
      cellContent = (
        <TableItemImage
          value={value}
          options={column.options}
          className={column.className}
        />
      );
    } else if (column.type === "time") {
      cellContent = (
        <TableItemTime
          value={value}
          options={column.options}
          className={column.className}
        />
      );
    } else if (column.type === "label") {
      cellContent = (
        <TableItemLabel
          value={value}
          options={column.options}
          className={column.className}
        />
      );
    } else if (column.type === "copy" && value) {
      cellContent = <Copy text={value}>{content}</Copy>;
    }

    return cellContent;
  };

  // Mobile Card Layout
  const MobileLayout = () => (
    <div className="space-y-3 md:hidden">
      {data && data.length > 0 ? (
        data.map((item: any, idx: number) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-4 space-y-3">
              {columns?.map((column: TableColumn, iidx: number) => {
                if (!column.title) return null;
                const cellContent = renderCellContent(column, item);
                if (!cellContent) return null;
                
                return (
                  <div key={iidx} className="flex justify-between items-start gap-2">
                    <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                      {column.title}:
                    </span>
                    <div className="text-sm text-right min-w-0 flex-1 truncate">
                      {cellContent}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  // Desktop Table Layout
  const DesktopLayout = () => (
    <div className="hidden md:block">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="rounded-md">
            {columns &&
              columns.map((item: TableColumn, idx: number) => {
                return (
                  <TableHead key={idx} className={item.className}>
                    {item.title}
                  </TableHead>
                );
              })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((item: any, idx: number) => (
              <TableRow key={idx} className="h-16">
                {columns &&
                  columns.map((column: TableColumn, iidx: number) => {
                    const cellContent = renderCellContent(column, item);
                    return (
                      <TableCell key={iidx} className={column.className}>
                        {cellContent}
                      </TableCell>
                    );
                  })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                  <p>{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <MobileLayout />
      <DesktopLayout />
    </div>
  );
}
