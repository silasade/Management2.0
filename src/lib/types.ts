export type EventType = {
  data: {
    id: string;
    createdAt: string;
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
  }[];
  meta: {
    total: number;
    page: number;

    limit: number;
    totalPages: number;
  };
};
export type EventStatType = {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
};
export type EventFilter = {
  eventClass?: "all" | "upcoming" | "completed" | string | null;
  page?: number;
  limit?: number;
  search?: string;
};
