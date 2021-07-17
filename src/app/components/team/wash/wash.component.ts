import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { CarModel } from '../../models/car.model';
import { UserModel } from '../../models/user.model';
import { WashModel } from '../../models/wash.model';
import Swal from 'sweetalert2';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';


@Component({
  selector: 'app-wash',
  templateUrl: './wash.component.html',
  styleUrls: ['./wash.component.css']
})
export class WashComponent implements OnInit {
  
  loading = true;
  loading2 = true;
  searchString: string = '';

  id: any;
  hoy = new Date().toLocaleString().slice(0, 19).replace('T', ' ');

  user: UserModel   = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;
  team: any[]       = [];
  recintos: any[]   = [];
  cars: any[]       = [];
  antes: any[]       = [];
  despues: any[]       = [];

  wash: WashModel = new WashModel();
  car: CarModel = new CarModel();
  client: UserModel = new UserModel();

  modalAutos = false;
  editFecha = false;

    // SUBIR FOTO
  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });
  
  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public nombreArchivo = '';
  public URLPublica = '';
  public porcentaje = 0;
  public finalizado = false;
  public photo = '';
  // public photo = 'https://firebasestorage.googleapis.com/v0/b/parkwash-fa1eb.appspot.com/o/monty.png?alt=media&token=db7c84ac-449e-4964-860d-ab9d1f97a634';


  constructor(private conex: ConectorService,
              private route: ActivatedRoute,
              private router: Router,
              private firebaseStorage: FirebaseStorageService) { 
              this.id = this.route.snapshot.paramMap.get('id') || '';
              if (this.id === 'nuevo'){
                this.editFecha = true;
              }

              this.getFotos();
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
                if (this.id === 'nuevo'){
                  this.selectRecinto(this.recintos[0].id)
                 }
                // if( this.id == 'nuevo'){
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
    console.log('recintos', this.recintos)
    console.log('recinto', value)
    const existe = this.recintos.find( (res:any) => res.id == value);
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
            console.log('this.car', this.car)
          }
          this.loading = false;
          console.log('this.car2', this.car)

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
    const dia = new Date(this.wash.washDate).getDay()
    // const notToday = new Date(this.wash.washDate).getDay()
    
    if (dia === this.car.notToday ){
      this.notEseDia('el cliente bloqueo ese dia para lavados, buscar otra fecha por favor')
      return;
    }

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
                if (tarea === 'insert'){
                  this.router.navigateByUrl('/team/washes');
                }
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
//  ================== Subir Foto
//  =============================================  //
//  =============================================  //
//  =============================================  //



 //Evento que se gatilla cuando el input de tipo archivo cambia
 public cambioArchivo(event:any) {
  if (event.target.files.length > 0) {
    for (let i = 0; i < event.target.files.length; i++) {
      // console.log('i',i)
      // console.log('nombreArchivo', event.target.files[i].name)
      // console.log('nombreArchivo2', event.target.files[i].name.replace(/\s/g, ""))
      this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name.replace(/\s/g, "")}`;
      this.nombreArchivo = event.target.files[i].name.replace(/\s/g, "");
      this.datosFormulario.delete('archivo');
      this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name.replace(/\s/g, ""))
    }
  } else {
    this.mensajeArchivo = 'No hay un archivo seleccionado';
  }
}

//Sube el archivo a Cloud Storage
public subirArchivo(tipo:string) {
  let archivo = this.datosFormulario.get('archivo');
  let referencia = this.firebaseStorage.referenciaCloudStorage(this.nombreArchivo);
  let tarea = this.firebaseStorage.tareaCloudStorage(this.nombreArchivo, archivo);

  //Cambia el porcentaje
  tarea.percentageChanges().subscribe((porcentaje:any) => {
    this.porcentaje = Math.round(porcentaje);
    console.log('porcentaje', this.porcentaje);
    if (this.porcentaje == 100) {
      this.finalizado = true;
    }
  });

  referencia.getDownloadURL().subscribe((URL) => {
    this.URLPublica = URL;
    console.log('url', this.URLPublica);
    this.guardarFoto(tipo, URL);
    this.guardarLavado('update');
  }, err =>{ console.log('error', err)});
}


guardarFoto(type:string, urlPhoto:string){
  const body = { 
    washId: this.id,            
    tipo:type,
    url: urlPhoto
  }
  // console.log('guardo la foto', body);
  this.conex.guardarDato('/post/photos/insert', body)
            .subscribe ( resp => { 
                console.log('guarde en fotos', resp);
                this.getFotos();
              });
}

getFotos(){
  this.antes = [];
  this.despues = [];
  if (this.id === 'nuevo'){
    return;
  }
  this.loading2 = true;
  this.conex.getDatos('/photos/' + this.id)
            .subscribe( (resp:any) => { 
                        console.log('fotos', resp);
                        const fotos = resp['datos'];  
                        for (let f of fotos){
                          if (f.tipo === 'antes' && f.status > 0){
                            this.antes.push(f)
                          } else if(f.tipo === 'despues' && f.status > 0){
                            this.despues.push(f)
                          }
                        }
                        this.loading2 = false;
                      });
}

borrar(f:any){
  console.log('foto',f);
  const body = {
    washId: this.id, 
    id: f.id,         
    tipo:'borrar',
    status: 0
  }
  this.conex.guardarDato('/post/photos/borrar', body).subscribe(resp => { console.log('borrado', resp); this.getFotos()});
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

notEseDia(error: string) {
  // this.conex.sonido('exito.mp3');
  Swal.fire({
    title: 'No se puede agendar para ese dia',
    text: error,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true
  });
}

  
}
