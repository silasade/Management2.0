import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createData, deleteData, getData, updateData } from "../requests";
import { EventStatType, EventType } from "../types";

const useGetAllEvents = () => {
  return useQuery<EventType[]>({
    queryKey: ["getAllEvents"],
    queryFn: () => getData<EventType[]>("/api/get-events"),
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
  useMutation({
    mutationFn: async (id: string) => {
      return deleteData(`/api/${id}/delete-event`);
    },
    onSuccess: () =>
      query.invalidateQueries({ queryKey: ["getAllEvents", "getEventsStats"] }),
  });
};
const useUpdateEvent = () => {
  const query = useQueryClient();
  useMutation({
    mutationFn: async (data: { id: string; body: EventType }) => {
      return updateData(
        `/api/${data.id}/update-event`,
        data.body,
        "application/json",
        "PUT"
      );
    },
    onSuccess: () =>
      query.invalidateQueries({ queryKey: ["getAllEvents", "getEventsStats"] }),
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
   googleEventId:string
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
