"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { EllipsesIcon } from "@/app/_global_components/icons";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EventType } from "@/lib/types";
export type EventTableType = {
  id: string;
  title: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  eventType: string;
};
type PropType = { eventsData: EventType["data"]; isLoading: boolean };
function EventsTable({ eventsData, isLoading }: PropType) {
  const columns: ColumnDef<EventTableType>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span>{row.getValue("title")}</span>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span>{row.getValue("location")}</span>,
    },
    {
      accessorKey: "startDateTime",
      header: "Start Date",
      cell: ({ row }) => <span>{row.getValue("startDateTime")}</span>,
    },
    {
      accessorKey: "endDateTime",
      header: "End Date",
      cell: ({ row }) => <span>{row.getValue("endDateTime")}</span>,
    },
    {
      accessorKey: "eventType",
      header: "Event Type",
      cell: ({ row }) => <span>{row.getValue("eventType")}</span>,
    },
    {
      id: "actions", // use id since this is not tied to event data
      header: "Actions",
      cell: () => <EllipsesIcon />,
    },
  ];
  const data: EventTableType[] =
    eventsData?.map((item) => ({
      id: item.id,
      endDateTime: dayjs(item.endDateTime).format("MMM DD, YYYY"),
      eventType: item.eventType,
      location: item.location,
      startDateTime: dayjs(item.startDateTime).format("MMM DD, YYYY"),
      title: item.title,
    })) ?? [];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="min-h-[250px]">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex} className="h-[50px] p-[12px]">
                    <Skeleton className="h-4 w-[120px] bg-gray-300 animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-[50px] p-[12px]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default EventsTable;
