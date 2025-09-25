import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createData, deleteData, getData, updateData } from "../requests";
import { EventFilter, EventStatType, EventType } from "../types";
type CreateEventType = {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  eventType: string;
  googleEventId: string;
  reminders: { method: "popup" | "email"; minutes: number }[];
};
const useGetAllEvents = (filter: EventFilter) => {
  return useQuery({
    queryKey: ["getAllEvents", filter], // include filter in key so cache is unique
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (filter.eventClass && filter.eventClass !== "all") {
        searchParams.append("class", filter.eventClass);
      }
      if (filter.page) searchParams.append("page", String(filter.page));
      if (filter.limit) searchParams.append("limit", String(filter.limit));
      if (filter.search) searchParams.append("search", filter.search);

      return getData<EventType>(`/api/get-events?${searchParams}`);
    },
  });
};
const useGetEventById = (eventId: string) => {
  return useQuery<{ data: EventType["data"][0] }>({
    queryKey: ["getEvent"],
    queryFn: async () => {
      return getData<{ data: EventType["data"][0] }>(
        `/api/get-event/${eventId}`
      );
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!eventId,
  });
};
const useGetEventStatistics = () => {
  return useQuery<EventStatType>({
    queryKey: ["getEventsStats"],
    queryFn: () => getData<EventStatType>("/api/event-stat"),
  });
};
interface DeleteEventBody {
  id: string;
  googleEventId?: string;
  token: string;
}
const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: DeleteEventBody) => {
      // If you want to delete from Google Calendar
      if (body.googleEventId) {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${body.googleEventId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${body.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to delete Google Calendar event");
        }
      }

      // Delete from your own backend
      const data = await deleteData(`/api/delete-event/${body.id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllEvents"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["getEventsStats"] });
    },
  });
};
const useUpdateEvent = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; body: CreateEventType }) => {
      const updatedData = await updateData(
        `/api/update-event/${data.id}`,
        data.body,
        "application/json",
        "PUT"
      );
      return updatedData;
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllEvents"], exact: false });
      query.invalidateQueries({ queryKey: ["getEventsStats"] });
    },
  });
};

const useCreateEvent = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateEventType) => {
      return createData(
        `/api/submit-event`,
        "application/json",

        body
      );
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllEvents"], exact: false });

      query.invalidateQueries({ queryKey: ["getEventsStats"] });
    },
  });
};
export {
  useCreateEvent,
  useDeleteEvent,
  useGetAllEvents,
  useUpdateEvent,
  useGetEventStatistics,
  useGetEventById,
};
