import { AxiosInstance } from 'axios';
import { IAuthService, IUser } from 'src/services/IAuthService';

export class Iu7AuthService implements IAuthService {
  constructor(
    protected axios: AxiosInstance,
  ) {
    console.log('c');
  }

  getAuthEndpoint(): string {
    return `${this.axios.defaults.baseURL}auth/`;
  }

  async getUser(): Promise<IUser | null> {
    const response = await this.axios.get<IUser>('/auth/user');
    return response.data;
  }
}
