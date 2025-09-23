export type EventType = {
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
};
export type EventStatType = {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
};
