import { App, Request, Response } from '@tinyhttp/app';
import { IRoute, TranslatedHttpError, translateHttpError } from '~app/common/rest';
import { Service } from '~app/feature/webhook-example/service';

export class WebhookExampleRoute implements IRoute {
    public service!: Service;

    public constructor (
        // This path can be anything you want, using hook here for example
        private readonly basePath: string = '/hook'
    ) {
        this.service = new Service();
    }

    public applyRoutes(server: App): void {

        server.patch(`${this.basePath}`, async (request: Request, response: Response, next?: Function) => {
            try {
                const result = await this.service.updateRecord(request.body);
                console.log(result);
                response.statusCode = 200;
                response.send({status: 200, result: result});
            } catch (error: any) {
                const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
                response.statusCode = translatedHttpError.statusCode;
                response.send({error: translatedHttpError.message});
            }
            if (next) next();
        });

        server.post(`${this.basePath}`, async (request: Request, response: Response, next?: Function) => {
            try {
                const result = await this.service.createRecord(request.body);
                response.statusCode = 200;
                response.send({status: 200, result: result});
            } catch (error: any) {
                const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
                response.statusCode = translatedHttpError.statusCode;
                response.send({error: translatedHttpError.message});
            }
            if (next) next();
        });

        server.put(`${this.basePath}`, async (request: Request, response: Response, next?: Function) => {
            try {
                const result = await this.service.updateRecord(request.body);
                response.statusCode = 200;
                response.send({status: 200, result: result});
            } catch (error: any) {
                const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
                response.statusCode = translatedHttpError.statusCode;
                response.send({error: translatedHttpError.message});
            }
            if (next) next();
        });
    }
}