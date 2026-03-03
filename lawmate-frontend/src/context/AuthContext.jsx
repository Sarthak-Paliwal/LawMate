/**
 * AuthContext — thin wrapper around Redux auth state.
 *
 * Components that already use `useAuth()` continue to work unchanged.
 * Under the hood, user/token come from Redux and API calls use RTK Query.
 */
import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetMyAdvocateProfileQuery,
} from '../store/services/lawmateApi';
import { logout as reduxLogout, mergeProfilePicture } from '../store/slices/authSlice';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);

  // RTK Query: fetch /auth/me when a token exists (cached, no re-fetch on every navigation)
  const { isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  // RTK Query: for advocates, fetch their profile alongside /auth/me
  // Result is used only to merge profilePicture into the user object
  const { data: advocateProfile } = useGetMyAdvocateProfileQuery(undefined, {
    skip: !token || user?.role !== 'advocate',
  });

  // Merge advocate profile picture into user.profileImage so Navbar can use it
  useEffect(() => {
    if (advocateProfile?.profilePicture) {
      dispatch(mergeProfilePicture(advocateProfile.profilePicture));
    }
  }, [advocateProfile, dispatch]);

  const loading = meLoading && !user;

  /* ---- Login ---- */
  const [loginMutation] = useLoginMutation();
  const login = async (email, password) => {
    const result = await loginMutation({ email, password }).unwrap();
    // authSlice extraReducer already stores token + user via matchFulfilled
    return result;
  };

  /* ---- Register ---- */
  const [registerMutation] = useRegisterMutation();
  const register = async (body) => {
    const result = await registerMutation(body).unwrap();
    return result;
  };

  /* ---- Logout ---- */
  const logout = () => {
    dispatch(reduxLogout());
  };

  /* ---- refreshUser (kept for backwards compat) ---- */
  // RTK Query handles refetching via cache invalidation, but components
  // that call refreshUser() will trigger a refetch of the Me query.
  const { refetch: refetchMe } = useGetMeQuery(undefined, { skip: !token });
  const refreshUser = () => refetchMe();

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
