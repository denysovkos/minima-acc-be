import {AppServer} from "./modules/server";

class App {
    static run = () => {
        AppServer.getInstance().startServer();
    }
}

App.run();
