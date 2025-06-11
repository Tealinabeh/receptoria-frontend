export function formatTime(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) {
    return "N/A";
  }

  const D_IN_MIN = 1440;
  const H_IN_MIN = 60;

  const days = Math.floor(totalMinutes / D_IN_MIN);
  const remainingMinutesAfterDays = totalMinutes % D_IN_MIN;
  const hours = Math.floor(remainingMinutesAfterDays / H_IN_MIN);
  const minutes = remainingMinutesAfterDays % H_IN_MIN;

  const parts = [];
  if (days > 0) parts.push(`${days} д.`);
  if (hours > 0) parts.push(`${hours} г.`);
  if (minutes > 0) parts.push(`${minutes} хв.`);

  if (parts.length === 0 && totalMinutes > 0) {
    return "< 1 хв.";
  }

  return parts.length > 0 ? parts.join(' ') : "0 хв.";
}