import { IEvent, IEventFilter, IEventService } from 'src/services/IEventService';
import { AxiosInstance } from 'axios';
import { Iu7CrudService } from './Iu7CrudService';

export class Iu7EventService extends Iu7CrudService<IEvent, IEventFilter, Omit<IEvent, 'id' | 'visits'>> implements IEventService {
  constructor(axios: AxiosInstance) {
    super('events', axios, (x) => x, (x) => ({
      date: x.date || '',
      group: x.group || '',
      speaker: x.speaker || '',
      type: x.type || '',
      subject: x.subject || '',
      place: x.place || '',
      theme: x.theme || '',
      description: x.description || '',
    }));
  }

  async addVisit(id: string): Promise<boolean> {
    await this.axios.post(`${this.resourceName}/${id}/visits`);
    return true;
  }

  async syncVisits(id: string, userIds: string[]): Promise<boolean> {
    await this.axios.put(`${this.resourceName}/${id}/visits`, userIds);
    return true;
  }

  async syncEvents(date: Date): Promise<boolean> {
    await this.axios.post(`/tasks/syncTimeTable/${date.toISOString().split('T')[0]}`);
    return true;
  }

  async filter(filter: IEventFilter): Promise<IEvent[]> {
    const data = await super.filter(filter);
    return data.sort((a, b) => (a.date > b.date ? 1 : -1));
  }
}
