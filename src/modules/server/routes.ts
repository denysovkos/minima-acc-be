import * as fastify from 'fastify';
import { Server } from 'http';
import {User} from "../../controllers/users";
import {Company} from "../../controllers/company";
import {Partners} from "../../controllers/partners";

export class Routes<Server> {
    private server: fastify.FastifyInstance<Server>;
    private userController = User.getInstance();
    private companyController = Company.getInstance();
    private partnersController = Partners.getInstance();

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

        // ========= USER ROUTES ========================

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

        // ========= CONPANY ROUTES ========================

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5bf56674ad7be6212e190c58"
        // },
        //     "userId": "5bf56674ad7be6212e190c58"
        // }
        this.server.post(`/v1/user/company`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.companyController.getCompany);

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5bf56674ad7be6212e190c58"
        // },
        //     "userId": "5bf56674ad7be6212e190c58",
        //     "companyName": "Roga i kopyta",
        //     "type": "PE",
        //     "inn": "12345",
        //     "address": "nowhere street",
        //     "phone": "12345",
        //     "ceo": "Kuklin",
        //     "accountant": "Kuklina"
        // }
        this.server.post(`/v1/user/company/add`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.companyController.addCompany);

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5bf56674ad7be6212e190c58"
        // },
        //     "userId": "5bf56674ad7be6212e190c58",
        //     "companyName": "Roga i kopyta",
        //     "type": "PE",
        //     "inn": "12345",
        //     "address": "nowhere street",
        //     "phone": "12345",
        //     "ceo": "Kuklin",
        //     "accountant": "Kuklina"
        // }
        this.server.post(`/v1/user/company/edit`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.companyController.editCompany);

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5bf56674ad7be6212e190c58"
        // },
        //     "userId": "5bf56674ad7be6212e190c58"
        // }
        this.server.post(`/v1/user/company/delete`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.companyController.deleteCompany);

        // ========= PARTNERS ROUTES ========================

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5bf56674ad7be6212e190c58"
        // },
        //     "userId": "5bf56674ad7be6212e190c58",
        //     "inn": "123" --> optional
        //     "companyName": "name" --> optional
        // }
        this.server.post(`/v1/user/partners/search`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.partnersController.searchPartners);


        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED:
        // {
        //     "user": {
        //          "_id": "5bf56674ad7be6212e190c58"
        //      },
        //     "company": {
        //          "userId": "5bf56674ad7be6212e190c58",
        //          "companyName": "Roga i kopyta",
        //          "type": "PE",
        //          "inn": "12345",
        //          "address": "nowhere street",
        //          "phone": "12345",
        //          "ceo": "Kuklin",
        //          "accountant": "Kuklina"
        //      },
        //      "userId": "5bf56674ad7be6212e190c58",
        // }
        this.server.post(`/v1/user/partners/add`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.partnersController.saveNewPartner);

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED:
        // {
        //     "user": {
        //          "_id": "5bf56674ad7be6212e190c58"
        //      },
        //     "company": {
        //          "_id": "777"
        //      },
        //      "userId": "5bf56674ad7be6212e190c58",
        // }
        this.server.post(`/v1/user/partners/select`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.partnersController.addExistedPartner);

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED:
        // {
        //     "user": {
        //          "_id": "5bf56674ad7be6212e190c58"
        //      },
        //     "company": {
        //          "_id": "777"
        //      },
        //      "userId": "5bf56674ad7be6212e190c58",
        // }
        this.server.post(`/v1/user/partners/remove`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.partnersController.removeExistedPartner);
    }
}
