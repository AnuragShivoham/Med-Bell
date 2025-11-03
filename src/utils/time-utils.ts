// Time format utilities for 12/24 hour conversion

export function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours}:${minutes}`;
}

export function convertTo12Hour(time24h: string): string {
  const [hours, minutes] = time24h.split(':');
  const hour = parseInt(hours, 10);
  
  const modifier = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${modifier}`;
}

export function getCurrentTime24(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function isTimeToTakeMedicine(medicineTime: string, currentTime: string): boolean {
  return medicineTime === currentTime;
}

export function getTimeFormat(): '12h' | '24h' {
  const format = localStorage.getItem('medibell-time-format');
  return (format as '12h' | '24h') || '12h';
}

export function setTimeFormat(format: '12h' | '24h'): void {
  localStorage.setItem('medibell-time-format', format);
}

export function formatTime(time: string): string {
  const format = getTimeFormat();
  
  // Check if time already has AM/PM
  if (time.includes('AM') || time.includes('PM')) {
    return format === '12h' ? time : convertTo24Hour(time);
  }
  
  // Assume it's 24h format
  return format === '12h' ? convertTo12Hour(time) : time;
}
