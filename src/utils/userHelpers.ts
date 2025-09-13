/* eslint-disable @typescript-eslint/no-unused-vars */

import { formatBasicDate } from '@/utils/dateFormatting';

export const formatDate = (dateString: string) => {
  return formatBasicDate(dateString);
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};