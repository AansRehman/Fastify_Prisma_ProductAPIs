import { FastifyReply, FastifyRequest } from "fastify";
import { createProduct, getProducts } from "./product.service";
import { CreateProductInput } from "./product.schema";

export async function createProductHandler(request:FastifyRequest<{Body: CreateProductInput}>, reply: FastifyReply) {
    const product = await createProduct({
        ...request.body, 
        ownerId: request.user.id
    })
    return product;
}

export async function getProductsHandler() {
    console.log("in handler")
    const products = await getProducts();

    return products;
}