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


  constructor(private conex: ConectorService,
              private router: Router) { }

  ngOnInit(): void {
  }

  info(){
    console.log('info');
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

              },err =>{ console.log('error', err)});

  console.log('guardo', f.controls.card.value);

}

grabarTarjeta(card: CardModel){
  this.conex.guardarDato('/post/card/insert', card)
    .subscribe( (resp:any) => {
      console.log('guardado con exito');
      this.router.navigateByUrl('/user/perfil');
    },err =>{ console.log('error')})
}





}
