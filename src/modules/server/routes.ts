import * as fastify from 'fastify';
import {User} from "../../controllers/users";
import {Company} from "../../controllers/company";
import {Partners} from "../../controllers/partners";
import {Agreements} from "../../controllers/agreements";

export class Routes<Server> {
    private server: fastify.FastifyInstance<Server>;
    private userController = User.getInstance();
    private companyController = Company.getInstance();
    private partnersController = Partners.getInstance();
    private agreementsController = Agreements.getInstance();

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

        // ========= AGREEMENTS ROUTES ========================

        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5bf56674ad7be6212e190c58"
        // },
        //     "agreementIds": ["5bf56674ad7be6212e190c58"], --> array of agreements ids from USER
        // }
        this.server.post(`/v1/user/agreements/get`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.agreementsController.getAgreements);

        // ADD NEW AGREEMENT
        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5c1274f7dc282a17bd911750"
        // },
        //     "userId": "5c1274f7dc282a17bd911750",
        //     "agreement": {
        //     "partner": {
        //             "companyName": "Якась назва",
        //             "type": "PE",
        //             "inn": "777",
        //             "address": "ул. Семьи Сосниных 12, кв. 21",
        //             "phone": "0673273071",
        //             "ceo": "Константин",
        //             "accountant": "Константин",
        //             "__v": 0
        //     },
        //     "number": "1-2-3",
        //         "date": "2016-05-18T16:00:00Z",
        //         "name": "Main agreement",
        //         "type": "services",
        //         "shortDescription": "some text"
        // }
        // }
        this.server.post(`/v1/user/agreements/add`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.agreementsController.addAgreement);

        // EDIT AGREEMENT
        // ADD NEW AGREEMENT
        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5c1274f7dc282a17bd911750"
        // },
        //     "userId": "5c1274f7dc282a17bd911750",
        //     "agreement": {
        //     "_id": "5c20dd9859f130d91b6cd356",
        //     "partner": {
        //             "companyName": "Якась назва",
        //             "type": "PE",
        //             "inn": "777",
        //             "address": "ул. Семьи Сосниных 12, кв. 21",
        //             "phone": "0673273071",
        //             "ceo": "Константин",
        //             "accountant": "Константин",
        //             "__v": 0
        //     },
        //     "number": "1-2-3",
        //         "date": "2016-05-18T16:00:00Z",
        //         "name": "Main agreement",
        //         "type": "services",
        //         "shortDescription": "some text"
        // }
        // }
        this.server.post(`/v1/user/agreements/edit`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.agreementsController.editAgreement);

        // DELETE AGREEMENT
        //EXAMPLE OF BODY
        // TOKEN IS REQUIRED
        // {
        //     "user": {
        //     "_id": "5c1274f7dc282a17bd911750"
        // },
        //     "userId": "5c1274f7dc282a17bd911750",
        //     "agreement": {
        //     "_id": "5c20dd9859f130d91b6cd356",
        // }
        // }
        this.server.post(`/v1/user/agreements/remove`, {
            beforeHandler: [this.userController.tokenVerificationHook]
        }, this.agreementsController.removeAgreement);
    }
}
