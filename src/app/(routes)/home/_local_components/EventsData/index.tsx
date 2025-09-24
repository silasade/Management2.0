"use client";
import React, { useState } from "react";
import s from "./EventsData.module.scss";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@uidotdev/usehooks";
import { useGetAllEvents } from "@/lib/actions/event";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import EventsTable from "../EventsTable";
function EventsData() {
  const [search, setSearch] = useState<string>("");
  const [eventClass, setEventClass] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const deabouncedSearch = useDebounce(search, 300);

  const { isLoading, data: eventsData } = useGetAllEvents({
    eventClass,
    limit: 10,
    page,
    search: deabouncedSearch,
  });

  return (
    <div className={s.wrapper}>
      {/* Filters */}
      <div className={s.filterWrapper}>
        <div className={s.inputFilters}>
          <Input
            type="search"
            placeholder="Search by title"
            className={s.searchInput}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select onValueChange={(value) => setEventClass(value)}>
            <SelectTrigger className={s.selectBox}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className={s.note}>
          Showing {eventsData?.meta.page} of {eventsData?.meta.totalPages} pages
        </p>
      </div>

      <div className={s.paginatedTable}>
        <EventsTable
          eventsData={eventsData?.data || []}
          isLoading={isLoading}
        />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: eventsData?.meta.totalPages || 0 }).map(
              (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={page === index + 1}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((p) => p + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
export default EventsData;
