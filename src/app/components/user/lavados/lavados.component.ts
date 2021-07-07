import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';
import { CarModel } from '../../models/car.model';
import { UserModel } from '../../models/user.model';
import { WashModel } from '../../models/wash.model';

@Component({
  selector: 'app-lavados',
  templateUrl: './lavados.component.html',
  styleUrls: ['./lavados.component.css']
})
export class LavadosComponent implements OnInit {


  loading = false;
  date = new Date();
  firstDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
  lastDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth() + 2, 1));
  hoy = new Date().toLocaleString().slice(0, 19).replace('T', ' ');

  searchString = '';

  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;

  washesAll: any[] = [];
  washes: any[] = [];


  constructor(private conex:ConectorService,
              private route: ActivatedRoute,
              private router: Router) { 
              this.getWashes();
  }

  ngOnInit(): void {
  }

  info(){
    console.log('info');
  }

  getWashes(){

    console.log('first', this.firstDay)
    console.log('last', this.lastDay)

    this.loading = true;
    this.conex.getDatos(`/washesXuser/${this.firstDay}/${this.lastDay}/${this.user.id}`)
              .subscribe( (resp:any) => { 
                console.log('washes', resp)
                this.washesAll = resp['datos'];
                this.washes = this.washesAll;
                this.loading = false;
              });
  }

  selectWash(w:WashModel){
    console.log('w', w);
    this.router.navigateByUrl('user/lavado/'+ w.id);
  }

  filtrar(f:NgForm) {
    this.firstDay = f.value["fechaIni"];
    this.lastDay = f.value["fechaFin"];
    this.getWashes();
    }


    selectEstado(estado:string){
      console.log('estado', estado, this.washesAll);
  
      if (estado === 'Todos'){
        this.washes = this.washesAll;
        return;
      }
      this.washes = this.washesAll.filter( (w:any) => w.status === Number(estado));
  
  
    }
  




}
