import { RestService } from '~app/common/rest';

const main = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            /** Start REST HTTP service */
            const restService = new RestService();
            await restService.ready;
            
            // Resolve when everything is finished...
            resolve();
        } catch (error) {
            reject(error as Error);
        }
    });
}

main();