// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import FinancialDashboard from '../components/FinancialDashboard.vue';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/dashboard', name: 'FinancialDashboard', component: FinancialDashboard }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;