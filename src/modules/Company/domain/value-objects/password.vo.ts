import { InvalidPasswordError } from "../errors/invalid-password.js"



export class Password {

  private constructor(
    private readonly _value: string
  ) {
    Object.freeze(this)
  }

  static create(password: string): Password {

   if (password.length < 8) {
  throw new InvalidPasswordError( "Password must be at least 8 characters long"
  )
}

    const hasLetter = /[a-zA-Z]/.test(password)

    if (!hasLetter) {
      throw new InvalidPasswordError(
        "Password must contain letters"
      )
    }

    const hasNumber = /\d/.test(password)

    if (!hasNumber) {
  throw new InvalidPasswordError(
    "Password must contain numbers"
  )
}

    const hasSpecialCharacter =
      /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasSpecialCharacter) {
      throw new Error(
        "Password must contain special characters"
      )
    }

    return new Password(password)
  }

  get value(): string {
    return this._value
  }
}