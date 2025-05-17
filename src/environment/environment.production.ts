export const environment = {
    httpServer: {
        port: process.env.HTTP_SERVER__PORT ? parseInt(process.env.HTTP_SERVER__PORT) : 8080
    },
    nanespace: process.env.NAMESPACE,
    production: true
};