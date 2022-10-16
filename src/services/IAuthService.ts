export interface IContingent {
  id: string;
  login: string;
  surname: string;
  name: string;
  secname: string;
  birthday: string;
  group: string;
}

export interface IUser {
  id: string;
  login: string;
  contingentLogin: string;
  photo: string;
  role: 'user' | 'leader';
  contingent: IContingent | null;
  student: Record<string, string> | null;
}

export interface IAuthService {
  getAuthEndpoint(): string;
  getUser(): Promise<IUser | null>;
}
