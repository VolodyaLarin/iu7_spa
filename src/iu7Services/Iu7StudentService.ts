import { AxiosInstance } from 'axios';
import { IUser } from 'src/services/IAuthService';
import { IStudentService } from 'src/services/IStudentService';
import { Iu7CrudService } from './Iu7CrudService';

export class Iu7StudentService extends
  Iu7CrudService<IUser, Record<string, never>, Record<string, string>>
  implements IStudentService {
  constructor(axios: AxiosInstance) {
    super('students', axios, (x) => x, (x) => x);
  }

  async update(id: string, row: Record<string, string>): Promise<IUser> {
    const res = await this.axios.patch<IUser>(`${this.resourceName}/${id}`, {
      userId: id,
      ...row,
    });
    return res.data;
  }
}
