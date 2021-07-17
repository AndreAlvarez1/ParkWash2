import { Routes } from '@angular/router';
import { CarsAdminComponent } from './cars-admin/cars-admin.component';
import { PlansComponent } from './plans/plans.component';
import { UsersComponent } from './users/users.component';
import { WashComponent } from './wash/wash.component';
import { WashesComponent } from './washes/washes.component';


export const rutasTeam: Routes = [
  {path: 'washes', component: WashesComponent},
  {path: 'wash/:id', component: WashComponent},
  {path: 'users', component: UsersComponent},
  {path: 'plans', component: PlansComponent},
  {path: 'cars', component: CarsAdminComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];


