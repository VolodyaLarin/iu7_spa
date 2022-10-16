import { defineStore } from 'pinia';
import { IUser } from 'src/services/IAuthService';
import { IStudentService } from 'src/services/IStudentService';

interface IStudentState {
  students: null | IUser[]
}

export const useStudentStore = defineStore<'student', IStudentState, Record<string, never>, {
  loadStudents:(service: IStudentService) => Promise<void>
    }>('student', {
      state: () => ({
        students: [],
      }),
      getters: {

      },
      actions: {
        async loadStudents(service: IStudentService) {
          try {
            this.students = await service.filter({});
          } catch {
            this.students = [];
          }
        },
      },
    });
