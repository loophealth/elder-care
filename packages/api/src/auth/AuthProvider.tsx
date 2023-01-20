import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "firebase/auth";

import { IRequestStatus } from "../types";

interface IAuthContextValue {
  requestStatus: IRequestStatus;
  setRequestStatus: (status: IRequestStatus) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<IAuthContextValue>({
  requestStatus: IRequestStatus.Idle,
  setRequestStatus: () => {},
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [requestStatus, setRequestStatus] = useState<IRequestStatus>(
    IRequestStatus.Idle
  );

  return (
    <AuthContext.Provider
      value={{ requestStatus, setRequestStatus, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
