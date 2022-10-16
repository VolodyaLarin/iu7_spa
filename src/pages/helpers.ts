import { date } from 'quasar';

export const getDayFilter = (d: string | Date) => {
  const day = date.formatDate(new Date(d), 'YYYY-MM-DD');

  return {
    dateGt: `${day}T00:00:00`,
    dateLt: `${day}T23:59:59`,
  };
};
