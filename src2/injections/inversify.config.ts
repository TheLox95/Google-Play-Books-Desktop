import { Container } from "inversify";
import "reflect-metadata";
import {
    BookService, ConfigService,
    ConnectivityService, FileService,
    IBookService, IConfigService,
    IConnectivityService, IFileService,
    ILoginService, IServer,
    LoginService, Server as LocalServer,
} from "../services";
import { Http, IHttp } from "../utils/Http";
import { ILogger, Logger } from "../utils/Logger";
import TYPES from "./injections";

const CONFIG_CONTAINER = new Container();
CONFIG_CONTAINER.bind<IHttp>(TYPES.IHttp).to(Http);
CONFIG_CONTAINER.bind<IConfigService>(TYPES.IConfigService).to(ConfigService);
CONFIG_CONTAINER.bind<IFileService>(TYPES.IFileService).to(FileService);
CONFIG_CONTAINER.bind<ILogger>(TYPES.ILogger).to(Logger);
CONFIG_CONTAINER.bind<IServer>(TYPES.IServer).to(LocalServer);
CONFIG_CONTAINER.bind<IBookService>(TYPES.IBookService).to(BookService);
CONFIG_CONTAINER.bind<ILoginService>(TYPES.ILoginService).to(LoginService);
CONFIG_CONTAINER.bind<IConnectivityService>(TYPES.IConnectivityService).to(ConnectivityService);
CONFIG_CONTAINER.bind<(label: string) => ILogger>(TYPES.ILoggerFactory).toFactory<ILogger>((context) => {
    return (label: string) => {
        const loggerClass = context.container.get<ILogger>(TYPES.ILogger);
        loggerClass.label = label;
        return loggerClass;
    };
});

type ILoggerFactory = (label: string) => ILogger;

export {
    CONFIG_CONTAINER,
    ILoggerFactory,
};
