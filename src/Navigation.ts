import * as $ from 'jquery';
import { compile } from 'handlebars';


export class Navigation {

    constructor(private _contentId: string) {}

    loadView(viewName: string, properties?: {}) {
        return new Promise((resolve, rejected) => {
            const container = $(`#${this._contentId}`)
            
            container.load(`${viewName}.view.html`, () => {
                const theTemplateScript = $(`#${viewName.replace(`-`, ``)}`).html();
                const template = compile(theTemplateScript);
                const theCompiledHtml = template(properties);
                container.html(theCompiledHtml);

                resolve(container.children('div'));
            });
        });

    }
}