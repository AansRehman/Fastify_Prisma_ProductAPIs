import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod';
import { access } from 'fs';

const userCore = {
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: "Email must be a String"
    }).email(),
    name: z.string(),
};

const createUserSchema = z.object({
    ...userCore,    
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: "Password must be a String"
    }),
});

const createUserResponseSchema = z.object({
    id: z.number(),
    ...userCore
})

const loginResponseSchema = z.object({
    accessToken: z.string(),
})

const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: "Email must be a String"
    }).email(),
    password: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const {schemas: userSchmeas, $ref} = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
});