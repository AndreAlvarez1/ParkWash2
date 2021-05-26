import { Component, OnInit } from '@angular/core';
import { ConectorService } from 'src/app/services/conector.service';
import { CardModel } from '../../models/card.model';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  loading = true;
  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;
  cards: any[] = [];
  card: CardModel = new CardModel();


// date = new Date();
// firstDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
// lastDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0));


  constructor(private conex:ConectorService) { }

  ngOnInit(): void {
    this.getCards();
  }


  info(){
    console.log('this.cards', this.cards);
  }

  getCards(){
    this.conex.getDatos('/cards/' + this.user.id) 
               .subscribe( (resp:any) => { 
                        console.log('res',resp['datos'])
                        this.cards = resp['datos'].filter( (c:any) => c.status !== 0 ), 
                        this.loading = false
                      });
  }

  cambiar(tarjeta:any, accion:string){
    console.log('aca', tarjeta )
    console.log('accion', accion )

    if (accion === 'borrar'){
      tarjeta.status = 0;
      this.updateCard(tarjeta, accion);
      this.cards = this.cards.filter ( (ca:any) => ca.id !== tarjeta.id);
    } else {
      for ( let i of this.cards){
        i.active = 0
        if( i.id === tarjeta.id){
          console.log('esta es')
          i.active = 1
        } 
        this.updateCard(i, accion)
      }
    }
  }

  updateCard(c:CardModel, accion:string){
    console.log('card', c);
    console.log('accion', accion);
    this.conex.guardarDato('/post/card/' + accion, c)
              .subscribe( resp => { 
                  console.log('grabé', resp);
                  this.loading = false;
                }, err => {
                  console.log('err', err);
                  this.loading = true;
                })
  }
}
