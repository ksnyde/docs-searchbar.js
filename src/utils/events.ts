export type IEventWithValue<
  TEvent extends Record<string, unknown> & { target: Record<string, unknown> },
  TValue
> = TEvent & {
  target: { value: TValue };
};

export function hasEventTarget(
  evt: unknown
): evt is Record<string, unknown> & { target: Record<string, unknown> } {
  return (
    typeof evt === "object" &&
    Object.keys(evt as object).includes("target") &&
    typeof (evt as { target: unknown }).target === "object"
  );
}
export function isEventWithTargetValue<
  TValue extends string | number | string[] = string | number | string[],
  TEvent = unknown
>(
  evt: TEvent
): evt is IEventWithValue<
  TEvent & { target: Record<string, unknown> },
  TValue
> {
  const target = hasEventTarget(evt) ? evt.target : {};
  return target && typeof target === "object";
}
