export const isDifferentDay = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() !== d2.getDate() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getFullYear() !== d2.getFullYear()
  );
};
