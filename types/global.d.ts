interface AuthState {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
}

interface AuthContext extends AuthState {
  refreshAuth: () => Promise<boolean>;
  signInHandler: () => Promise<boolean>;
  signOutHandler: () => Promise<boolean>;
}
