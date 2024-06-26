import { formatEgp, formatPercent } from "@/lib/format";

export function selectUpdatedOrNone<P, U>(
  prev?: P,
  updated?: U
): U | undefined {
  return updated !== prev ? updated : undefined;
}

export function scale(value: number, scale: number) {
  return value * 10 ** scale;
}

export function unscale(value: number, scale: number) {
  return value / 10 ** scale;
}

export const scalePrice = (value: number) => scale(value, 2);
export const unscalePrice = (value: number) => unscale(value, 2);
export const scaleDiscount = (value: number) => scale(value, 2);
export const unscaleDiscount = (value: number) => unscale(value, 2);

export function applyDiscount(price: number, discount: number): number {
  const discountAmount = (price * discount) / 1_0000;
  return price - discountAmount;
}

export function formatDuration(duration: number) {
  const [hours, minutes] = asDurationParts(duration);

  const zeroHours = hours === 0;
  const zeroMinutes = minutes === 0;
  const oneMinute = minutes === 1;
  const oneHour = hours === 1;
  const minutesLabel = oneMinute ? "minute" : "minutes";
  const hoursLabel = oneHour ? "hour" : "hours";

  if (zeroHours) return `${minutes} ${minutesLabel}`;
  if (zeroMinutes) return `${hours} ${hoursLabel}`;
  return `${hours} ${hoursLabel} and ${minutes} ${minutesLabel}`;
}

export function asDurationParts(duration: number) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return [hours, minutes];
}

export function discountParser(value?: string): string {
  if (!value) return "0";
  return scaleDiscount(Number(value.replace(/%|,/gi, ""))).toString();
}

export function discountFormatter(value?: string): string {
  return formatPercent(value ? unscaleDiscount(Number(value)) : 0);
}

export function priceParser(value?: string) {
  if (!value) return "0";
  return scalePrice(Number(value.replace(/E|G|P|,/gi, "").trim())).toString();
}

export function priceFormatter(value?: string) {
  return formatEgp(value ? unscalePrice(Number(value)) : 0);
}
