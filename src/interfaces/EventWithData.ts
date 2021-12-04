export type EventWithData<T> = {
  data: T;
} & Event;
