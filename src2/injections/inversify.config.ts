import { Container } from "inversify";
import "reflect-metadata";
import { Book } from "../entities";
import { ConfigService, IConfigService } from "./../ConfigService";
import TYPES from "./injections";

const CONFIG_CONTAINER = new Container();
CONFIG_CONTAINER.bind<IConfigService>(TYPES.IConfigService).to(ConfigService);

export default CONFIG_CONTAINER;
