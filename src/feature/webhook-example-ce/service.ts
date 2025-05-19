import { TemplateService } from '~app/common/template';
import { CloudEventV1 } from 'cloudevents';

export class Service {
    public ready: Promise<any>;
    private readonly templateService!: TemplateService;

    public constructor() {
        this.templateService = new TemplateService();
        this.ready = new Promise(async (resolve, reject) => {
            try {
                // This try block allows you to initialize anything you need prior to the service and route becoming available
                // For example, if you needed to verify a database connection, you could do that here
                resolve(undefined);
            } catch (error) {
                console.error(error);
                reject(error as Error);
            }
        });
    }

    public async processRequest<T>(input: CloudEventV1<T> | CloudEventV1<T>[]): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                // You could typically write to a database here, send an email, etc.
                // For this example, we are just going to return the input
                console.log('RECEIVED CLOUD EVENT OF:', input);
                // The template service can parse JSON/Objects into an output template of your choosing.
                // You also don't HAVE to return anything in the result here. 
                resolve({message: `Input for cloud event sucessfully received!`, result: 'OK'});
                //resolve({message: `Input for cloud event sucessfully received!`, result: await this.templateService.parse(templates.getTemplate, [input])});
            } catch (error) {
                reject(error as Error);
            }
        });
    }

}