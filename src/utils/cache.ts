export function setCache(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  export function getCache<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }