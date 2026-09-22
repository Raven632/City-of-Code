import { createMonitor } from "../components/monitor.js";
import { createTopbar } from "../components/topbar.js";

export function showAdmin(app) {

    app.innerHTML = `
        <div class="admin-page">

            <main class="admin-layout">

                <section class="admin-dashboard">

                    <div class="dashboard-header">

                        <div>
                            <h2>Admin Dashboard</h2>
                            <p>System- und Accountverwaltung</p>
                        </div>

                    </div>


                    <!-- STATISTIKEN -->

                    <div class="admin-statistics">

                        <div class="stat-card">
                            <span>Accounts</span>
                            <strong>0</strong>
                        </div>

                        <div class="stat-card">
                            <span>Teacher</span>
                            <strong>0</strong>
                        </div>

                        <div class="stat-card">
                            <span>Student</span>
                            <strong>0</strong>
                        </div>

                        <div class="stat-card">
                            <span>Klassen</span>
                            <strong>0</strong>
                        </div>

                    </div>


                    <!-- ACCOUNTS -->

                    <section class="accounts-section">

                        <div class="section-header">

                            <div>
                                <h3>Accounts</h3>
                                <p>Benutzer aus der Datenbank</p>
                            </div>

                            <button class="refresh-accounts">
                                Aktualisieren
                            </button>

                        </div>


                        <div class="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Rolle</th>
                                        <th>Klasse</th>
                                        <th>Aktion</th>
                                    </tr>
                                </thead>

                                <tbody class="accounts-table">
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

    const topbar = createTopbar("admin");
    app.querySelector(".admin-page").prepend(topbar);

    /*
     * MONITOR
     */

    const monitorDrawer =
        app.querySelector(".monitor-drawer");

    const monitorContent =
        app.querySelector(".monitor-content");

    monitorContent.appendChild(
        createMonitor("admin")
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
     * ACCOUNTS
     */

    const accountsTable =
        app.querySelector(".accounts-table");

    /*
     * TEMPORÄRE DATEN
     *
     * Später:
     * API → Backend → DB
     */

    const accounts = [
        {
            id: 1,
            name: "Vlad",
            role: "admin",
            className: "-"
        },
        {
            id: 2,
            name: "Leon",
            role: "admin",
            className: "-"
        },
        {
            id: 3,
            name: "Khalil",
            role: "admin",
            className: "-"
        },
        {
            id: 4,
            name: "Knobl",
            role: "teacher",
            className: "-"
        }
    ];

    function renderAccounts() {
        accountsTable.innerHTML = "";
        accounts.forEach(account => {
            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${account.id}</td>

                <td>${account.name}</td>

                <td>${account.role}</td>

                <td>${account.className}</td>

                <td>
                    <button
                        class="delete-account"
                        data-id="${account.id}">
                        Löschen
                    </button>
                </td>
            `;
            accountsTable.appendChild(row);
        });

        updateStatistics();
    }

    function updateStatistics() {
        const total =
            accounts.length;
        const teachers =
            accounts.filter(
                account => account.role === "teacher"
            ).length;
        const students =
            accounts.filter(
                account => account.role === "student"
            ).length;

        app.querySelector(
            ".stat-card:nth-child(1) strong"
        ).textContent = total;

        app.querySelector(
            ".stat-card:nth-child(2) strong"
        ).textContent = teachers;

        app.querySelector(
            ".stat-card:nth-child(3) strong"
        ).textContent = students;

        // Klassen später über API
    }

    /*
     * ACCOUNT LÖSCHEN
     */

    accountsTable.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".delete-account"
                );

            if (!button) {
                return;
            }

            const id =
                Number(button.dataset.id);

            const account =
                accounts.find(
                    account => account.id === id
                );

            if (!account) {
                return;
            }

            const confirmed =
                confirm(
                    `Account "${account.name}" wirklich löschen?`
                );

            if (!confirmed) {
                return;
            }

            /*
             * TEMPORÄR LOKAL
             *
             * Später:
             * DELETE → API → Backend → DB
             */

            const index =
                accounts.findIndex(
                    account => account.id === id
                );

            accounts.splice(index, 1);
            renderAccounts();
        }
    );

    /*
     * AKTUALISIEREN
     */

    app.querySelector(
        ".refresh-accounts"
    ).addEventListener(
        "click",
        () => {

            /*
             * Später:
             *
             * GET /api/admin/accounts
             *
             * accounts = response.data
             */

            renderAccounts();
        }
    );

    renderAccounts();
}