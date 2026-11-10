import { createTopbar } from "../components/topbar.js";
import { t } from "../core/language.js";
import { router } from "../core/router.js";

export function showStart(app) {

    app.innerHTML = `

        <div class="start-page">

            <!-- HERO -->
            <section class="start-section start-hero">

                <div class="start-hero-content">

                    <h1>${t("startTitle")}</h1>

                    <h2>${t("startSubtitle")}</h2>

                    <p class="start-description">
                        ${t("startDescription")}
                    </p>

                    <img
                        class="start-city-image"
                        src="/assets/start/city.png"
                        alt="City of Code"
                    >

                </div>

            </section>


            <!-- HOW IT WORKS -->
            <section
                class="start-section how-section"
                id="how-it-works"
            >

                <div class="start-card">

                    <h2>${t("howItWorks")}</h2>

                    <p class="section-description">
                        ${t("howItWorksDescription")}
                    </p>

                    <div class="steps">

                        <div class="step">
                            <span class="step-number">1</span>
                            <span class="step-icon">📖</span>
                            <strong>${t("stepUnderstand")}</strong>
                        </div>

                        <div class="step">
                            <span class="step-number">2</span>
                            <span class="step-icon">💻</span>
                            <strong>${t("stepCode")}</strong>
                        </div>

                        <div class="step">
                            <span class="step-number">3</span>
                            <span class="step-icon">⭐</span>
                            <strong>${t("stepUnlock")}</strong>
                        </div>

                        <div class="step">
                            <span class="step-number">4</span>
                            <span class="step-icon">🏙️</span>
                            <strong>${t("stepBuild")}</strong>
                        </div>

                    </div>

                    <p class="start-slogan">
                        ${t("startSlogan")}
                    </p>

                </div>

            </section>


            <!-- WHAT YOU LEARN -->
            <section class="start-section learn-section">

                <div class="start-card learn-card">

                    <h2>${t("whatYouLearn")}</h2>

                    <p class="section-description">
                        ${t("whatYouLearnSubtitle")}
                    </p>

                    <div class="topics">

                        <span>${t("variables")}</span>
                        <span>${t("input")}</span>
                        <span>${t("conditions")}</span>
                        <span>${t("loops")}</span>
                        <span>${t("return")}</span>
                        <span>${t("functions")}</span>
                        <span>${t("lists")}</span>
                        <span>${t("dictionaries")}</span>

                    </div>

                    <div class="learning-blocks">

                        <div class="learning-block">
                            <div class="learning-icon">🐍</div>

                            <h3>${t("pythonBasics")}</h3>

                            <p>
                                ${t("pythonBasicsDescription")}
                            </p>
                        </div>


                        <div class="learning-block">
                            <div class="learning-icon">🔄</div>

                            <h3>${t("logicLoops")}</h3>

                            <p>
                                ${t("logicLoopsDescription")}
                            </p>
                        </div>


                        <div class="learning-block">
                            <div class="learning-icon">🏙️</div>

                            <h3>${t("buildCity")}</h3>

                            <p>
                                ${t("buildCityDescription")}
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            <!-- REGISTRATION -->
            <section class="start-section registration-transition">

                <div class="start-card registration-card">

                    <h2>${t("readyTitle")}</h2>

                    <p class="section-description">
                        ${t("readyDescription")}
                    </p>

                    <div class="registration-hint">
                        ${t("registrationHint")}
                    </div>

                </div>

            </section>

        </div>
    `;
    const topbar = createTopbar("auth");
    app.appendChild(topbar);

    const startButton = app.querySelector(".start-button");
    const howSection = app.querySelector("#how-it-works");
}


function setupStartInteraction(app) {

    const sections = [
        ...app.querySelectorAll(".start-section")
    ];

    let currentSection = 0;

    function goNext() {

        if (currentSection < sections.length - 1) {

            currentSection++;

            sections[currentSection].scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }

        router.show("registration");
    }

    function handleKey(event) {

        if (event.target.closest(".topbar")) {
            return;
        }

        goNext();
    }

    function handleClick(event) {

        if (event.target.closest(".topbar")) {
            return;
        }

        goNext();
    }

    app.addEventListener("keydown", handleKey);
    app.addEventListener("click", handleClick);
}