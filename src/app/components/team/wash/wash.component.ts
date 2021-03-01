import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';
import { CarModel } from '../../models/car.model';
import { UserModel } from '../../models/user.model';
import { WashModel } from '../../models/wash.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-wash',
  templateUrl: './wash.component.html',
  styleUrls: ['./wash.component.css']
})
export class WashComponent implements OnInit {
  
  loading = true;
  searchString: string = '';

  id: any;
  hoy = new Date().toLocaleString().slice(0, 19).replace('T', ' ');

  user: UserModel   = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;
  team: any[]       = [];
  recintos: any[]   = [];
  cars: any[]       = [];

  wash: WashModel = new WashModel();
  car: CarModel = new CarModel();
  client: UserModel = new UserModel();

  modalAutos = false;
  editFecha = false;

  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router) { 
              this.id = this.route.snapshot.paramMap.get('id') || '';
              if (this.id === 'nuevo'){
                this.editFecha = true;
              }
              }

  ngOnInit(): void {
    this.getrecintos();
  }

  info(){
    console.log('hoy', this.hoy);
    console.log('WASH', this.wash);
    console.log('id', this.id);
    console.log('team', this.team);
    console.log('user', this.user);
    console.log('recintos', this.recintos);
    console.log('cars', this.cars);
    console.log('car', this.car);
  }

  getrecintos(){
    this.conex.getDatos('/recintos')
              .subscribe( (resp:any) => { 
                console.log('resp', resp)
                this.recintos = resp['datos'];
                this.getTeam()
                // if( this.id !== 'nuevo'){
                //   this.recinto = this.recintos.find( (r:any) =>{ r.id === this.wash.recintoId });
                // }
              });
  }
  
  getTeam(){
    this.conex.getDatos('/team')
              .subscribe( (resp:any) => { 
                console.log('team', resp)
                this.team = resp['datos'];

                if (this.id === 'nuevo'){
                  this.wash.washerId = this.user.id;
                  this.loading = false;
                } else {
                  this.getWash();
                }
              });

  }

  
  selectWasher(value: number){
    const existe = this.team.find( (t:any) => t.id === Number(value));
    this.wash.washerId = existe.id;
  }

  selectRecinto(value: any){
    console.log('recinto', value)
    const existe = this.recintos.find( (res:any) => res.nombre === value);
    this.wash.recintoId = existe.id;
    this.getCars(this.wash.recintoId);
  }

  getCars(id:any) {
    console.log('id', id);
    this.loading = true;
    this.conex.getDatos('/carsXrecinto/' + id)
        .subscribe( (resp:any) => { 
          this.cars = resp['datos'];
          if (this.id !== 'nuevo'){
            this.car = this.cars.find( (c:any) => c.id === this.wash.carId);
            this.loading = false;
          }
        });
  }

  selectCar(car: any){
    console.log('car', car)
    this.wash.carId = car.id;
    this.car = car;
    this.modalAutos = false;
  }
  
  guardarLavado(tarea:string){
    console.log('guardar', this.wash);
    if (this.wash.washerId === 0 || this.wash.carId === 0 || this.wash.recintoId === 0 || this.wash.washDate === ''){
      console.log('faltan datos');
      this.error('Te faltaron datos');
      return;
    }


    if (this.wash.id > 0 && tarea !== 'borrar'){
      tarea = 'update'
    } 
    this.wash.updateDate = this.conex.formatoSQL(new Date());
    console.log('update', this.wash);
    
    this.conex.guardarDato('/post/wash/' + tarea, this.wash)
              .subscribe( (resp:any) => { 
                console.log('guardé', resp);
                this.exito('Lavado guardado con éxito')
                this.router.navigateByUrl('/team/washes');
              });
  }


//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== Lavado Existente
//  =============================================  //
//  =============================================  //
//  =============================================  //

getWash(){
  this.conex.getDatos('/wash/' + this.id).subscribe( (resp:any) => {
    this.wash = resp['datos'][0];
    console.log('wash', this.wash);
    this.getCars(this.wash.recintoId);
  });
}


selectEstado(value:number){
  console.log('estado', value);
  this.wash.status = Number(value);
  console.log('wash', this.wash);
}


//  =============================================  //
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
