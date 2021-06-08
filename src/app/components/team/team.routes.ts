import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { WashComponent } from './wash/wash.component';
import { WashesComponent } from './washes/washes.component';


export const rutasTeam: Routes = [
  {path: 'washes', component: WashesComponent},
  {path: 'wash/:id', component: WashComponent},
  {path: 'users', component: UsersComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];


