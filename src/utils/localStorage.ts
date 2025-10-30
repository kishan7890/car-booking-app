// LocalStorage utility functions
const STORAGE_KEYS = {
  USERS: "carbooking_users",
  CARS: "carbooking_cars",
  BOOKINGS: "carbooking_bookings",
  AUTH_USER: "carbooking_auth_user",
  AUTH_TOKEN: "carbooking_auth_token",
};

export const storage = {
  // Generic get/set functions
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  },

  // Auth-specific functions
  getAuthUser: () => storage.get(STORAGE_KEYS.AUTH_USER),
  setAuthUser: (user: unknown) => storage.set(STORAGE_KEYS.AUTH_USER, user),
  removeAuthUser: () => storage.remove(STORAGE_KEYS.AUTH_USER),

  getAuthToken: () => storage.get<string>(STORAGE_KEYS.AUTH_TOKEN),
  setAuthToken: (token: string) => storage.set(STORAGE_KEYS.AUTH_TOKEN, token),
  removeAuthToken: () => storage.remove(STORAGE_KEYS.AUTH_TOKEN),

  // Data-specific functions
  getUsers: () => storage.get(STORAGE_KEYS.USERS),
  setUsers: (users: unknown) => storage.set(STORAGE_KEYS.USERS, users),

  getCars: () => storage.get(STORAGE_KEYS.CARS),
  setCars: (cars: unknown) => storage.set(STORAGE_KEYS.CARS, cars),

  getBookings: () => storage.get(STORAGE_KEYS.BOOKINGS),
  setBookings: (bookings: unknown) =>
    storage.set(STORAGE_KEYS.BOOKINGS, bookings),
};

export default storage;
