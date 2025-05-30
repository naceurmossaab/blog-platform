import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AlreadyLoggedInGuard } from './guards/already-logged-in.guard';


export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'articles', pathMatch: 'full' },
      {
        path: 'articles',
        canActivate: [AuthGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent) },
          { path: 'new', loadComponent: () => import('./pages/article-form/article-form.component').then(m => m.ArticleFormComponent) },
          { path: 'edit/:id', loadComponent: () => import('./pages/article-form/article-form.component').then(m => m.ArticleFormComponent) },
          { path: ':id', loadComponent: () => import('./pages/article-details/article-details.component').then(m => m.ArticleDetailsComponent) },
        ],
      }
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

