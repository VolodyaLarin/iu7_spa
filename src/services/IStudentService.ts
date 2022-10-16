import { IUser } from './IAuthService';
import { ICrudService } from './ICrudService';

export type IStudentService = ICrudService<IUser, Record<string, never>, Record<string, string>>;
