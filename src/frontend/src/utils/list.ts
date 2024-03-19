// Helper function for conditional class names
export const classNames = (...classes: string[]) =>
  classes.filter(Boolean).join(" ");
