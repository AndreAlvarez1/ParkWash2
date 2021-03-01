import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/log/login/login.component';
import { RegistroComponent } from './components/log/registro/registro.component';
import { ResetComponent } from './components/log/reset/reset.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CarsComponent } from './components/user/cars/cars.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { WashesComponent } from './components/team/washes/washes.component';
import { WashComponent } from './components/team/wash/wash.component';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    ResetComponent,
    PerfilComponent,
    SidebarComponent,
    CarsComponent,
    LoadingComponent,
    WashesComponent,
    WashComponent,
    FilterPipe
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
