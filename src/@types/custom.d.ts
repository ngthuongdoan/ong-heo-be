declare namespace Express {
  export interface Request {
    user: any;
  }
  export interface Response {
    locals: {
      errorMessage?: string;
    };
  }
}
