import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/components/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user: UserModel = new UserModel();

  constructor(private auth: AuthService ) { 
    const info = localStorage.getItem('pkUser');
    this.user = info !== null ? JSON.parse(info) : new UserModel();
  }


  cerrarSesion(){
    this.auth.logout();
  }


  ngOnInit(): void {
  }

}
