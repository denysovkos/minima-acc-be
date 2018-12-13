import {companyModel} from "../../modules/db/models/company";
import {userModel} from "../../modules/db/models/user";

export class Partners {
    private static partnersControllerInstance: Partners;

    static getInstance() {
        if (!Partners.partnersControllerInstance) {
            Partners.partnersControllerInstance = new Partners();
        }
        return Partners.partnersControllerInstance;
    }

    searchPartners = async (request, reply) => {
        try {
            const {companyName = '', inn = ''} = request.body;
            if (!companyName && !inn) {
                reply.code(500).send({
                    message: 'Provide data for search',
                });

                return;
            }

            const existedCompanies = await companyModel.find({
                $or: [
                    {companyName: {$regex: companyName, $options: 'ig'}},
                    {inn: `${inn}`},
                ]
            });

            reply.code(200).send({
                existedCompanies
            });

        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    }

    saveNewPartner = async (request, reply) => {
        const {userId, company} = request.body;
        if (!userId) {
            reply.code(500).send({
                message: 'User data have to be provided',
            });

            return;
        }

        try {
            const newCompany = new companyModel(company);
            const result = await newCompany.save();

            await userModel.findOneAndUpdate({_id: userId}, {
                $addToSet: {partners: result._id.toString()}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    }

    addExistedPartner = async (request, reply) => {
        const {userId, company} = request.body;
        if (!userId) {
            reply.code(500).send({
                message: 'User data have to be provided',
            });

            return;
        }

        try {
            await userModel.findOneAndUpdate({_id: userId}, {
                $addToSet: {partners: company._id}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }

    }

    removeExistedPartner = async (request, reply) => {
        const {userId, company} = request.body;
        if (!userId) {
            reply.code(500).send({
                message: 'User data have to be provided',
            });

            return;
        }

        try {
            await userModel.findOneAndUpdate({_id: userId}, {
                $pull: {partners: company._id}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    }
}
