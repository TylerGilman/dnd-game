// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {

  // we do want to allow anonymous user

  // const { user } = useAuth();
  
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <>{children}</>;
};
