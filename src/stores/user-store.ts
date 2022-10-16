import { defineStore } from 'pinia';
import { IAuthService, IUser } from 'src/services/IAuthService';

interface IUserState {
  status: 'notLoaded' | 'guest' | 'loaded'
  user: null | IUser
}

export const useUserStore = defineStore<'user', IUserState, {
  getUser:(r: IUserState) => IUser | null,
  getRole: (r: IUserState) => 'user' | 'leader' | 'guest',
    }, {
  loadUser: (service: IAuthService) => Promise<void>,
  logout: () => void,
}>('user', {
      state: () => ({
        status: 'notLoaded',
        user: null,
      }),
      getters: {
        getUser: (r) => r.user,
        getRole: (r) => r.user?.role || 'guest',
      },
      actions: {
        async loadUser(service: IAuthService) {
          try {
            this.user = await service.getUser();
          } catch {
            this.user = null;
          }
          if (this.user) {
            this.status = 'loaded';
          } else {
            this.status = 'guest';
          }
        },
        logout() {
          this.user = null;
          this.status = 'guest';
          localStorage.removeItem('api_token');
        },
      },
    });
