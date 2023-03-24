import { Users } from "@prisma/client";
import { createContext, useState } from "react";

interface AuthContextProps {
  user: Users | null;
  setUser: (user: Users) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: (user: Users | null) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Users | null>(null);
  const values = { user, setUser };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
