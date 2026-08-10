export function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

export function nowDateTime() {
  return new Date().toISOString();
}

export function nowTimeOnly() {
  return new Date().toTimeString().slice(0, 8);
}