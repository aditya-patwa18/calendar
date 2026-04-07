export const formatDateKey = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

export const getMonthName = (month) => {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return names[month];
};

export const isToday = (year, month, day) => {
  const now = new Date();
  return (
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day
  );
};

export const getSeasonClass = (month) => {
  if (month <= 1 || month === 11) return 'winter';
  if (month <= 4) return 'spring';
  if (month <= 7) return 'summer';
  return 'autumn';
};

export const getVideoSeason = (month) => {
  if ([3, 4, 5, 6].includes(month)) return 'may-aug';
  if ([0, 1, 2, 7].includes(month)) return 'jan-apr';
  return 'sep-dec';
};

export const getMonthQuote = (month) => {
  const list = [
    'A new year, a new beginning.',
    'Embrace the lingering cold.',
    'Spring breathes new life into the world.',
    'April showers bring May flowers.',
    'Bloom where you are planted.',
    'Sunlit days and starry nights.',
    'Midsummer magic is in the air.',
    'Soaking in the last rays of summer.',
    'The leaves begin their golden dance.',
    'Autumn leaves and pumpkins, please.',
    'Gather and give thanks.',
    'The world is quiet and white.'
  ];
  return list[month];
};