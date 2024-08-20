import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";
import { connected } from "process";
import { getProducts } from "./product.service";

async function ProductRoutes(server:FastifyInstance) {
    server.post('/', {
        preHandler:[server.authenticate],
        schema:{
            body: $ref('createProductSchema'),
            response: {
                201: $ref('productResponseSchema')
            },
        },
    }, createProductHandler);

    server.get('/',{

    }, getProductsHandler)
}

export default ProductRoutes;