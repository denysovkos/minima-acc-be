import {userModel} from "../../modules/db/models/user";
import {warehouseModel} from "../../modules/db/models/warehouse";


export class Warehouse {
    static addGoodOrService = async (userId: string, goodOrServiceId: string, productType: string, qtty?: number): Promise<void> => {
        if (productType === 'service' && !qtty) {
            throw new Error('Products should have quantity');
        }
    };

    static removeGoodOrService = async (userId: string, goodOrServiceId: string, productType: string, qtty?: number): Promise<void> => {

    };

    static getQuantityOfGoods = async (): Promise<number> => {
        return 0;
    };
}
