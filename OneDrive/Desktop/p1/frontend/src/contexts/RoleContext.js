import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();
export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  // Example: user object could be set after login
  // { id, name, role: 'employee' | 'admin' }
  const [user, setUser] = useState(null);
  return (
    <RoleContext.Provider value={{ user, setUser }}>
      {children}
    </RoleContext.Provider>
  );
};
