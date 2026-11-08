

export class InvalidEmailError extends Error {
  constructor() {
    super("Formato de e-mail inválido.");
    this.name = "InvalidEmailError";
  }
}