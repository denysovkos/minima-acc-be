import {userModel} from "../../modules/db/models/user";
import {invoiceModel} from "../../modules/db/models/invoice";


export class Invoices {
    private static invoicesControllerInstance: Invoices;

    static getInstance() {
        if (!Invoices.invoicesControllerInstance) {
            Invoices.invoicesControllerInstance = new Invoices();
        }

        return Invoices.invoicesControllerInstance;
    }

    getInvoices = async (request, reply) => {
        try {
            const { userId, invoiceIds } = request.body;
            if (!userId) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            const invoices = await invoiceModel.find({ _id : { $in : invoiceIds } });

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

    addInvoices = async (request, reply) => {
        try {
            const {userId, invoice} = request.body;

            if (!userId || !invoice) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            const newAct = new invoiceModel(invoice);
            const result = await newAct.save();

            await userModel.findOneAndUpdate({_id: userId}, {
                $addToSet: {
                    invoices: result._id.toString()
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

    editInvoice = async (request, reply) => {
        try {
            const {userId, invoice} = request.body;

            if (!userId || !invoice) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            await invoiceModel.findOneAndUpdate({_id: invoice._id}, invoice);
            reply.code(200).send({
                message: 'success'
            });
        } catch (err) {
            reply.code(500).send({
                message: err.message,
            });
        }
    };

    removeInvoice = async (request, reply) => {
        try {
            const {userId, invoice} = request.body;

            if (!userId || !invoice) {
                reply.code(500).send({
                    message: 'User data have to be provided',
                });

                return;
            }

            await invoiceModel.remove({ _id: invoice._id });

            await userModel.findOneAndUpdate({_id: userId}, {
                $pull: {invoices: invoice._id}
            });

            reply.code(200).send({
                message: 'success',
            });
        } catch (err) {

        }
    };
}
