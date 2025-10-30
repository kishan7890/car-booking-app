import storage from "../utils/localStorage";
import { generateId } from "../utils/helpers";
import dummyData from "../data/dummyData.json";
import type { AuthUser, LoginFormData, RegisterFormData, User } from "@/types";

// Initialize data from dummy JSON if not exists
const initializeData = () => {
  if (!storage.getUsers()) {
    storage.setUsers(dummyData.users);
  }
};

export const authService = {
  // Login
  login: async (data: LoginFormData): Promise<AuthUser> => {
    initializeData();

    const users = storage.getUsers() as User[];
    const user = users.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated. Please contact support.");
    }

    // Generate mock token
    const token = `token_${user.id}_${Date.now()}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const authUser: AuthUser = { ...userWithoutPassword, token };

    // Store in localStorage
    storage.setAuthUser(authUser);
    storage.setAuthToken(token);

    return authUser;
  },

  // Register
  register: async (data: RegisterFormData): Promise<AuthUser> => {
    initializeData();

    const users = storage.getUsers() as User[];

    // Check if email already exists
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser: User = {
      id: generateId("user"),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: "user",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to users array
    users.push(newUser);
    storage.setUsers(users);

    // Generate token and login
    const token = `token_${newUser.id}_${Date.now()}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    const authUser: AuthUser = { ...userWithoutPassword, token };

    storage.setAuthUser(authUser);
    storage.setAuthToken(token);

    return authUser;
  },

  // Logout
  logout: () => {
    storage.removeAuthUser();
    storage.removeAuthToken();
  },

  // Get current user
  getCurrentUser: (): AuthUser | null => {
    return storage.getAuthUser() as AuthUser | null;
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!storage.getAuthToken();
  },

  // Check if user has role
  hasRole: (role: "admin" | "user"): boolean => {
    const user = storage.getAuthUser() as AuthUser | null;
    return user?.role === role;
  },
};

export default authService;
