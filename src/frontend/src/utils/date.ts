export const isDifferentDay = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() !== d2.getDate() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getFullYear() !== d2.getFullYear()
  );
};

export const  transformDate= (dateString:string)=> {
  const dateTime = new Date(dateString);
  
  const day = dateTime.getUTCDate();
  const month = dateTime.getUTCMonth() + 1; // Adding 1 because getMonth() returns 0-based index
  const year = dateTime.getUTCFullYear();
  const hour = String(dateTime.getUTCHours()).padStart(2, '0');
  const minute = String(dateTime.getUTCMinutes()).padStart(2, '0'); // Pad with leading zero if single digit
  const second = String(dateTime.getUTCSeconds()).padStart(2, '0'); // Pad with leading zero if single digit
  
  return { day, month, year, hour, minute, second };
}
