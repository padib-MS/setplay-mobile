export const formatDate = (raw?: string | null) => {
  if (!raw) return "Date TBD";

  const normalised = raw.replace(" ", "T");
  const date = new Date(normalised);
  if (Number.isNaN(date.getTime())) return raw;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const day = days[date.getDay()];
  const dayNum = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];

  return `${day} ${month} ${dayNum}`;
};
