import { useGetUserDetails } from "@/lib/actions/user";
import React, { useState } from "react";
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
import { error } from "console";

type PropType = z.infer<typeof EventSchema>;
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
}: PropType) {
  const { data, isLoading } = useGetUserDetails();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description,
      endDateTime: endDateTime,
      eventType: eventType,
      location: location,
      organizer: organizer,
      reminders: [{ method: "popup", minutes: 10 }], // default reminder
      startDateTime: startDateTime,
      title: title,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reminders",
  });
  async function createCalendarEvent(values: z.infer<typeof formSchema>) {
    console.log("Creating event");
    setSubmitting(true);
    try {
      const startISO = new Date(values.startDateTime).toISOString();
      const endISO = new Date(values.endDateTime).toISOString();

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
            Authorization: `Bearer ${data?.provider_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Google Calendar API error: ${errText}`);
      }

      generateToast("success", "Calendar event created ✅");
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

  return (
    <div>
      <Form {...form}>
        <form
          className="max-w-[700px] m-auto flex flex-col gap-[8px]"
          onSubmit={form.handleSubmit(createCalendarEvent)}
        >
          <div className="flex flex-row gap-4">
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
          <div className="flex flex-row gap-4">
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
          <div className="flex flex-row gap-4">
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
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem className="w-full flex-col gap-[2px]">
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <div className="flex flex-row w-full gap-2">
                      {/* DATE PICKER */}
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-between">
                            {field.value
                              ? new Date(field.value).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : "Pick a date"}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (!date) return;
                              // Preserve existing time if available
                              const current = field.value
                                ? new Date(field.value)
                                : new Date();
                              date.setHours(
                                current.getHours(),
                                current.getMinutes(),
                                0
                              );
                              field.onChange(date.toISOString());
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {/* TIME PICKER */}
                      <Input
                        type="time"
                        defaultValue="10:30"
                        onChange={(e) => {
                          const [h, m] = e.target.value.split(":").map(Number);
                          const base = field.value
                            ? new Date(field.value)
                            : new Date();
                          base.setHours(h, m, 0);
                          field.onChange(base.toISOString());
                        }}
                        className="flex justify-between"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-between">
                            {field.value
                              ? new Date(field.value).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : "Pick a date"}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (!date) return;
                              const current = field.value
                                ? new Date(field.value)
                                : new Date();
                              date.setHours(
                                current.getHours(),
                                current.getMinutes(),
                                0
                              );
                              field.onChange(date.toISOString());
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      <Input
                        type="time"
                        defaultValue="11:30"
                        onChange={(e) => {
                          const [h, m] = e.target.value.split(":").map(Number);
                          const base = field.value
                            ? new Date(field.value)
                            : new Date();
                          base.setHours(h, m, 0);
                          field.onChange(base.toISOString());
                        }}
                        className=""
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 font-[500] text-[12px]" />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="flex flex-row gap-[2px] items-center justify-center"
          >
            {submitting && (
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
            Submit to calendar
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default EventForm;
