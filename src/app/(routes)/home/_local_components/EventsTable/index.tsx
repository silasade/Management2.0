"use client";
import React, { useMemo } from "react";
import { toast } from "sonner";
import {
  DeleteIcon,
  EditIcon,
  EllipsesIcon,
} from "@/app/_global_components/icons";
import dayjs from "dayjs";
import s from "./EventsTable.module.scss";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EventType } from "@/lib/types";
import { Popover, TableColumnsType } from "antd";

import { EyeIcon } from "lucide-react";
import { useDeleteEvent } from "@/lib/actions/event";
import { generateToast } from "@/app/_global_components/generateToast";
import { Oval } from "react-loader-spinner";
import { useGetUserDetails } from "@/lib/actions/user";
import { useRouter } from "next/navigation";
import ReusableTable from "@/app/_global_components/Table/Table";
import Link from "next/link";
export type EventTableType = {
  id: string;
  key: string;
  title: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  eventType: string;
  googleEventId: string;
  actions: string;
  status: string;
};
type PropType = { eventsData: EventType["data"]; isLoading: boolean };
function EventsTable({ eventsData, isLoading }: PropType) {
  const { data: userData } = useGetUserDetails();
  const { mutate, isPending } = useDeleteEvent();

  const handleDeleteEvent = (googleEventId: string, eventId: string) => {
    if (!userData?.provider_token) {
      generateToast("error", "User token missing. Try logging in again.");
      return;
    }

    mutate(
      { id: eventId, googleEventId, token: userData?.provider_token! },
      {
        onSuccess: () => {
          generateToast("success", "Event deleted");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete event";
          generateToast("error", message);
        },
      }
    );
  };
  const columns: TableColumnsType<EventTableType> = useMemo(
    () => [
      {
        key: "title",
        title: "Title",
        dataIndex: "title",
        render: (title) => <span>{title}</span>,
      },
      {
        key: "location",
        dataIndex: "location",
        title: "Location",
        render: (location) => <span>{location}</span>,
      },
      {
        title: "Start date",
        dataIndex: "startDateTime",
        key: "bounceRate",
        render: (startDateTime) => <span>{startDateTime}</span>,
      },
      {
        title: "EndStart date",
        dataIndex: "endDateTime",
        key: "endDateTime",
        render: (endDateTime) => <span>{endDateTime}</span>,
      },
      {
        key: "eventType",
        title: "Event Type",
        dataIndex: "eventType",
        render: (eventType) => <span>{eventType}</span>,
      },
      {
        key: "status",
        title: "Status",
        dataIndex: "status",
        render: (status) => <span>{status}</span>,
      },
      {
        key: "actions", // use id since this is not tied to event data
        title: "Actions",
        dataIndex: "actions",
        render: (
          text: any,
          record: { key: string; googleEventId: string; endDateTime: string }
        ) => {
          const event = record;
          return (
            <Popover
              trigger={"hover"}
              placement="left"
              classNames={{
                body: s.popOverContentBody,
              }}
              content={
                <div className={s.popOverContentWrapper}>
                  <Link
                    className={s.item}
                    href={`/home/view-details?event-id=${record.key}`}
                  >
                    <EyeIcon className={s.icon} />{" "}
                    <span className={s.text}>View Event details</span>
                  </Link>

                  <Link
                    href={`/home/create-event?event-id=${record.key}`}
                    className={s.item}
                  >
                    <EditIcon className={s.icon} />
                    <span className={s.text}> Edit Event</span>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className={s.item}>
                        {isPending && (
                          <Oval
                            visible={true}
                            height="20"
                            width="20"
                            color="#4fa94d"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        )}
                        <DeleteIcon className={s.icon} />
                        <span className={s.text}> Delete Event</span>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm">
                          Delete this event?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                          This action cannot be undone. The event will be
                          permanently deleted from your account.{" "}
                          <strong> Upcoming events cannot be deleted.</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-row justify-center w-full">
                        <AlertDialogCancel className="W-full">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="W-full bg-destructive"
                          onClick={() => {
                            const now = dayjs();
                            const eventEnd = dayjs(record.endDateTime);

                            if (eventEnd.isAfter(now)) {
                              toast("You cannot delete an upcoming event", {
                                position: "top-left",
                              });
                            } else {
                              handleDeleteEvent(event.googleEventId, event.key);
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              }
            >
              <button className="p-1 rounded hover:bg-gray-100">
                <EllipsesIcon className="cursor-pointer" />
              </button>
            </Popover>
          );
        },
      },
    ],
    []
  );
  const data: EventTableType[] =
    eventsData?.map((item) => ({
      id: item.id,
      key: item.id,
      endDateTime: dayjs(item.endDateTime).format("MMM DD, YYYY"),
      eventType: item.eventType,
      location: item.location,
      startDateTime: dayjs(item.startDateTime).format("MMM DD, YYYY"),
      title: item.title,
      googleEventId: item.googleEventId,
      status: dayjs(item.endDateTime).isAfter(dayjs())
        ? "Upcoming"
        : "Completed",
      actions: "",
    })) ?? [];

  return (
    <div className={s.wrapper}>
      <ReusableTable
        columns={columns}
        dataSource={data}
        loading={isLoading}
        noDataComponent={"No events yet"}
      />
    </div>
  );
}

export default EventsTable;
