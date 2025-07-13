/* eslint-disable @typescript-eslint/no-unused-vars */

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};