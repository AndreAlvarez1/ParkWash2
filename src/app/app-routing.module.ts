import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { rutasLog } from './components/log/log.routes';
import { rutasTeam } from './components/team/team.routes';
import { rutasUser } from './components/user/user.routes';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'logs', children: rutasLog},
  { path: 'user', children: rutasUser, canActivate: [AuthGuard]},
  { path: 'team', children: rutasTeam, canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
