import { setLanguage, getLanguage } from "../core/language.js";

export function createTopbar() {

    const topbar = document.createElement("header");

    topbar.className = "topbar";

    const language = getLanguage();

    topbar.innerHTML = `
        <div class="topbar-left">

            <div class="topbar-logo">

                <span class="logo-icon">◆</span>

                <span class="logo-text">
                    CITY OF <b>CODE.</b>
                    <span class="logo-de">de</span>
                </span>

                <span class="logo-code">{ }</span>

            </div>

        </div>


        <div class="topbar-right">

            <div class="language-selector">

                <button
                    class="language-button"
                    type="button">

                    ${language === "de" ? "🇩🇪 Deutsch" : "🇬🇧 English"}

                    <span>▼</span>

                </button>


                <div class="language-menu">

                    <button
                        class="language-option"
                        type="button"
                        data-language="de">

                        🇩🇪 Deutsch

                    </button>


                    <button
                        class="language-option"
                        type="button"
                        data-language="en">

                        🇬🇧 English

                    </button>

                </div>

            </div>

        </div>
    `;


    const button =
        topbar.querySelector(".language-button");

    const menu =
        topbar.querySelector(".language-menu");

    button.addEventListener("click", () => {

        menu.classList.toggle("open");

    });


    const options =
        topbar.querySelectorAll(".language-option");


    options.forEach(option => {

        option.addEventListener("click", () => {

            const language =
                option.dataset.language;

            setLanguage(language);

            menu.classList.remove("open");

            // Перезагрузить страницу
            window.location.reload();

        });

    });


    return topbar;
}