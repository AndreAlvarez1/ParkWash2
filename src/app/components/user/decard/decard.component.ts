import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AES, enc} from 'crypto-js';


@Component({
  selector: 'app-decard',
  templateUrl: './decard.component.html',
  styleUrls: ['./decard.component.css']
})
export class DecardComponent implements OnInit {

  cardX = '';
  code = '';
  numbe = '';

  constructor() { }

  ngOnInit(): void {
  }

  decryptar(f:NgForm){
    this.numbe = ''
    console.log('puse', this.cardX)
    const decrypted = AES.decrypt(this.cardX, this.code);

    console.log('decrypt',decrypted )

    const decryptedText = decrypted.toString(enc.Utf8);
    console.log('decryptedText', decryptedText);

    this.numbe = decryptedText;
  }

}


 
