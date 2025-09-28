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
import { EventSchema } from "@/app/api/generate-event/schema";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { generateToast } from "@/app/_global_components/generateToast";
import { ColorRing } from "react-loader-spinner";
import { useCreateEvent } from "@/lib/actions/event";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";

const { RangePicker } = DatePicker;
type PropType = z.infer<typeof EventSchema> & {
  closeDrawer: () => void;
  clear: () => void;
};
function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function EventForm({
  description,
  endDateTime,
  eventType,
  location,
  organizer,
  startDateTime,
  title,
  closeDrawer,
  clear,
}: PropType) {
  const { mutate, isPending } = useCreateEvent();
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description,

      eventType: eventType,
      location: location,
      organizer: {
        ...organizer,
        email: organizer.email === "NOT FOUND" ? "" : organizer.email || "",
        phone: organizer.phone === "NOT FOUND" ? "" : organizer.phone,
      },
      reminders: [{ method: "popup", minutes: 10 }], // default reminder
      title: title,
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
      if (error || !session?.provider_token) {
        generateToast("error", "User token missing. Try logging in again.");
        return;
      }
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
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
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
        {
          onSuccess: () => {
            generateToast("success", "Calendar event created");
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
    setStartDate(startDateTime);
    setEndDate(endDateTime);
  }, []);
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

          <div className="flex flex-col  w-full gap-2">
            <FormLabel>Date</FormLabel>
            <FormControl>
              <RangePicker
                defaultValue={[dayjs(startDateTime), dayjs(endDateTime)]}
                className="w-full"
                onChange={(_, dateStrings) => {
                  setStartDate(dateStrings[0]);
                  setEndDate(dateStrings[1]);
                }}
                showTime
                required
                format="MMM DD HH:mm"
              />
            </FormControl>
            <FormMessage className="text-red-500 font-[500] text-[12px]"></FormMessage>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Button
              type="reset"
              onClick={clear}
              className="flex bg-[#f9dfc2] hover:text-[#f9dfc2] hover:bg-[#e0b88f] text-[#7a573a] flex-row gap-[2px] items-center justify-center w-[50%]"
            >
              Change image
            </Button>
            <Button
              type="submit"
              className="flex flex-row gap-[2px] text-[#f9dfc2] bg-[#7a573a] hover:text-[#7a573a] hover:bg-[#8f7862] items-center justify-center w-[50%]"
            >
              {(submitting || isPending) && (
                <ColorRing
                  visible={true}
                  height="20"
                  width="20"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              )}
              Submit to calendar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EventForm;
