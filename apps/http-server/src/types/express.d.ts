import * as express from 'express';

interface User {
  name: string;
  id: string;
  email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User; // or whatever type you want to use for the user
        }
    }
}