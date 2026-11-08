
import { InvalidPasswordError } from "../errors/invalid-password.js";

export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    Object.freeze(this); // Garante a imutabilidade real do valor no domínio
  }

  static create(password: string): Password {
    // 1. Defesa inicial: se a senha for nula, indefinida ou vazia
    if (!password) {
      throw new InvalidPasswordError(
        "A senha não pode ser nula, indefinida ou vazia."
      );
    }

    const passwordClean = password.trim();

    // 2. Validação baseada estritamente nos limites da UI do AppBarber (6 a 15 caracteres)
    if (passwordClean.length < 6 || passwordClean.length > 15) {
      throw new InvalidPasswordError(
         "A senha deve ter entre 6 e 15 caracteres."
      );
    }

    // 3. Retorna a instância protegida com o valor higienizado
    return new Password(passwordClean);
  }

  get value(): string {
    return this._value;
  }
}
