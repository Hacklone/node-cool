import { AuthenticationType } from './authentication-type.enum';

export interface AuthenticationPersistenceProvider {
  registerUserAsync(authenticationId: string, authenticationType: AuthenticationType, userData: { name: string; email: string; profileImageUrl: string | null; }): Promise<void>;

  getUserByAuthenticationIdAsync(authenticationType: AuthenticationType, authenticationId: string): Promise<{ id: string; } | null | undefined>;
}