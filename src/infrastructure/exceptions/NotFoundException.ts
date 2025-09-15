export class NotFoundException extends Error {
    statusCode = 404;
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}