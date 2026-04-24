import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(r => r.AUTH_ROUTES)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];