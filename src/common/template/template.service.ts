import { CODES } from '~app/common/enums';
import { asyncForEach } from '~app/common/utility';

export class TemplateService {
    private readonly templateMask = /{.*}/g;
    private readonly arrayMask = /(.*\[\])/gm;

    public async parse<T>(template: object, data: T[]): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!Array.isArray(data) || data.length < 1) {
                    throw new Error(JSON.stringify({code: CODES.EUNKNOWN, message: `Data must be an array`}));
                }
                const output: T[] = [];
                await asyncForEach(data, async (element: T) => {
                    output.push(await this.parseObject(template, element));
                });
                
                resolve(output);
            } catch (error) {
               reject(error as Error);
            }
        });
    }

    private async getTemplateKeys(template: object): Promise<any[]> {
        return Promise.resolve(Object.keys(template));
    }

    private async parseObject(template: any, data: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const output: any = new Object();
                const templateKeys: any[] = await this.getTemplateKeys(template);
                await asyncForEach(templateKeys, async(key: any) => {
                    switch (typeof template[key]) {
                        case 'object':
                            output[key] = await this.parseObject(template[key], data);
                            break;
                        case 'function': {
                            const func = template[key];
                            output[key] = func(data);
                            break;
                        }
                        default:
                            if(template[key].match(this.templateMask)) {
                                output[key] = await this.getData(template[key].replace(/{/g, '').replace(/}/g, '').split('.'), data);
                            } else {
                                output[key] = template[key];
                            }
                            break;
                    }
                });
                return resolve(output);
            } catch (error) {
                reject(error as Error);
            }
        })
       
        

    }

    private async getData(key: string[], data: any): Promise<any> {
        const traversedData = await this.traverseObject(data, key);
        return Promise.resolve(traversedData);
    }

    private async traverseObject(toTraverse: any, keys: string[], keyOffset = 0): Promise<any> {
        let output: any;
          try {
            
            if((keys.length - 1) > keyOffset) {
                output = await this.traverseObject(toTraverse[keys[keyOffset]], keys, keyOffset + 1);
            } else if (!toTraverse) {
                output = null;
            } else {
                output = toTraverse[keys[keyOffset]];
            }
            
            return Promise.resolve(output);
        } catch (error) {
            return Promise.reject(error);
        }
        
     }
}
