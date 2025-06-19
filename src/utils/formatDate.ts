import { format } from "@formkit/tempo";

export const formatDate = (date: string) => {
  const formattedDate = format(date, "dddd, D MMMM, YYYY, h:mm a", "es");
  return formattedDate;
};
