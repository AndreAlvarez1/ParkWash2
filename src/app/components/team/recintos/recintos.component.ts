import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { RecintoModel } from '../../models/recinto.model';

@Component({
  selector: 'app-recintos',
  templateUrl: './recintos.component.html',
  styleUrls: ['./recintos.component.css']
})
export class RecintosComponent implements OnInit {

  loading                 = false;
  recinto: RecintoModel   = new RecintoModel();
  recintos: any[]         = [];
  modalRecinto            = false;
  searchString            = '';

  constructor(private conex: ConectorService) { }

  ngOnInit(): void {
    this.getRecintos();
  }


  info(){
    console.log('recintos', this.recintos);
  }

  getRecintos(){
    this.loading = true;
    this.conex.getDatos('/recintos').subscribe( (resp:any) => {
      this.recintos = resp['datos'];
      console.log('get recientos', this.recintos);
      this.loading = false;
    })
  }


  selectRecinto(r:any){
    this.recinto = r;
    this.modalRecinto = true;
  }

  modifStatus(){
    if(this.recinto.status > 0){
      this.recinto.status = 0;
    } else {
      this.recinto.status = 1;
    }
  }


  crearRecinto(){
    this.recinto      = new RecintoModel();
    this.modalRecinto = true;
  }

  
  BorrarRecinto(){
    console.log('borrar plan')
    this.conex.guardarDato('/post/recintos/borrar', this.recinto)
    .subscribe( (resp:any) => {
              console.log('borrado con exito');
             this.getRecintos();
             this.modalRecinto = false;
    },err =>{ console.log('error')})
  }

  guardarRecinto(f:NgForm){

    if (!f.valid){
      console.log('error formulario incompleto');
      return;
    }

    this.loading = true; 
    
    let tarea = 'update';

    if (this.recinto.id === 0){
      tarea = 'insert'
      this.recinto.reg_date =  this.conex.formatoSQL(new Date());
    }

    console.log('guardar plan', this.recinto);

    this.conex.guardarDato(`/post/recintos/${tarea}`, this.recinto)
        .subscribe( (resp:any) => {
                  console.log('guardado con exito');
                 this.getRecintos();
                 this.modalRecinto = false;
        },err =>{ console.log('error', err)})
  }




}
