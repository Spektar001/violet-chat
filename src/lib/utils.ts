import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { twMerge } from "tailwind-merge";

dayjs.extend(calendar);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (timeStamp: number): string => {
  return dayjs(timeStamp).format("HH:mm");
};

export const formatTimeConversation = (timeStamp: number): string => {
  const messageDate = dayjs(timeStamp);
  const now = dayjs();

  if (messageDate.isToday()) {
    return messageDate.format("HH:mm");
  }

  if (messageDate.isYesterday()) {
    return messageDate.format("ddd");
  }

  if (now.diff(messageDate, "day") < 7) {
    return messageDate.format("ddd");
  }

  return messageDate.format("DD.MM.YYYY");
};

export const formatDate = (timeStamp: number): string => {
  return dayjs(timeStamp).format("DD.MM.YYYY");
};

export const isSameDay = (timeStamp1: number, timeStamp2: number): boolean => {
  return dayjs(timeStamp1).isSame(dayjs(timeStamp2), "day");
};
