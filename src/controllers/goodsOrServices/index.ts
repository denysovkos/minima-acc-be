import {userModel} from "../../modules/db/models/user";
import {goodsOrServicesModel} from "../../modules/db/models/goodsOrServices";


export class GoodsOrServices {
    private static goodsOrServicesControllerInstance: GoodsOrServices;

    static getInstance() {
        if (!GoodsOrServices.goodsOrServicesControllerInstance) {
            GoodsOrServices.goodsOrServicesControllerInstance = new GoodsOrServices();
        }

        return GoodsOrServices.goodsOrServicesControllerInstance;
    }

    getGoodsOrServices = async (request, reply) => {
        try {
            const { userId, goodOrServiceIds } = request.body;
            if (!userId) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            const invoices = await goodsOrServicesModel.find({ _id : { $in : goodOrServiceIds } });

            reply.code(200).send({
                message: 'success',
                invoices,
            });


        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    addGoodsOrServices = async (request, reply) => {
        try {
            const {userId, goodOrService} = request.body;

            if (!userId || !goodOrService) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            if (goodOrService.type !== 'goods' || goodOrService.type !== 'services') {
                reply.code(500).send({
                    message: 'goodOrService type can be goods or services',
                });

                return;
            }

            if (goodOrService.type === 'services') {
                goodOrService.qtty = 0;
            }

            const newGoodOrService = new goodsOrServicesModel(goodOrService);
            const result = await newGoodOrService.save();

            await userModel.findOneAndUpdate({_id: userId}, {
                $addToSet: {
                    goodsOrServices: result._id.toString()
                }
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

    editGoodOrService = async (request, reply) => {
        try {
            const {userId, goodOrService} = request.body;

            if (!userId || !goodOrService) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            if (goodOrService.type !== 'goods' || goodOrService.type !== 'services') {
                reply.code(500).send({
                    message: 'goodOrService type can be goods or services',
                });

                return;
            }

            await goodsOrServicesModel.findOneAndUpdate({_id: goodOrService._id}, goodOrService);
            reply.code(200).send({
                message: 'success'
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    removeGoodOrService = async (request, reply) => {
        try {
            const {userId, goodOrService} = request.body;

            if (!userId || !goodOrService) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            await goodsOrServicesModel.remove({ _id: goodOrService._id });

            await userModel.findOneAndUpdate({_id: userId}, {
                $pull: {goodsOrServices: goodOrService._id}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {

        }
    };
}
