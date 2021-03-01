import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';
import { RecintoModel } from '../../models/recinto.model';
import { UserModel } from '../../models/user.model';
import { WashModel } from '../../models/wash.model';
import { CarModel } from '../../models/car.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-washes',
  templateUrl: './washes.component.html',
  styleUrls: ['./washes.component.css']
})
export class WashesComponent implements OnInit {

  loading = false;
  date = new Date();
  searchString = '';
  firstDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
  lastDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0));

  hoy = new Date().toLocaleString().slice(0, 19).replace('T', ' ');

  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;

  washesAll: any[] = [];
  washes: any[] = [];
  recintos: any[] = [];
  recinto: RecintoModel = new RecintoModel();

 
  constructor(private conex: ConectorService, private router: Router) { }

  ngOnInit(): void {
    this.getrecintos();
    this.getWashes('Todos');
  }


  info(){
    console.log('first', this.firstDay );
    console.log('last', this.lastDay);
    console.log('recintos', this.recintos);
    console.log('recinto', this.recinto);
    console.log('washes all', this.washesAll);
    console.log('washes', this.washes);
  }


  getrecintos(){
    this.conex.getDatos('/recintos')
              .subscribe( (resp:any) => { 
                console.log('resp', resp)
                this.recintos = resp['datos'];
              });
  }
  
  selectRecinto(value: any){
    console.log('recinto', value)
    if (value === 'Todos'){
      this.recinto = new RecintoModel();
      this.recinto.id = 0;
      this.recinto.nombre = 'todos';
      return;
    }

    this.recinto = this.recintos.find( (res:any) => res.nombre === value);

  }

  getWashes(recintoId:any){
    this.loading = true;
    this.conex.getDatos(`/washes/${this.firstDay}/${this.lastDay}/${recintoId}`)
              .subscribe( (resp:any) => { 
                console.log('washes', resp)
                this.washesAll = resp['datos'];
                this.washes = this.washesAll;
                this.loading = false;
              });
  }

  selectWash(w:WashModel){
    console.log('w', w);
    this.router.navigateByUrl('team/wash/'+ w.id);
  }

  selectEstado(estado:string){
    console.log('estado', estado, this.washesAll);

    if (estado === 'Todos'){
      this.washes = this.washesAll;
      return;
    }
    this.washes = this.washesAll.filter( (w:any) => w.status === Number(estado));


  }


  filtrar(f:NgForm) {
    this.firstDay = f.value["fechaIni"];
    this.lastDay = f.value["fechaFin"];

    let recintoId:any = 'todos';

    if (this.recinto.id != 0){
      recintoId = this.recinto.id
    }
    this.getWashes(recintoId);
    }


}
