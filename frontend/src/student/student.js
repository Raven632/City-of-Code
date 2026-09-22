import { createMonitor } from "../components/monitor.js";
import { createTopbar } from "../components/topbar.js";

export function showStudent(app) {

    app.innerHTML = `
        <div class="student-page">

            <main class="student-layout">

                <!-- CITY -->
                <section class="city-container">

                    <div class="city-header">
                        <h2>Meine Stadt</h2>
                        <span>Level 1</span>
                    </div>

                    <div class="city-map">

                        <div class="city-placeholder">
                            <h2>City of Code</h2>
                            <p>Hier wird später die Phaser-Stadt geladen.</p>
                        </div>

                    </div>

                </section>

                <!-- COMPUTER -->
                <section class="monitor-container"></section>

            </main>

        </div>
    `;

    const topbar = createTopbar("student");
    app.querySelector(".student-page").prepend(topbar);

    const monitorContainer =
        app.querySelector(".monitor-container");

    monitorContainer.appendChild(
        createMonitor()
    );
}