import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConectorService } from 'src/app/services/conector.service';
import { CardModel } from '../../models/card.model';
import { UserModel } from '../../models/user.model';
import {AES, enc} from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  loading = false;
  ccNumber = '';
  user: UserModel = JSON.parse( localStorage.getItem('pkUser')|| '{}') ;
  date = new Date();
  firstDay = this.conex.formatoSQL(new Date());
  // firstDay = this.conex.formatoSQL(new Date(this.date.getFullYear(), this.date.getMonth(), 1));

  cards: any[] = [];
  card: CardModel = new CardModel();


  constructor(private conex: ConectorService,
              private router: Router) { }

  ngOnInit(): void {
    this.getCards();
  }

  info(){
    console.log('info');
  }

  getCards(){
    this.conex.getDatos('/cards/' + this.user.id) 
               .subscribe( (resp:any) => { 
                        console.log('res',resp['datos'])
                        this.cards = resp['datos'].filter( (c:any) => c.status !== 0 ), 
                        this.loading = false
                      });
  }

  

  formatoTarjeta(){
    const ultima = this.ccNumber.substr(this.ccNumber.length - 1)
    const str = isNaN(Number(ultima))

    if (str){
      this.ccNumber = this.ccNumber.substring(0, this.ccNumber.length - 1);
    }

    this.ccNumber = this.cc_format(this.ccNumber)
  }



  cc_format(value:any) {
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || ''
    let parts:any = []

    for (let i = 0, len = match.length; i < len ; i += 4) {
        parts.push(match.substring(i, i+4))
    }

    if (parts.length) {
        return parts.join(' ')
    } else {
        return value
    }
}


guardarCard(f:NgForm){

  let tarjeta = new CardModel();
  tarjeta.created_at = this.firstDay;
  tarjeta.short = this.ccNumber.slice(this.ccNumber.length - 4)
  tarjeta.userId = this.user.id;
  console.log('tarjeta', tarjeta);



  this.conex.getDatos('/key')
            .subscribe( (resp:any) => { 
                const key = resp['datos'][0].cripkey

                tarjeta.number = AES.encrypt(f.controls.card.value,key).toString();
                this.grabarTarjeta(tarjeta);
                
                const body ={
                  clientMail : 'tomas.sj@parkwash.cl',
                  asunto: 'Nueva tarjeta',
                  clientName: `${this.user.firstName} ${this.user.lastName}`,
                  texto: `Se ha registrado una nueva tarjeta (${tarjeta.short}) para el cliente ${this.user.firstName} ${this.user.lastName} `
              }
              this.conex.sendMail(body);
              },err =>{ console.log('error', err)});

  console.log('guardo', f.controls.card.value);

}

grabarTarjeta(card: CardModel){
  this.conex.guardarDato('/post/card/insert', card)
    .subscribe( (resp:any) => {
      console.log('guardado con exito');
      if (this.cards.length < 1){
        this.router.navigateByUrl('/user/perfil');
      } else {
        this.actualizarCards()
      }
    },err =>{ console.log('error')})
}


actualizarCards(){
  this.loading = true;
  for (let c of this.cards){
    c.active = 0;
      this.conex.guardarDato('/post/card/update', c)
          .subscribe( resp => { 
              console.log('grabé', resp);
            }, err => {
              console.log('err', err);
            })
  }
  this.loading = false;
  this.router.navigateByUrl('/user/perfil');

}




}
