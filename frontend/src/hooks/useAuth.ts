import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, getMe, logout } from '../features/userSlice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector(state => state.user);

  const signIn = useCallback((credentials: any) => {
    return dispatch(login(credentials));
  }, [dispatch]);

  const fetchUser = useCallback(() => {
    dispatch(getMe());
  }, [dispatch]);

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated: !!token,
    signIn,
    fetchUser,
    signOut,
    loading,
    error,
  };
};