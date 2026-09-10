const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const displayDateTime = (date: Date) => {
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];

  let h = date.getUTCHours();
  const ampm = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;

  const min = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day} ${month}, ${h}:${min} ${ampm}`;
};

export function formatCityTime(dt: number, timezone: number): string {
  return displayDateTime(new Date((dt + timezone) * 1000));
}

export function formatLocalTime(ms: number): string {
  const local = new Date(ms);
  return displayDateTime(new Date(ms - local.getTimezoneOffset() * 60_000));
}
