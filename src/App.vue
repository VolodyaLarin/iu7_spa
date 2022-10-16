<template>
  <router-view />
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import { Dark } from 'quasar';
import { Iu7AuthService } from './iu7Services/Iu7AuthService';
import { Iu7EventService } from './iu7Services/Iu7EventService';

import { useUserStore } from './stores/user-store';
import { useStudentStore } from './stores/student-store';
import { api } from './boot/axios';
import { Iu7StudentService } from './iu7Services/Iu7StudentService';
import { Iu7FieldService } from './iu7Services/Iu7FieldService';

provide('IEventService', new Iu7EventService(api));

const authService = new Iu7AuthService(api);
provide('IAuthService', authService);

const studentService = new Iu7StudentService(api);
provide('IStudentService', studentService);
provide('IFieldService', new Iu7FieldService(api));

const store = useUserStore();
store.loadUser(authService);

useStudentStore().loadStudents(studentService);

// Dark.set('auto');
</script>
