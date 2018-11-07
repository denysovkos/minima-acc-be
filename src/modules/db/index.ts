import { connect, Mongoose } from 'mongoose';

export class DataBase {
    private static dbInstance: DataBase;
    db: Mongoose;
    static getInstance() {
        if (!DataBase.dbInstance) {
            DataBase.dbInstance = new DataBase();
        }
        return DataBase.dbInstance;
    }

    private constructor() {}

    connectToBd = async () => {
        try {
            //LoalDB: 'mongodb://localhost:27017/minima_accounting'
            return this.db = await connect(`mongodb://${process.env.db_user}:${process.env.db_pass}@ds253243.mlab.com:53243/minima_accounting`, {
                useNewUrlParser: true
            });
        } catch (err) {
            throw err;
        }
    }

}
