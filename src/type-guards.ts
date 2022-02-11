export type ValueEvent = Event & { target: {value: any }};

export function isEventWithValue(e: unknown): e is ValueEvent {
  return typeof e === "object" && "target" in e;
}