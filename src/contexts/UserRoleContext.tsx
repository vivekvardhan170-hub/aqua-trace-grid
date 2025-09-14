import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';

type UserRole = 'ngo' | 'nccr';

interface UserRoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider = ({ children }: UserRoleProviderProps) => {
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const { user } = useUser();

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    // Store in localStorage for persistence
    localStorage.setItem('userRole', role);
  };

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole && (savedRole === 'ngo' || savedRole === 'nccr')) {
      setUserRoleState(savedRole);
    }
  }, []);

  const isAdmin = userRole === 'nccr';

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, isAdmin }}>
      {children}
    </UserRoleContext.Provider>
  );
};