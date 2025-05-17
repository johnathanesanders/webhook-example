import { App, Request, Response } from '@tinyhttp/app';
import { IRoute } from '~app/common/rest';

// Here in the Root Route, we are just responding OK to any GET request to show that the service is up
export class RootRoute implements IRoute {

    public constructor (private readonly basePath: string = '/') {}

    public applyRoutes(server: App): void {
        server.get(`${this.basePath}`, async (_request: Request, response: Response, next?: Function) => {
            try {
                response.statusCode = 200;
                response.send({code: 200, message: `OK`});
            } catch (error) {
                response.send(error);
            }
            if (next) next();
        });
    }
}