import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from '@fastify/jwt';
import swagger from "@fastify/swagger-ui"
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import ProductRoutes from "./modules/product/product.route";
import { userSchmeas } from "./modules/user/user.schema"; 
import { productSchemas } from "./modules/product/product.schema";
import { request } from "https";
import fastify from "fastify";
import fastifyJwt from "fastify-jwt";
import {version} from "../package.json"

export const server = Fastify()

declare module "fastify"{
    export interface FastifyInstance{
        authenticate: any;
    }
}

declare module "@fastify/jwt"{
    interface fastifyJwt{
        user: {
            id: number,
            email: string,
            name: string
        }
    }
}


server.register(fjwt, {
    secret: 'topsecert', 
})

server.decorate("authenticate", async(request: FastifyRequest, reply: FastifyReply)=>{
    try {
        await request.jwtVerify();
    } catch (e) {
        return reply.send(e)
        
    }

})

server.get("/healthcheck", async function () {
    return {status: "OK"};
    
});


async function main() {

    for(const schema of [...userSchmeas, ...productSchemas]){
        server.addSchema(schema);
    }

    await server.register(require('@fastify/swagger'))

    server.register(
        swagger,
        withRefResolver({
            routePrefix: '/docs',
            exposeRoute: true,
            staticCSP: true,
            openapi:{
                info:{
                    title: 'Fastify API',
                    description: 'API for some products',
                    version,
                },
            },
        })
    );

    
    server.register(userRoutes, {prefix: 'api/users'})
    server.register(ProductRoutes, {prefix: 'api/products'})


    try{
        await server.listen(3000, "0.0.0.0");
        console.log("Server started at http://localhost:3000");

    }catch(e){
        console.log(e);
        process.exit(1);
    }
}
main()