import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { request } from "http";
import { verify } from "crypto";
import { verifyPassword } from "../../utils/hash";
import { access } from "fs";
import { server } from "../../app";

export async function registerUserHandler(request: FastifyRequest<{Body: CreateUserInput;}>, reply: FastifyReply) {
    const body = request.body;

    try {
        const user = await createUser(body);
        return reply.code(201).send(user)
    } catch (e) {
        console.log(e)
        return reply.code(500).send(e)
    }
}

export async function loginHandler(request: FastifyRequest<{Body: LoginInput}>, reply:FastifyReply) {

    const body = request.body;

    // find user by email
    const user = await findUserByEmail(body.email);

    if (!user){
        return reply.code(401).send({
            message: "Invalid Email, or Password"
        })
    }

    // verify password
    const correctPassword = verifyPassword({
        candidatePassword: body.password,
        salt: user.salt,
        hash: user.password
    })

    if(correctPassword){
        const{password, ...rest} = user;
        return {accessToken: server.jwt.sign(rest)}
    }
    return reply.code(401).send({
        message: "Invalid Email or Password"
    })
}

export async function getUsersHandler() {
    const users = await findUsers();

    return users;
}

    

