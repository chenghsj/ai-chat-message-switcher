export function throttle<T>(
  func: (this: T, ...args: any[]) => void,
  limit: number
): (this: T, ...args: any[]) => void {
  let lastFunc: number;
  let lastRan: number;
  return function (this: T, ...args: any[]) {
    const context = this; // Capture the current context
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan)
      );
    }
  };
}
