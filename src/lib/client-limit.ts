const LIMIT = 15;
const WINDOW_MS = 60 * 60 * 1000;
const COUNT_KEY = 'appcrates_chat_count';
const RESET_KEY = 'appcrates_chat_reset';

export function checkClientLimit(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  const now = Date.now();
  const reset = Number.parseInt(window.localStorage.getItem(RESET_KEY) || '0', 10);

  if (!reset || now > reset) {
    window.localStorage.setItem(COUNT_KEY, '1');
    window.localStorage.setItem(RESET_KEY, String(now + WINDOW_MS));
    return true;
  }

  const count = Number.parseInt(window.localStorage.getItem(COUNT_KEY) || '0', 10);

  if (count >= LIMIT) {
    return false;
  }

  window.localStorage.setItem(COUNT_KEY, String(count + 1));
  return true;
}
