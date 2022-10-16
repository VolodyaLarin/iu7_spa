import { AxiosInstance } from 'axios';
import { IField, IFieldService } from 'src/services/IFieldsService';

export class Iu7FieldService implements IFieldService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getFields(): Promise<IField[]> {
    const response = await this.api.get<IField[]>('/fields');
    return response.data;
  }

  async updateFields(fields: IField[]) {
    const response = await this.api.put<IField[]>('/fields', fields);
    return response.data;
  }
}
