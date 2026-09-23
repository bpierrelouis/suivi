export class AppError extends Error {
  constructor(status, code) {
    super(code);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export function forbidden(code = "ACCES_INTERDIT") {
  return new AppError(403, code);
}

export function notFound(code = "RESSOURCE_INTROUVABLE") {
  return new AppError(404, code);
}

export function conflict(code = "CONFLIT") {
  return new AppError(409, code);
}
