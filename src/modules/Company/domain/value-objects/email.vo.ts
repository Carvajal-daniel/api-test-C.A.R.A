import { InvalidEmailError } from "../errors/Invalid-email.js";




export class CompanyEmail {
  private readonly _value: string

  private constructor(value: string){
    this._value = value
    Object.freeze(this)
  }

  static create(email: string): CompanyEmail{

    const emailClean = email.trim().toLowerCase();

    if(!emailClean || !this.validate(emailClean) ){
      throw new InvalidEmailError()
    }
    return new CompanyEmail(emailClean)
  }

  private static validate(email:string){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email)
  }

  get value(): string{return this._value}
}