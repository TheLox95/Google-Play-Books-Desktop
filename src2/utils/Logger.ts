import { injectable } from "inversify";
import * as Winston from "winston";

const myFormat = Winston.format.printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

export interface ILogger {
  label: string;
  log(level: string, msg: string | {}, label?: string);
}

@injectable()
export class Logger implements ILogger {

  private _logger;
  private _label;

  set label(label: string) {
    this._label = label;
    this._makeLogger();
  }

  public log(level = `info`, msg: string | {} | Error) {
    this._logger.log(level, msg);
  }

  private _makeLogger() {
    this._logger = this._logger || Winston.createLogger({
      format: Winston.format.combine(
        Winston.format.label({ label: this._label }),
        Winston.format.colorize(),
        Winston.format.simple(),
        Winston.format.timestamp(),
        myFormat,
      ),
      transports: [new Winston.transports.Console()],
    });
  }

}
