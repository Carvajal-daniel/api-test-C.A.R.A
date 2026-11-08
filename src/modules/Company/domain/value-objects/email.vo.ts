import { InvalidEmailError } from "../errors/Invalid-email.js";




export class ComapnyEmail {
  private readonly _value: string

  private constructor(value: string){
    this._value = value
    Object.freeze(this)
  }

  static create(email: string): ComapnyEmail{

    const emailClean = email.trim().toLocaleLowerCase();

    if(!emailClean || !this.validate(emailClean) ){
      throw new InvalidEmailError()
    }
    return new ComapnyEmail(email)
  }

  private static validate(email:string){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email)
  }

  get value(): string{return this._value}
}