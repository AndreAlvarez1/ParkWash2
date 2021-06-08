import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { UserModel } from '../../models/user.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  loading = false;
  searchString = '';
  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;
  usersAll: any[] = [];
  users: any[] = [];

  modalUsuario = false;

  constructor(private conex:ConectorService) { 
    this.getUsers();

  }

  ngOnInit(): void {
  }

  info(){
    console.log('users', this.users)
  }

  getUsers(){
    this.loading = true;
    this.conex.getDatos(`/users`)
              .subscribe( (resp:any) => { 
                console.log('users', resp)
                this.usersAll = resp['datos'].filter( (u:any) => u.status > 0);
                this.users = this.usersAll;
                this.loading = false;
              });
  }


  filtrarUsuarios(value:any){
    console.log('filtrar usuarios', value)
    if (value === 'Todos'){
      this.users = this.usersAll;
    } else {
      this.users = this.usersAll.filter( u => u.level == value)
    }

  }
  
  selectUser(usuario: UserModel){
    this.modalUsuario = true;
    this.user = usuario;
    console.log('select usuarios', this.user);
  }


  guardar(f: NgForm) {
    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    console.log('guardaré usuario', this.user);
    this.conex.guardarDato('/post/usuarios/update', this.user)
    .subscribe( resp => {
      console.log('usuario guardado en bd', resp);
      this.exito('Datos guardados con éxito');
      this.modalUsuario = false;

    });
  }

  seguroBorrar(){
    console.log('seguro borrar');
    Swal.fire({
      title: 'Estás seguro de borrar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
       this.borrarUsuario();
      }
    })
  }


  borrarUsuario(){
    this.user.status = 0;
    this.conex.guardarDato('/post/usuarios/update', this.user)
              .subscribe( resp => {
                console.log('usuario guardado en bd', resp);
                this.exito('Usuario borrado con exito');
                this.getUsers();
                this.modalUsuario = false;

              });
  }

  //  =============================================  //
//  =============================================  //
//  ================== Warnings
//  =============================================  //
//  =============================================  //
//  =============================================  //

exito(texto: string) {
  // this._gs.sonido('exito.mp3');
  Swal.fire({
    title: 'Excelente',
    icon: 'success',
    text: texto,
    confirmButtonColor: '#3085d6',
    timer: 3000,
    timerProgressBar: true
  });
}

error(error: string) {
  // this.conex.sonido('exito.mp3');
  Swal.fire({
    title: 'Cuec',
    text: error,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true
  });
}


}
