import { createMonitor } from "../components/monitor.js";
import { createTopbar } from "../components/topbar.js";

export function showTeacher(app) {

    app.innerHTML = `
        <div class="teacher-page">

            <main class="teacher-layout">

                <section class="teacher-dashboard">

                    <div class="dashboard-header">
                        <div>
                            <h2>Teacher Dashboard</h2>
                            <p>Klassen und Schülerverwaltung</p>
                        </div>

                        <button class="create-class-button">
                            + Klasse erstellen
                        </button>
                    </div>


                    <div class="teacher-statistics">

                        <div class="stat-card">
                            <span>Klassen</span>
                            <strong>2</strong>
                        </div>

                        <div class="stat-card">
                            <span>Schüler</span>
                            <strong>39</strong>
                        </div>

                        <div class="stat-card">
                            <span>Durchschnitt</span>
                            <strong>71%</strong>
                        </div>

                    </div>


                    <section class="classes-section">

                        <div class="section-header">
                            <h3>Meine Klassen</h3>
                        </div>

                        <div class="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Klasse</th>
                                        <th>Join Code</th>
                                        <th>Schüler</th>
                                        <th>Fortschritt</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr class="class-row" data-class-id="1">
                                        <td>HBFI 12</td>
                                        <td>X7K92A</td>
                                        <td>18</td>
                                        <td>72%</td>
                                    </tr>

                                    <tr class="class-row" data-class-id="2">
                                        <td>HBFI 11</td>
                                        <td>K4P81Z</td>
                                        <td>21</td>
                                        <td>64%</td>
                                    </tr>
                                </tbody>

                            </table>

                        </div>

                    </section>


                    <section class="students-section">

                        <div class="section-header">
                            <h3>Schüler</h3>
                        </div>

                        <div class="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Klasse</th>
                                        <th>Fortschritt</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <tr>
                                        <td>Vlad</td>
                                        <td>HBFI 12</td>
                                        <td>72%</td>
                                        <td>Aktiv</td>
                                    </tr>

                                    <tr>
                                        <td>Leon</td>
                                        <td>HBFI 12</td>
                                        <td>85%</td>
                                        <td>Aktiv</td>
                                    </tr>

                                    <tr>
                                        <td>Khalil</td>
                                        <td>HBFI 12</td>
                                        <td>61%</td>
                                        <td>Aktiv</td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </section>

                </section>


                <!-- AUSFAHRBARER MONITOR -->

                <section class="monitor-drawer">

                    <button class="monitor-open">
                        ‹
                    </button>

                    <div class="monitor-panel">

                        <button class="monitor-close">
                            ×
                        </button>

                        <div class="monitor-content"></div>

                    </div>

                </section>

            </main>

        </div>
    `;

    const topbar = createTopbar("teacher");
    app.querySelector(".teacher-page").prepend(topbar);

    const rows = app.querySelectorAll(".class-row");

    rows.forEach(row => {
        row.addEventListener("click", () => {
            const classId = row.dataset.classId;

            console.log("Открываем класс:", classId);
            openClass(classId);
        });
    });

    /*
     * MONITOR
     */

    const monitorDrawer =
        app.querySelector(".monitor-drawer");

    const monitorContent =
        app.querySelector(".monitor-content");

    monitorContent.appendChild(
        createMonitor("teacher")
    );


    const openButton =
        app.querySelector(".monitor-open");

    const closeButton =
        app.querySelector(".monitor-close");


    openButton.addEventListener("click", () => {
        monitorDrawer.classList.add("open");
    });


    closeButton.addEventListener("click", () => {
        monitorDrawer.classList.remove("open");
    });


    /*
     * KLASSE ERSTELLEN
     *
     * Vorerst nur Frontend.
     * Später → API → Backend → DB
     */

    const createClassButton =
        app.querySelector(".create-class-button");


    createClassButton.addEventListener("click", () => {

        const className =
            prompt("Name der Klasse:");


        if (!className) {
            return;
        }


        console.log(
            "Create class request:",
            {
                name: className
            }
        );


        /*
         * Später:
         *
         * POST /api/classes
         *
         * Backend erstellt:
         * - Klasse
         * - join_code
         * - teacher_id
         */

        alert(
            `Klasse "${className}" wird später über die API erstellt.`
        );
    });

}