import { html, render } from "lit-html";

export class MainInput {
    container: HTMLElement;

    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("mi");

        render(this.template(), this.container);
    }

    template = () => {
        return html` <input type="text" />`;
    };
}
