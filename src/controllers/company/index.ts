import {CompanyInterface} from "../../modules/db/interfaces/company";
import {companyModel} from "../../modules/db/models/company";

export class Company {
    private static companyControllerInstance: Company;

    static getInstance() {
        if (!Company.companyControllerInstance) {
            Company.companyControllerInstance = new Company();
        }
        return Company.companyControllerInstance;
    }

    private constructor() {}

    getCompany = async (request, reply) => {
        const { userId } = request.body;
        const company = await companyModel.find({userId});

        reply.code(200).send(company);
    };

    addCompany = async (request, reply) => {
        let result;
        const company: CompanyInterface = request.body;

        const newCompany = new companyModel(company);
        try {
            result = await newCompany.save();
            reply.code(200).send(result);
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    editCompany = async (request, reply) => {
        const company = request.body;
        delete company.user;
        const updatedCompany = await companyModel.findOneAndUpdate({inn: company.inn}, company);

        reply.code(200).send({
            company: updatedCompany
        });
    };

    deleteCompany = async (request, reply) => {
        const { inn, userId } = request.body;
        const result = await companyModel.remove({
            inn,
            userId,
        });

        reply.code(200).send({
            result
        });
    };
}
