import { Users } from "@prisma/client";
import { createContext, useState } from "react";

interface CustomAuthContext {
  authorized: boolean;
  user: Users | null;
  setUser: any;
  setAuth: any;
}

export const AuthContext = createContext<CustomAuthContext>({
  authorized: false,
  user: null,
  setUser: (newUserData: object) => {},
  setAuth: (newAuthData: object) => {},
});

export default function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const value: CustomAuthContext = {
    authorized: isAuthorized,
    user: user,
    setUser: setUser,
    setAuth: setIsAuthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
