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
  recintos: any[] = [];
  plans: any[] = [];

  userCars: any[] = [];
  userCards: any[] = [];
  loading2 = false;


  modalUsuario = false;

  constructor(private conex:ConectorService) { 
 
    this.getRecintos();
    this.getPlans();

  }

  ngOnInit(): void {
  }

  info(){
    console.log('users', this.users)
    console.log('recintos', this.recintos)
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
 
  getRecintos(){
    this.conex.getDatos(`/recintos`)
              .subscribe( (resp:any) => { 
                this.getUsers();
                console.log('recintos', resp)
                this.recintos = resp['datos'].filter( (u:any) => u.status > 0);
              });
  }
  
  getPlans(){
    this.conex.getDatos(`/plans`)
              .subscribe( (resp:any) => { 
                console.log('plans', resp)
                this.plans = resp['datos'].filter( (u:any) => u.status > 0);
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
    if ( usuario.level === 1){
      this.loading2 = true;
      this.getCars(usuario.id)
    }
    console.log('select usuarios', this.user);
  }

  getCars(id:any){
    this.userCars = [];
    this.conex.getDatos('/cars/' + id )
              .subscribe( (resp:any) => { 
                  console.log('cars', resp);
                  this.getCards(id)
                  if (resp['datos'].length > 0){
                    for( let c of resp['datos']){
                      console.log('c', c);
                      const existeRecinto = this.recintos.find( (rec:any) => rec.id === c.recintoId)
                      console.log('existe reciento', existeRecinto)
                      c.recintoName = existeRecinto.nombre
                      
                      const existePlan = this.plans.find( (pla:any) => pla.id === c.planId)
                      if (existePlan){
                        console.log('existe plan', existePlan)
                        c.planName = existePlan.name;
                        c.planDesc = existePlan.description;
                      } else {
                        c.planName = 'pendiente'

                      }

                      this.userCars.push(c)
                    }
                  }
                })
  }
  
  getCards(id:any){
    this.userCards = [];
    this.conex.getDatos('/cards/' + id )
              .subscribe( (resp:any) => { 
                  this.loading2 = false;
                  console.log('cards', resp);
                  if (resp['datos'].length > 0){
                   for( let c of resp['datos']){
                     if (c.status > 0){
                      this.userCards.push(c)
                     }
                   }
                  }
                })
  }


  guardar(f: NgForm) {
    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    this.user.level = Number(this.user.level)

    console.log('guardaré usuario', this.user);
    this.conex.guardarDato('/post/usuarios/update', this.user)
              .subscribe( (resp:any) => {
                console.log('usuario guardado en bd', resp);
                this.exito('Datos guardados con éxito');
                this.modalUsuario = false;
            },err =>{ console.log('error', err)});
  }

  formCliente(f: NgForm) {
    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    // console.log('guardaré usuario', this.user);
    // this.conex.guardarDato('/post/usuarios/update', this.user)
    // .subscribe( resp => {
    //   console.log('usuario guardado en bd', resp);
    //   this.exito('Datos guardados con éxito');
    //   this.modalUsuario = false;

    // });
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
                console.log('usuario borrado en bd', resp);
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
