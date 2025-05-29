import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AlreadyLoggedInGuard } from './guards/already-logged-in.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'articles', pathMatch: 'full' },
      { path: 'articles', canActivate: [AuthGuard], loadComponent: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent) },
    ],
  },
  {
    path: 'auth',
    canActivate: [AlreadyLoggedInGuard],
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },

    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];

