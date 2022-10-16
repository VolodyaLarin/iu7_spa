import { ICrudService } from './ICrudService';

export interface IEventVisit {
  id: string,
  userId: string,
  eventId: string,
}
export interface IEvent {
  id: string;
  date: string;
  group: string;
  speaker: string;
  type: string;
  subject: string;
  place: string;
  theme: string;
  description: string;
  visits: IEventVisit[]
}

export type IEventFilter = {
  dateGt?: string,
  dateLt?: string,
  type?: string,
} & Record<string, string>

export interface IEventService extends ICrudService<IEvent, IEventFilter, Omit<IEvent, 'id' | 'visits'>> {
  addVisit(id: string): Promise<boolean>,
  syncVisits(id: string, userIds: string[]): Promise<boolean>;
}
