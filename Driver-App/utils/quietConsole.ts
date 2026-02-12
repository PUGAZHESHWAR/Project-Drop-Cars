// Global console silencer: keep only warnings and errors
// This file is imported once at app bootstrap

// Preserve original warn/error just in case
const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);

// Silence verbose logs
// eslint-disable-next-line @typescript-eslint/no-empty-function
console.log = () => {};
// eslint-disable-next-line @typescript-eslint/no-empty-function
console.info = () => {};
// eslint-disable-next-line @typescript-eslint/no-empty-function
console.debug = () => {};

// Ensure warn/error remain intact
console.warn = originalWarn;
console.error = originalError;

export {};

