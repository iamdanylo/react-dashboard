import { Navigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from 'utils/storageKeys';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  let location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
