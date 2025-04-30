import dayjs from "dayjs";

export const formatTime = (timeStamp: number) => {
  return dayjs(timeStamp).format("HH:mm");
};
