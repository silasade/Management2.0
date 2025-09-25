"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetEventById } from "@/lib/actions/event";
import dayjs from "dayjs";
import { Puff } from "react-loader-spinner";
function ViewDetails() {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const params = useSearchParams();
  const eventId = params.get("event-id");
  const { data: resData, isFetching, refetch } = useGetEventById(eventId!);
  const data = resData?.data;
  const pathName = usePathname();
  const handleSheetChange = useCallback(() => {
    setOpenSheet(false);
    router.push("/home", { scroll: false });
  }, [router]);
  useEffect(() => {
    if (pathName.startsWith("/home/view-details")) {
      return setOpenSheet(true);
    } else {
      setOpenSheet(false);
    }
  }, [pathName]);
  useEffect(() => {
    refetch();
  }, []);
  return (
    <Sheet onOpenChange={handleSheetChange} open={openSheet}>
      <SheetContent className="w-[300px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>View Event details</SheetTitle>
          <SheetDescription>
            Review the full details of your selected event in this panel. You
            can check all event information without leaving the page. Click{" "}
            <strong>Close</strong> when you’re done.
          </SheetDescription>
        </SheetHeader>
        {isFetching ? (
          <div className="flex m-auto justify-center items-center">
            <Puff
              visible={true}
              height="40"
              width="40"
              color="#4fa94d"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <div className="grid flex-1 auto-rows-min gap-6 px-4 py-2 overflow-y-auto">
            <div className="space-y-1 border-b pb-3">
              <h6 className="text-xs font-semibold text-gray-700">
                Event Title
              </h6>
              <p className="text-sm text-gray-900">{data?.title}</p>
            </div>

            <div className="space-y-1 border-b pb-3">
              <h6 className="text-xs font-semibold text-gray-700">
                Event Description
              </h6>
              <p className="text-sm text-gray-900">{data?.description}</p>
            </div>

            <div className="space-y-1 border-b pb-3">
              <h6 className="text-xs font-semibold text-gray-700">
                Event Type
              </h6>
              <p className="text-sm text-gray-900">{data?.eventType}</p>
            </div>

            <div className="space-y-1 border-b pb-3">
              <h6 className="text-xs font-semibold text-gray-700">
                Event Location
              </h6>
              <p className="text-sm text-gray-900">{data?.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div className="space-y-1">
                <h6 className="text-xs font-semibold text-gray-700">
                  Start Date
                </h6>
                <p className="text-sm text-gray-900">
                  {dayjs(data?.startDateTime).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
              <div className="space-y-1">
                <h6 className="text-xs font-semibold text-gray-700">
                  End Date
                </h6>
                <p className="text-sm text-gray-900">
                  {dayjs(data?.endDateTime).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div className="space-y-1">
                <h6 className="text-xs font-semibold text-gray-700">
                  Reminder
                </h6>
                <p className="text-sm text-gray-900">
                  {data?.reminders[0].method}
                </p>
              </div>
              <div className="space-y-1">
                <h6 className="text-xs font-semibold text-gray-700">
                  Minutes before
                </h6>
                <p className="text-sm text-gray-900">
                  {data?.reminders[0].minutes}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h6 className="text-xs font-semibold text-gray-700">
                  Organizer
                </h6>
                <p className="text-sm text-gray-900">{data?.organizerName}</p>
              </div>
              <div className="space-y-1">
                <h6 className="text-xs font-semibold text-gray-700">Email</h6>
                <p className="text-sm text-gray-900">
                  {data?.organizerEmail || "Not found"}
                </p>
              </div>
              <div className="space-y-1">
                <h6 className="text-xs font-semibold text-gray-700">Phone</h6>
                <p className="text-sm text-gray-900">
                  {data?.organizerPhone || "Not found"}
                </p>
              </div>
            </div>
          </div>
        )}

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetails;
