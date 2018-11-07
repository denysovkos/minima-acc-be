import * as fastify from 'fastify';
import { Server } from 'http';
import {User} from "../../controllers/users";

export class Routes<Server> {
    private server: fastify.FastifyInstance<Server>;
    private userController = User.getInstance();

    constructor(server) {
        this.server = server;
    }

    getRoutes() {
        this.server.get(`/status`, {}, (request, reply) => {
            reply.code(200).send({
                status: 'UP!',
                version: process.env.appName
            });
        });

        //create user: post UserInterface Object via Body
        this.server.post(`/v1/user/create`, {}, this.userController.saveUser);
        //validating user via token
        this.server.get(`/v1/user/validate/:token`, {}, this.userController.validateUser);
        //auth user: post email and password
        this.server.post(`/v1/user/login`, {}, this.userController.authUser);

        //SECURE ROUTES
        //pass token from /user/login via headers x-access-token
        //pass in body updated user object. _id field is could not be change!
        //Token verification over beforeHandler: [this.userController.tokenVerificationHook]
        this.server.post(`/v1/user/update`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.userController.updateUser);
    }
}
