import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && initialized) {
      if (!user) {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, initialized, navigate]);

  if (loading || !initialized) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 