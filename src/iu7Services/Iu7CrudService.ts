import { AxiosInstance } from 'axios';
import { ICrudService } from '../services/ICrudService';

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const filtersToQuery = (filters: Record<string, string>) => Object.entries(filters)
  .map(([key, value]) => `${camelToSnakeCase(key)}=${value}`)
  .join('&');
export class Iu7CrudService<T, F extends Record<string, string>, U, ST = T, SU = U>
implements ICrudService<T, F, U> {
  constructor(
    protected resourceName: string,
    protected axios: AxiosInstance,
    protected st2t: (st: ST) => T,
    protected u2su: (u: U) => SU,
  ) {
    console.log('c');
  }

  async filter(filter: F): Promise<T[]> {
    const response = await this.axios.get<ST[]>(`${this.resourceName}/?${filtersToQuery(filter)}`);
    return response.data.map(this.st2t);
  }

  async update(id: string, row: U): Promise<T> {
    const response = await this.axios.put<ST>(
      `${this.resourceName}/${id}`,
      this.u2su(row),
    );
    return this.st2t(response.data);
  }

  async insert(row: U): Promise<T> {
    const response = await this.axios.post<ST>(
      this.resourceName,
      this.u2su(row),
    );
    return this.st2t(response.data);
  }

  async read(id: string): Promise<T | null> {
    const response = await this.axios.get<ST>(`${this.resourceName}/${id}`);
    return this.st2t(response.data);
  }

  async delete(id: string): Promise<boolean> {
    await this.axios.delete<ST>(`${this.resourceName}/${id}`);
    return true;
  }
}
