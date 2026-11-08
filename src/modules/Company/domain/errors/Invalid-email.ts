import { AppError } from "../../../../shared/Errors/app-errors.js";



export class InvalidEmailError extends AppError{
  constructor(){
    super("Invalid email", 409)
  }
}