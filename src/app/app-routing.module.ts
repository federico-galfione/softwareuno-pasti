import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'restaurant',
    canActivate: [RoleGuard],
    loadChildren: () => import('./restaurant/restaurant.module').then( m => m.RestaurantPageModule)
  },
  {
    path: 'employee',
    canActivate: [RoleGuard],
    loadChildren: () => import('./employee/employee.module').then( m => m.EmployeePageModule)
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
