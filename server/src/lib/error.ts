export default class ResponseError extends Error {
  statusCode: number;
  constructor(msg: string, statusCode: number) {
    super(msg);
    this.statusCode = statusCode;
  }
}

export class UserNotFound extends ResponseError {
  constructor() {
    super("User not found", 404);
  }
}

export class Forbidden extends ResponseError {
  constructor(message?: string) {
    super(message || "Unauthorized access", 403);
  }
}