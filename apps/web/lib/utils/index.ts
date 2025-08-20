// Utility functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date | null | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Currency formatting
export const formatCurrency = (amount: number | null | undefined, currency: string = 'USD') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Number formatting
export const formatNumber = (number: number | null | undefined) => {
  if (number === null || number === undefined) return '';
  return new Intl.NumberFormat('en-US').format(number);
};

// Percentage formatting
export const formatPercentage = (value: number | null | undefined, decimals: number = 1) => {
  if (value === null || value === undefined) return '';
  return `${(value * 100).toFixed(decimals)}%`;
};

// Duration formatting (days)
export const formatDuration = (days: number | null | undefined) => {
  if (!days) return '';
  if (days === 1) return '1 day';
  return `${days} days`;
};

// Text truncation
export const truncateText = (text: string, maxLength: number = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate initials from name
export const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = <F extends (...args: unknown[]) => void>(func: F, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function executedFunction(this: ThisParameterType<F>, ...args: Parameters<F>) {
    const later = () => {
      if (timeout) clearTimeout(timeout);
      func.apply(this, args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Calculate days between dates
export const daysBetween = (date1: string | Date, date2: string | Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1).getTime();
  const secondDate = new Date(date2).getTime();
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Check if date is overdue
export const isOverdue = (dueDate: string | Date | null | undefined) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// Get status color
export const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    completed: 'text-blue-600 bg-blue-100',
    cancelled: 'text-red-600 bg-red-100',
    draft: 'text-gray-600 bg-gray-100',
    approved: 'text-green-600 bg-green-100',
    rejected: 'text-red-600 bg-red-100',
    submitted: 'text-blue-600 bg-blue-100'
  };
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

