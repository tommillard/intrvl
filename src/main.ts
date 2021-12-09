const appNode: HTMLDivElement = document.querySelector<HTMLDivElement>("#app")!;

import { html, render } from "lit-html";
import { MainInput } from "./mainInput/mainInput";

export interface IWorkout {
    title: string;
}

export class App {
    data: IWorkout;
    container: HTMLElement;
    expanded: boolean = false;

    mainInput: MainInput;

    constructor() {
        this.container = appNode;
        this.container.classList.add("app");
        this.mainInput = new MainInput();
        this.data = {
            title: "hey",
        };

        render(this.template(this.data), this.container);
    }

    template = (data: IWorkout) => {
        return html` <div class="owner">${this.mainInput.container}</div> `;
    };
}
