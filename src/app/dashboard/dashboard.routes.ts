import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard)
    },
    {
        path: 'users',
        loadComponent: () => import('./users/users').then(c => c.Users)
    },
    {
        path: 'users/new',
        loadComponent: () => import('./user-form/user-form').then(c => c.UserForm)
    },
    {
        path: 'users/edit/:id',
        loadComponent: () => import('./user-form/user-form').then(c => c.UserForm)
    }
];