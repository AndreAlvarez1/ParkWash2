export class UserModel {
   id: number;
   firstName: string | undefined;
   lastName!: string;
   cellphone!: string;
   email!: string;
   gender!: string;
   rut!: string;
   address!: string;
   city!: string;
   lat!: number;
   lng!: number;
   status: number ;
   level: number;
   password: string;
   password2: string;

  constructor() {
   this.id  = 0;
   this.firstName = '';
   this.lastName = '';
   this.cellphone = '';
   this.email = '';
   this.gender = 'Femenino';
   this.rut = '';
   this.address = '';
   this.city = '';
   this.lat = 0;
   this.lng = 0;
   this.status = 0;
   this.level = 1;
   this.password = '';
   this.password2 = '';
  }
}


