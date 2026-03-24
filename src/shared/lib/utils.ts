import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for merging Tailwind CSS classes
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

export const getInitials = (value: string, maxLength = 2): string => {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, maxLength)
}
