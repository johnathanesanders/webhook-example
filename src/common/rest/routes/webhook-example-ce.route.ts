import { App, Request, Response } from '@tinyhttp/app';
import { IRoute, TranslatedHttpError, translateHttpError } from '~app/common/rest';
import { Service } from '~app/feature/webhook-example-ce/service';
import { HTTP } from 'cloudevents';

export class WebhookExampleCloudEventRoute implements IRoute {
    public service!: Service;

    public constructor (
        // This path can be anything you want, using hook-ce here for example
        private readonly basePath: string = '/hook-ce'
    ) {
        this.service = new Service();
    }

    public applyRoutes(server: App): void {

        // Per the cloudevents spec, POST is the only method that should be used for cloudevents
        server.post(`${this.basePath}`, async (request: Request, response: Response, next?: Function) => {
            try {

                const result = await this.service.processRequest<any>(HTTP.toEvent({headers: request.headers, body: request.body}));
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