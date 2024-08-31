import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function decoded(text) {
  return decodeURIComponent(text);
}

export function truncateText(text, maxLength) {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

export const getLastItems = (products, count) => {
  return products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, count);
};
export const f = new Intl.NumberFormat("ru-RU").format;

export const supabase = createClient(
  "https://bxdxvaioiunezestlkri.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZHh2YWlvaXVuZXplc3Rsa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5MzU5MDEsImV4cCI6MjAzODUxMTkwMX0.VVkuv29ktY8PERuJGKMS7CcjvrkFbhz-gssBkOznuBk"
);

export const formatFullDate = (prop) => {
  // Validate the date format if necessary
  const dateString = typeof prop === "string" ? prop : String(prop);

  // Handle invalid dates
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Or handle it differently
  }

  const formattedDateTime = date.toLocaleString();
  return formattedDateTime;
};

export const extractEntityName = (param) => {
  if (param.startsWith("create") || param.startsWith("change")) {
    const entity = param.replace(/^(create|change)/, "");
    return entity.charAt(0).toLowerCase() + entity.slice(1);
  }
  return "";
};

export function getRandomItems(products, count = 4) {
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function timeAgo(date) {
  const now = new Date();
  const givenDate = new Date(date);
  const diffInSeconds = Math.floor((now - givenDate) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} минут назад`;
  } else if (hours < 24) {
    return `${hours} часов назад`;
  } else {
    return `${days} дней назад`;
  }
}

export const getCurrencySum = async (dollar) => {
  const sum = localStorage.getItem("sum");
  return Number(sum) * Number(dollar);
};

export function sanitizeString(input) {
  let sanitized = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      (char >= "0" && char <= "9") ||
      char === "-" ||
      char === "_" ||
      char === "."
    ) {
      sanitized += char;
    }
  }

  return sanitized;
}
