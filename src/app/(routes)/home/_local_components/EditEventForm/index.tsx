import { useGetUserDetails } from "@/lib/actions/user";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { formSchema } from "./EventForm.schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { generateToast } from "@/app/_global_components/generateToast";
import { ColorRing, Puff } from "react-loader-spinner";
import { useGetEventById, useUpdateEvent } from "@/lib/actions/event";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";

const { RangePicker } = DatePicker;
type PropType = {
  closeDrawer: () => void;
  clear: () => void;
  id: string;
};
function EditEventForm({ closeDrawer, clear, id }: PropType) {
  const { data: eventData, isFetching, refetch } = useGetEventById(id);
  const { mutate, isPending } = useUpdateEvent();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: eventData?.data.description,

      eventType: eventData?.data.eventType,
      location: eventData?.data.location,
      organizer: {
        name: eventData?.data.organizerName,
        email:
          eventData?.data.organizerEmail === "NOT FOUND"
            ? undefined
            : eventData?.data.organizerEmail,
        phone:
          eventData?.data.organizerPhone === "NOT FOUND"
            ? ""
            : eventData?.data.organizerPhone,
      },
      reminders: eventData?.data.reminders ?? [
        { method: "popup", minutes: 10 },
      ], // default reminder
      title: eventData?.data.title,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reminders",
  });
  async function createCalendarEvent(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    if (!startDate || !endDate) {
      generateToast(
        "error",
        "Ensure to select a schedule time before submitting"
      );
      return;
    }
    try {
      const startISO = new Date(startDate).toISOString();
      const endISO = new Date(endDate).toISOString();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      const event = {
        summary: values.title,
        description: values.description,
        location: values.location,
        start: {
          dateTime: startISO,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endISO,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: values.reminders ?? [{ method: "popup", minutes: 10 }],
        },
        extendedProperties: {
          private: { eventType: values.eventType },
        },
      };

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventData?.data.googleEventId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.provider_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Google Calendar API error: ${errText}`);
      }
      const googleEvent = await res.json();

      mutate(
        {
          body: {
            title: values.title,
            description: values?.description! || "",
            endDateTime: endDate,
            eventType: values.eventType! || "",
            location: values.location!,
            organizerEmail: values.organizer?.email! || "",
            organizerName: values.organizer?.name || "",
            organizerPhone: values.organizer?.phone! || "",
            startDateTime: startDate,
            googleEventId: googleEvent.id,
            reminders: values.reminders ?? [{ method: "popup", minutes: 10 }],
          },
          id: id,
        },
        {
          onSuccess: () => {
            generateToast("success", "Calendar event updated");
            closeDrawer();
            clear();
          },
          onError: (error) => {
            generateToast("error", error.message);
            clear();
          },
        }
      );
    } catch (error) {
      console.error(error);
      generateToast(
        "error",
        (error as Error).message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  }
  useEffect(() => {
    if (eventData?.data.startDateTime)
      setStartDate(eventData?.data.startDateTime);
    if (eventData?.data.endDateTime) setEndDate(eventData?.data.endDateTime);
  }, []);
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    if (eventData?.data) {
      form.reset({
        title: eventData.data.title,
        description: eventData.data.description,
        eventType: eventData.data.eventType,
        location: eventData.data.location,
        organizer: {
          name: eventData.data.organizerName,
          email:
            eventData.data.organizerEmail === "NOT FOUND"
              ? ""
              : eventData.data.organizerEmail,
          phone:
            eventData.data.organizerPhone === "NOT FOUND"
              ? ""
              : eventData.data.organizerPhone,
        },
        reminders: eventData.data.reminders ?? [
          { method: "popup", minutes: 10 },
        ],
      });
      setStartDate(eventData.data.startDateTime);
      setEndDate(eventData.data.endDateTime);
    }
  }, [eventData, form]);

  if (isFetching) {
    return (
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
    );
  }
  return (
    <div className="overflow-y-auto md:overflow-y-none">
      <Form {...form}>
        <form
          className="p-[20px]  max-w-[100%] md:max-w-[700px] m-auto flex flex-col gap-[8px]"
          onSubmit={form.handleSubmit(createCalendarEvent)}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>Event type</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row  gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <FormLabel>Reminders</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  {/* Method select */}
                  <FormField
                    control={form.control}
                    name={`reminders.${index}.method`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select
                            {...field}
                            className="border rounded px-2 py-1"
                          >
                            <option value="popup">Popup</option>
                            <option value="email">Email</option>
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Minutes input */}
                  <FormField
                    control={form.control}
                    name={`reminders.${index}.minutes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="Minutes before"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row  gap-4">
            <FormField
              control={form.control}
              name="organizer.name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>Organizer name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer.email"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>Organizer email</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer.phone"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>Organizer phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <FormLabel>Date</FormLabel>
            <FormControl>
              <RangePicker
                defaultValue={[
                  dayjs(eventData?.data.startDateTime),
                  dayjs(eventData?.data.endDateTime),
                ]}
                className="w-full"
                onChange={(_, dateStrings) => {
                  setStartDate(dateStrings[0]);
                  setEndDate(dateStrings[1]);
                }}
                showTime
                required
              />
            </FormControl>
            <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
          </div>
          <Button
            type="submit"
            className="flex flex-row gap-[2px] text-[#f9dfc2] bg-[#7a573a] hover:text-[#7a573a] hover:bg-[#8f7862] items-center justify-center w-full"
          >
            {(submitting||isPending) && (
              <ColorRing
                visible={true}
                height="20"
                width="20"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            )}
            Edit calendar event
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EditEventForm;
