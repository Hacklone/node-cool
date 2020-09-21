import { UserSession } from './user-session.interface';

export interface ApplicationState {
  user: UserSession;
}