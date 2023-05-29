export default function Logger(
  description?: string,
  ...args: any[]
): Console | void {
  if (process?.env.NODE_ENV === 'development') {
    return console.log(`${description || 'Logger'}: `, ...args);
  }
};
