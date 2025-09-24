import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createData, deleteData, getData, updateData } from "../requests";
import { EventFilter, EventStatType, EventType } from "../types";

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
const useGetEventStatistics = () => {
  return useQuery<EventStatType>({
    queryKey: ["getEventsStats"],
    queryFn: () => getData<EventStatType>("/api/event-stat"),
  });
};
const useDeleteEvent = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteData(`/api/${id}/delete-event`);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllEvents"] });
      query.invalidateQueries({ queryKey: ["getEventsStats"] });
    },
  });
};
const useUpdateEvent = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; body: EventType }) => {
      return updateData(
        `/api/${data.id}/update-event`,
        data.body,
        "application/json",
        "PUT"
      );
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllEvents"] });
      query.invalidateQueries({ queryKey: ["getEventsStats"] });
    },
  });
};
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
    onSuccess: () =>
      query.invalidateQueries({ queryKey: ["getAllEvents", "getEventsStats"] }),
  });
};
export {
  useCreateEvent,
  useDeleteEvent,
  useGetAllEvents,
  useUpdateEvent,
  useGetEventStatistics,
};
