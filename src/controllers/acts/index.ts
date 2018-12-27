import {userModel} from "../../modules/db/models/user";
import {actModel} from "../../modules/db/models/act";


export class Acts {
    private static actsControllerInstance: Acts;

    static getInstance() {
        if (!Acts.actsControllerInstance) {
            Acts.actsControllerInstance = new Acts();
        }

        return Acts.actsControllerInstance;
    }

    getActs = async (request, reply) => {
        try {
            const { userId, actIds } = request.body;
            if (!userId) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            const acts = await actModel.find({ _id : { $in : actIds } });

            reply.code(200).send({
                message: 'success',
                acts,
            });


        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    addActs = async (request, reply) => {
        try {
            const {userId, act} = request.body;

            if (!userId || !act) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            const newAct = new actModel(act);
            const result = await newAct.save();

            await userModel.findOneAndUpdate({_id: userId}, {
                $addToSet: {acts: result._id.toString()}
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

    editAct = async (request, reply) => {
        try {
            const {userId, act} = request.body;

            if (!userId || !act) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            await actModel.findOneAndUpdate({_id: act._id}, act);
            reply.code(200).send({
                message: 'success'
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    removeAct = async (request, reply) => {
        try {
            const {userId, act} = request.body;

            if (!userId || !act) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            await actModel.remove({ _id: act._id });

            await userModel.findOneAndUpdate({_id: userId}, {
                $pull: {acts: act._id}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {

        }
    };
}
