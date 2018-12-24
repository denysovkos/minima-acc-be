import {agreementModel} from "../../modules/db/models/agreement";
import {userModel} from "../../modules/db/models/user";


export class Agreements {
    private static agreementsControllerInstance: Agreements;

    static getInstance() {
        if (!Agreements.agreementsControllerInstance) {
            Agreements.agreementsControllerInstance = new Agreements();
        }
        return Agreements.agreementsControllerInstance;
    }

    getAgreements = async (request, reply) => {
        try {
            const { userId, agreementIds } = request.body;
            if (!userId) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            const agreements = await agreementModel.find({ _id : { $in : agreementIds } });

            reply.code(200).send({
                message: 'success',
                agreements,
            });


        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    addAgreement = async (request, reply) => {
        try {
            const {userId, agreement} = request.body;

            if (!userId || !agreement) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            const newAgreement = new agreementModel(agreement);
            const result = await newAgreement.save();

            await userModel.findOneAndUpdate({_id: userId}, {
                $addToSet: {agreements: result._id.toString()}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    editAgreement = async (request, reply) => {
        try {
            const {userId, agreement} = request.body;

            if (!userId || !agreement) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            await agreementModel.findOneAndUpdate({_id: agreement._id}, agreement);
            reply.code(200).send({
                message: 'success'
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    removeAgreement = async (request, reply) => {
        try {
            const {userId, agreement} = request.body;

            if (!userId || !agreement) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            await agreementModel.remove({ _id: agreement._id });

            await userModel.findOneAndUpdate({_id: userId}, {
                $pull: {agreements: agreement._id}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {

        }
    };
}
