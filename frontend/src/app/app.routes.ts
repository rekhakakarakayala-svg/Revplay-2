import { Routes } from '@angular/router';

// Notice we removed '.component' from the end of these paths!
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/home/home'; // 👈 We imported the Home component here

export const routes: Routes = [
  // When the URL is '/login', load the Login page
  { path: 'login', component: Login },
  
  // When the URL is '/register', load the Register page
  { path: 'register', component: Register },
  
  // When the URL is '/home', load the Home page
  { path: 'home', component: Home }, // 👈 We added the Home route here
  
  // If the URL is empty (just localhost:4200), redirect them to the login page automatically
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];