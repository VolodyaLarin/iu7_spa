import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
    ],
  },
  {
    path: '/events',
    redirect() {
      return {
        name: 'calendar.day.view',
        params: {
          day: (new Date()).toISOString().split('T')[0],
        },
      };
    },
    name: 'calendar.day.view.redirect',
  },
  {
    path: '/events/:day',
    component: () => import('pages/EventsPage.vue'),
    name: 'calendar.day.view',
  },

  {
    path: '/students',
    component: () => import('pages/StudentsPage.vue'),
    name: 'students.view',
    meta: {
      title: 'Карточки студентов',
    },
  },
  {
    path: '/table',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/NewTable.vue'),
        name: 'table.view',
      },
    ],
    meta: {
      title: 'Посещаемость',
    },
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ProfilePage.vue'),
        name: 'profile.view',
      },
    ],
    meta: {
      title: 'Профиль',
    },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
