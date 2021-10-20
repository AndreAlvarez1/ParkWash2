import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorService } from 'src/app/services/conector.service';
import { CarModel } from '../../models/car.model';
import { CardModel } from '../../models/card.model';
import { PlanModel } from '../../models/plan.model';
import { RecintoModel } from '../../models/recinto.model';
import { UserModel } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  loading = true;
  recintos: any[] = [];
  cars: any[] = [];
  car: CarModel = new CarModel();
  plans: any[] = [];
  
  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;

  modalVehiculo = false;
  recinto: RecintoModel = new RecintoModel();
  agregar = false;
  update = false;
  washes: any[] = [];

  cards: any[] = [];
  card: CardModel = new CardModel();

date = new Date();
firstDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
lastDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0));


  constructor(private auth:AuthService,
              private conex: ConectorService,
              private router: Router) {
                
    console.log('user', this.user);
    this.getCars();
    this.getCards();
    
                if (this.user.level !== 1){
                  this.getWashes('Todos');
                }
   }

  ngOnInit(): void {
    console.log('firstday', this.firstDay)
    console.log('last', this.lastDay);
  }
  

  info(){
    // console.log('recintos', this.recintos);
    console.log('car', this.car);
    console.log('cars', this.cars);
    console.log('plans', this.plans);
    const hoy = new Date();

    console.log('hoy', hoy.getDay())
  }

 getCards(){
   this.conex.getDatos('/cards/' + this.user.id) 
              .subscribe( (resp:any) => { this.cards = resp['datos'], console.log('cards', this.cards)});
 }

  getCars(){
    console.log('user', this.user);
    this.conex.getDatos('/cars/' + this.user.id)
              .subscribe( (resp:any) => { 
                this.getrecintos();

                console.log('autos', resp)
                this.cars = resp['datos'];
                
                if (this.cars.length > 0){
                  this.car = this.cars[0];
                  this.getPlans();
                } else {
                  this.loading = false;
                }

                this.evaluarAgregar();

              });
  }

  getrecintos(){
    this.conex.getDatos('/recintos')
              .subscribe( (resp:any) => { 
                console.log('resp', resp)
                this.recintos = resp['datos'];
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
              this.plans = [];
              this.modalVehiculo = false;
            })
      }
    })

  }


//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== Planes
//  =============================================  //
//  =============================================  //
//  =============================================  //



getPlans(){
  this.plans = [];

  this.conex.getDatos('/plans').subscribe( (resp:any) => {
    const all = resp['datos'].filter( (p:any) => p.recintoId === this.car.recintoId && p.status > 0)
    for (let p of all){
      let plan = new PlanModel();
      plan = p;
      this.plans.push(plan);
    }


    console.log('this.plans', this.plans);
    console.log('car', this.car);
    this.loading = false;

  });
}



choosePlan(p:any){
  console.log('plan', p);

  // Valido que han pasaado mas de X Dias para poder cambiarse de plan
  const fecha = this.validarFecha();
  if( !fecha.status && this.car.planId > 0){
    this.error(`Ya hicisite un cambio dentro del periodo permitido, tienes que esperar ${fecha.falta} dias. Si es urgente envianos un mail a contacto@parkwash.cl`);
    return;
  }

  this.car.planId = p.id
  console.log('car', this.car);

  this.conex.guardarDato('/post/cars/update', this.car).subscribe( resp => { console.log('resp', resp)})
}

validarFecha(){
  const limite = 30 // Este numero es cada cuantos dias puede cambiarse de plan.

  const hoy = new Date();
  const fechaPlan = new Date( this.car.reg_date);

  console.log('fecha ultimo cambios', fechaPlan);
  console.log('fecha hoy', hoy);

  const Difference_In_Time = hoy.getTime() - fechaPlan.getTime(); 
  const dias = Math.round(Difference_In_Time / (1000 * 3600 * 24)); 

  console.log('dias', dias);
  const obj = { status: true, falta: 0}
  
  if (dias < limite){
    obj.status = false;
    obj.falta = limite - dias;
  }
  
  return obj;

}


selectCar(value:any){
  console.log('car', value)
  this.car = this.cars.find( c => c.id == value);
  this.getPlans();
  console.log('este', this.car);
}



//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== WEBPAY ==================   //
//  =============================================  //
//  =============================================  //
//  =============================================  //


webpay(orderId:any) {

  const body = {
    storeCode: 597044444405, // CAMBIAR POR CODIGO DE COMERCIO DE PARK 
    amount: 2000,
    buyOrder: orderId 
  };

  // this.conex.guardarDato(`/wp/pagoOnePay/${orderId}/${this.storeId}`, body)
  //           .subscribe( resp => {
  //             console.log('testWP', resp);
  //             this.response.token = resp['token'];
  //             this.response.url = resp['url'];
  //             this.response.orderId = orderId;
  //             console.log('response', this.response);
  //             this.loading = false;
  //             this.postear(this.response)
  //           })
}


inscription(){
  const body = {id:''};
  this.conex.guardarDato('/initInscription', body).subscribe(resp => console.log('resp init'))
}


//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== WASHER
//  =============================================  //
//  =============================================  //
//  =============================================  //

getWashes(recintoId:any){
  this.loading = true;
  this.conex.getDatos(`/washes/${this.firstDay}/${this.lastDay}/${recintoId}`)
            .subscribe( (resp:any) => { 
              const washesAll = resp['datos'];
              this.washes = washesAll.filter( (w:any) => w.washerId === this.user.id && w.status != 0);
              console.log('washes', this.washes);
              this.loading = false;
            });
}

abrirLavado(id:number){
  this.router.navigateByUrl('/team/wash/'+ id);
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
    // timer: 3000,
    // timerProgressBar: true
  });
}



}
