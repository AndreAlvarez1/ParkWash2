import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { CarModel } from '../../models/car.model';
import { RecintoModel } from '../../models/recinto.model';
import { UserModel } from '../../models/user.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  loading = true;
  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;
  recintos: any[] = [];
  cars: any[] = [];
  car: CarModel = new CarModel();
  modalVehiculo = false;
  recinto: RecintoModel = new RecintoModel();
  agregar = false;
  update = false;

  constructor(private conex: ConectorService) { 
      console.log('cars', this.cars);
      this.getCars();
  }

  ngOnInit(): void {
  }

  info(){
    console.log('recintos', this.recintos);
    console.log('car', this.car);
  }

  getrecintos(){
    this.conex.getDatos('/recintos')
              .subscribe( (resp:any) => { 
                console.log('resp', resp)
                this.recintos = resp['datos'];
              });
  }

  getCars(){
    console.log('user', this.user);
    this.conex.getDatos('/cars/' + this.user.id)
              .subscribe( (resp:any) => { 
                console.log('autos', resp)
                this.cars = resp['datos'];
                this.getrecintos();
                this.evaluarAgregar();
                this.loading = false;
              });
  }

  evaluarAgregar(){
    if (this.cars.length < 1){
      this.agregar = true;
      return;
    }

    if (this.user.level > 1){
      this.agregar = true;
      return;
    }

    this.agregar = false;
  }



  selectRecinto(r:any){
    this.recinto = this.recintos.find(rec => rec.nombre === r);
    console.log('recinto', this.recinto );
    this.car.recintoId = this.recinto.id;
  }

  guardar(f: NgForm) {
    console.log('guardar usuario', this.car);
    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    if( this.car.recintoId < 1){
      this.error('Falta que selecciones un recinto donde estará tu vehiculo')
      return;
    }

    this.car.userId = this.user.id;
    this.loading = true;

    if (this.car.tipo === 'Auto Hatchback' || this.car.tipo === 'Auto Sedán' ){
      this.car.size = 1;
    } else {
      this.car.size = 2;
    }
    console.log('auto', this.car);

    let tarea = 'insert';

    if (this.update){
      tarea = 'update';
    }

    this.conex.guardarDato(`/post/cars/${tarea}`, this.car)
              .subscribe( resp => {
                console.log('guardado', resp);
                this.getCars();

              }, (err) => {
                this.error(err.error.error.message)
              });
    this.modalVehiculo = false;
  }


  nuevo(){
    this.update = false;
    this.modalVehiculo = true;
  }

  editar(c: CarModel){
    this.update = true;
    this.car = c;
    this.recinto = this.recintos.find( res => res.id === c.recintoId);
    this.modalVehiculo = true;
  }

  borrar(c: CarModel){
    Swal.fire({
      title: '¿Estás Seguro?',
      text: '¿Quieres borrar ' + c.modelo + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('borrar', c);
        this.conex.guardarDato('/post/cars/borrar', c)
            .subscribe( resp => { 
              console.log('borrado', resp);
              Swal.fire(
                'Borrado!',
                `${c.modelo}, fue eliminado`,
                'success'
              )
              this.getCars();
              this.modalVehiculo = false;
            })
      }
    })

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
    title: 'Ups',
    text: error,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true
  });
}

}
