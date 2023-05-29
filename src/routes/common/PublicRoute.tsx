import { Navigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from 'utils/storageKeys';

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  let location = useLocation();

  if (!token) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default PublicRoute;
