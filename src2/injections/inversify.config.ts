import { Container } from "inversify";
import "reflect-metadata";
import { Book } from "../entities";
import { ConfigService, IConfigService } from "../services/ConfigService";
import { FileService, IFileService } from "./../services/FileService";
import TYPES from "./injections";

const CONFIG_CONTAINER = new Container();
CONFIG_CONTAINER.bind<IConfigService>(TYPES.IConfigService).to(ConfigService);
CONFIG_CONTAINER.bind<IFileService>(TYPES.IFileService).to(FileService);

export default CONFIG_CONTAINER;
