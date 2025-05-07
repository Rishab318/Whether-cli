import { format } from "date-fns";

export const DateFormatters = {
  /**
   * Formats a date from individual year, month, and day values into yyyy-MM-dd format
   * @param year - The year value
   * @param month - The month value
   * @param day - The day value
   * @returns Formatted date string in yyyy-MM-dd format
   */
  formatFullDate: (
    year: string | number,
    month: string | number,
    day: string | number
  ): string => {
    return format(new Date(`${year}-${month}-${day}`), "yyyy-MM-dd");
  },

  // You can add more date formatting functions here as needed
  formatDateFromString: (dateString: string): string => {
    return format(new Date(dateString), "yyyy-MM-dd");
  },
};
