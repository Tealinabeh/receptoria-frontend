const D_IN_MIN = 1440;
const H_IN_MIN = 60;

export function minutesToTime(totalMinutes, asString = false) {
  if (!totalMinutes || totalMinutes <= 0) {
    if (asString) {
      return "~1 хв.";
    }
    return { days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(totalMinutes / D_IN_MIN);
  const remainingMinutesAfterDays = totalMinutes % D_IN_MIN;
  const hours = Math.floor(remainingMinutesAfterDays / H_IN_MIN);
  const minutes = remainingMinutesAfterDays % H_IN_MIN;

  if (asString) {
    const parts = [];
    if (days > 0) parts.push(`${days} д.`);
    if (hours > 0) parts.push(`${hours} г.`);
    if (minutes > 0) parts.push(`${minutes} хв.`);

    return parts.join(' ');
  }
  return { days, hours, minutes };
}

export function timeToMinutes(timeObject, asString = false) {
  const { days, hours, minutes } = timeObject;

  const d = parseInt(days, 10) || 0;
  const h = parseInt(hours, 10) || 0;
  const m = parseInt(minutes, 10) || 0;

  if (asString) {
    return `${(d * D_IN_MIN) + (h * H_IN_MIN) + m} хв.`
  }
  return (d * D_IN_MIN) + (h * H_IN_MIN) + m;
}