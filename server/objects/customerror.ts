/* 
    File Name: customerror.ts 
    Authors: Cindy Diaz, Hae Yeon Kang
    Website Name: Manage Support Website
    File Description: Custom error object
*/
module objects {
    export class CustomError extends Error {
        public status: number;
        constructor(message?: string) {
            super(message);
        }
    }
}

export = objects;    
