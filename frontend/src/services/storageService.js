function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadJSON(key, fallbackValue = null) {
  if (!canUseStorage()) {
    return fallbackValue;
  }

  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return fallbackValue;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`Failed to load localStorage key: ${key}`, error);
    return fallbackValue;
  }
}

export function saveJSON(key, value) {
  if (!canUseStorage()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save localStorage key: ${key}`, error);
  }
}

export function removeStorageItem(key) {
  if (!canUseStorage()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key: ${key}`, error);
  }
}
