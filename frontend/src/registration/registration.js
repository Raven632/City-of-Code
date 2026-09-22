import { router } from "../core/router.js";
import { createTopbar } from "../components/topbar.js";
import { t } from "../core/language.js";

export function showRegistration(app) {

    app.innerHTML = `
        <div class="auth-page">

            <!-- 60% -->
            <section class="auth-art">

                <div class="auth-art-content">
                    <h1>${t("city")}</h1>
                    <p>${t("learn")}</p>
                </div>

            </section>


            <!-- 40% -->
            <section class="auth-panel">

                <div class="auth-box">

                    <div class="auth-header">
                        <h2>${t("city")}</h2>
                        <p>${t("welcome")}</p>
                    </div>


                    <!-- TABS -->

                    <div class="auth-tabs">

                        <button
                            class="auth-tab active"
                            data-tab="login">
                            ${t("login")}
                        </button>

                        <button
                            class="auth-tab"
                            data-tab="register">
                            ${t("register")}
                        </button>

                    </div>


                    <!-- LOGIN -->

                    <form class="auth-form login-form">

                        <label>
                            ${t("username")}

                            <input
                                type="text"
                                name="name"
                                placeholder="${t("username")}"
                                required>
                        </label>

                        <label>
                            ${t("password")}

                            <input
                                type="password"
                                name="password"
                                placeholder="${t("password")}"
                                required>
                        </label>

                        <button
                            type="submit"
                            class="auth-submit">
                            ${t("login")}
                        </button>

                    </form>


                    <!-- REGISTRATION -->

                    <form
                        class="auth-form register-form"
                        style="display: none;">

                        <label>
                            ${t("username")}

                            <input
                                type="text"
                                name="name"
                                placeholder="${t("username")}"
                                required>
                        </label>

                        <label>
                            ${t("password")}

                            <input
                                type="password"
                                name="password"
                                placeholder="${t("password")}"
                                required>
                        </label>

                        <label>
                            ${t("role")}

                            <select
                                name="role"
                                class="role-select">

                                <option value="student">
                                    ${t("student")}
                                </option>

                                <option value="teacher">
                                    ${t("teacher")}
                                </option>

                            </select>
                        </label>


                        <div class="class-code-field">

                            <label>
                                ${t("classCode")}

                                <input
                                    type="text"
                                    name="classCode"
                                    placeholder="z. B. HBFI12">
                            </label>

                        </div>


                        <div
                            class="access-key-field"
                            style="display: none;">

                            <label>
                                ${t("accessKey")}

                                <input
                                    type="text"
                                    name="accessKey"
                                    placeholder="${t("accessKey")}">
                            </label>

                        </div>


                        <button
                            type="submit"
                            class="auth-submit">
                            ${t("register")}
                        </button>

                    </form>


                    <div class="auth-status"></div>

                </div>

            </section>

        </div>
    `;

    const topbar = createTopbar("auth");
    app.querySelector(".auth-page").prepend(topbar);


    const tabs =
        app.querySelectorAll(".auth-tab");

    const loginForm =
        app.querySelector(".login-form");

    const registerForm =
        app.querySelector(".register-form");

    const roleSelect =
        app.querySelector(".role-select");

    const classCodeField =
        app.querySelector(".class-code-field");

    const accessKeyField =
        app.querySelector(".access-key-field");

    const status =
        app.querySelector(".auth-status");


    // =========================
    // TABS
    // =========================

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t =>
                t.classList.remove("active")
            );

            tab.classList.add("active");

            if (tab.dataset.tab === "login") {

                loginForm.style.display = "flex";
                registerForm.style.display = "none";

            } else {

                loginForm.style.display = "none";
                registerForm.style.display = "flex";

            }

            status.textContent = "";
        });
    });


    // =========================
    // ROLE
    // =========================

    roleSelect.addEventListener("change", () => {

        if (roleSelect.value === "student") {

            classCodeField.style.display = "block";
            accessKeyField.style.display = "none";

        } else {

            classCodeField.style.display = "none";
            accessKeyField.style.display = "block";

        }

    });


    // =========================
    // LOGIN
    // =========================

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        status.textContent =
            "Anmeldung erfolgreich.";

        router.show("student");
    });


    // =========================
    // REGISTRATION
    // =========================

    registerForm.addEventListener("submit", event => {

        event.preventDefault();

        const formData =
            new FormData(registerForm);

        const registration = {

            name: formData.get("name"),

            password: formData.get("password"),

            role: formData.get("role"),

            classCode:
                formData.get("classCode") || null,

            accessKey:
                formData.get("accessKey") || null

        };


        console.log(
            "Registration:",
            registration
        );


        status.textContent =
            "Registrierung erfolgreich.";


        if (registration.role === "student") {
            router.show("student");
        }

        if (registration.role === "teacher") {
            router.show("teacher");
        }
    });
}