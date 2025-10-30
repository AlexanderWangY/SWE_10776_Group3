import { createContext } from "react-router";
import type { User } from "./libs/auth";

export const userContext = createContext<User | null>(null);