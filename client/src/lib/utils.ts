import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getStatusColor(status: "completed" | "in-progress" | "locked" | "available"): string {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "in-progress":
      return "text-orange-500";
    case "locked":
      return "text-gray-400";
    case "available":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
}

export function getBadgeGradient(badgeId: number): string {
  const gradients = [
    "from-blue-500 to-green-500",
    "from-green-500 to-teal-500", 
    "from-teal-500 to-purple-500",
    "from-orange-400 to-pink-500",
    "from-purple-500 to-blue-500",
    "from-pink-500 to-orange-400",
  ];
  return gradients[(badgeId - 1) % gradients.length];
}

export function generateProgressRingPath(percentage: number): string {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return `${circumference} ${offset}`;
}
