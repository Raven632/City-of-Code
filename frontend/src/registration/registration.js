import { createMonitor } from "../components/monitor.js";

export function showRegistration(app) {

    app.innerHTML = `
        <div class="registration-page">

            <header class="topbar">
                <h1>City of Code</h1>
                <span>Registration</span>
            </header>

            <main class="registration-layout">

                <section class="registration-info">

                    <h2>Willkommen bei City of Code</h2>

                    <p>
                        Registriere dich über den Code-Editor.
                    </p>

                    <div class="registration-status">
                        Status: Nicht registriert
                    </div>

                </section>

                <section class="monitor-container"></section>

            </main>

        </div>
    `;

    const monitorContainer =
        app.querySelector(".monitor-container");

    monitorContainer.appendChild(createMonitor());
}