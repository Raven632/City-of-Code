
import { createTopbar } from "../components/topbar.js";
import { createMonitor } from "../components/monitor.js";
import { t } from "../core/language.js";
import { teacherApi } from "./teacherApi.js";

export function showTeacher() {
    const page = document.createElement("div");
    page.className = "teacher-page";

    page.innerHTML = `
        <div class="teacher-shell">
            <aside class="teacher-sidebar">
                <div class="teacher-sidebar-title">City of Code</div>

                <nav class="teacher-nav">
                    <button class="teacher-nav-item active" data-page="home">
                        <span>▦</span> ${t("dashboard")}
                    </button>
                    <button class="teacher-nav-item" data-page="classes">
                        <span>▤</span> ${t("myClasses")}
                    </button>
                    <button class="teacher-nav-item" data-page="students">
                        <span>♙</span> ${t("students")}
                    </button>
                </nav>

                <button class="teacher-terminal-button" id="open-terminal">
                    ▷ ${t("terminal")}
                </button>
            </aside>

            <main class="teacher-content">
                <div id="teacher-view"></div>
            </main>
        </div>

        <div class="monitor-drawer" id="teacher-monitor">
            <div class="monitor-panel">
                <button class="monitor-close" id="close-terminal">×</button>
                <div id="teacher-monitor-mount"></div>
            </div>
        </div>

        <dialog class="teacher-modal" id="create-class-dialog">
            <form id="create-class-form">
                <h2>${t("createNewClass")}</h2>
                <label for="class-name">${t("className")}</label>
                <input
                    id="class-name"
                    name="name"
                    type="text"
                    maxlength="80"
                    required
                />
                <div class="teacher-modal-actions">
                    <button type="button" id="cancel-create">
                        ${t("cancel")}
                    </button>
                    <button type="submit">${t("createClass")}</button>
                </div>
            </form>
        </dialog>
    `;

    document.querySelector("#app").replaceChildren(page);
    page.prepend(createTopbar("teacher"));

    const view = page.querySelector("#teacher-view");
    const dialog = page.querySelector("#create-class-dialog");
    const monitor = page.querySelector("#teacher-monitor");

    let isMonitorOpen = false;
    let isCreateModalOpen = false;
    let classes = [];
    let students = [];
    let selectedPage = "home";
    let selectedClassId = null;
    let loading = false;

    page.querySelector("#teacher-monitor-mount")
        .appendChild(createMonitor());

    page.querySelector("#open-terminal").addEventListener("click", () => {
        monitor.classList.add("open");
    });

    page.querySelector("#close-terminal").addEventListener("click", () => {
        monitor.classList.remove("open");
    });

    page.querySelectorAll("[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            selectedPage = button.dataset.page;
            selectedClassId = null;

            page.querySelectorAll("[data-page]").forEach(item => {
                item.classList.toggle("active", item === button);
            });

            renderPage();
        });
    });

    page.querySelector("#cancel-create").addEventListener("click", () => {
        dialog.close();
    });

    page.querySelector("#create-class-form").addEventListener("submit", async event => {
        event.preventDefault();

        const form = event.currentTarget;
        const submitButton = form.querySelector('[type="submit"]');
        const name = new FormData(form).get("name")?.toString().trim();

        if (!name) return;

        submitButton.disabled = true;

        try {
            await teacherApi.createClass(name);
            dialog.close();
            form.reset();

            await loadClasses();
            selectedPage = "classes";
            renderPage();
        } catch (error) {
            showError(error);
        } finally {
            submitButton.disabled = false;
        }
    });

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function showError(error) {
        console.error("Teacher dashboard:", error);
        const message = error?.message || t("requestFailed");
        let notice = page.querySelector(".teacher-error");

        if (!notice) {
            notice = document.createElement("p");
            notice.className = "teacher-error";
            view.prepend(notice);
        }

        notice.textContent = message;
    }

    function pageHeader(title, description = "") {
        return `
            <header class="teacher-heading">
                <div>
                    <h1>${title}</h1>
                    ${description
                        ? `<p>${description}</p>`
                        : ""}
                </div>
            </header>
        `;
    }

    function renderHome() {
        return `
            ${pageHeader(
                t("teacherDashboard"),
                t("classOverviewDescription")
            )}

            <section class="teacher-stats">
                <article class="teacher-card">
                    <span>${t("activeClasses")}</span>
                    <strong>${classes.length}</strong>
                </article>

                <article class="teacher-card">
                    <span>${t("students")}</span>
                    <strong>${students.length}</strong>
                </article>

                <article class="teacher-card">
                    <span>${t("averageProgress")}</span>
                    <strong>—</strong>
                </article>
            </section>

            <section class="teacher-section">
                <div class="teacher-section-heading">
                    <h2>${t("myClasses")}</h2>
                    <button class="teacher-primary-button"
                        data-action="open-create">
                        + ${t("createClass")}
                    </button>
                </div>

                <div id="home-classes"></div>
            </section>
        `;
    }

    function renderClasses() {
        return `
            ${pageHeader(t("myClasses"))}

            <section class="teacher-section">
                <div class="teacher-section-heading">
                    <h2>${t("classOverview")}</h2>
                    <button class="teacher-primary-button"
                        data-action="open-create">
                        + ${t("createClass")}
                    </button>
                </div>

                <div id="classes-list"></div>
            </section>
        `;
    }

    function renderStudents() {
        return `
            ${pageHeader(t("students"))}

            <section class="teacher-section">
                <div class="teacher-section-heading">
                    <h2>${t("students")}</h2>

                    <select id="student-class-filter">
                        <option value="">${t("myClasses")}</option>
                        ${classes.map(item => `
                            <option value="${escapeHTML(item.id)}">
                                ${escapeHTML(item.name)}
                            </option>
                        `).join("")}
                    </select>

                    <button id="open-remove-students" class="danger-button">
                        ${t("removeStudents")}
                    </button>
                </div>

                <div id="students-list"></div>
            </section>

            <dialog id="remove-students-dialog" class="teacher-modal">
                <div class="remove-students-header">
                    <h2>${t("removeStudents")}</h2>
                    <button id="close-remove-students" aria-label="${t("close")}">
                        ✕
                    </button>
                </div>

                <div id="remove-students-list"></div>
            </dialog>
        `;
    }

    function renderRemoveStudentsList() {
        const list = view.querySelector("#remove-students-list");

        if (!list) return;

        if (!students.length) {
            list.innerHTML = `<p>${t("noStudents")}</p>`;
            return;
        }

        list.innerHTML = students.map(student => `
            <div class="remove-student-row">
                <span>${escapeHTML(student.name)}</span>

                <button
                    class="remove-student-button"
                    data-remove-student="${escapeHTML(student.id)}"
                    aria-label="${t("remove")} ${escapeHTML(student.name)}"
                    title="${t("remove")}"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"
                            fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `).join("");
    }

    function renderPage() {
        view.innerHTML = "";

        if (loading) {
            view.textContent = "…";
            return;
        }

        if (selectedPage === "home") {
            view.innerHTML = renderHome();
            renderClassCards("#home-classes", 3);
        } else if (selectedPage === "classes") {
            view.innerHTML = renderClasses();
            renderClassCards("#classes-list");
        } else if (selectedPage === "students") {
            view.innerHTML = renderStudents();
            renderStudentList();
        }

        view.querySelectorAll('[data-action="open-create"]').forEach(button => {
            button.addEventListener("click", () => dialog.showModal());
        });

        const filter = view.querySelector("#student-class-filter");
        
        const removeDialog = view.querySelector("#remove-students-dialog");

    view.querySelector("#open-remove-students")?.addEventListener("click", () => {
        renderRemoveStudentsList();
        removeDialog?.showModal();
    });

    view.querySelector("#close-remove-students")?.addEventListener("click", () => {
        removeDialog?.close();
    });

    view.querySelector("#remove-students-list")?.addEventListener("click", async event => {
        const button = event.target.closest("[data-remove-student]");
        if (!button) return;

        const studentId = button.dataset.removeStudent;
        const student = students.find(item => String(item.id) === studentId);

        if (!student) return;

        if (!confirm(`${t("remove")} ${student.name}?`)) return;

        // Здесь нужен запрос к backend для удаления ученика.
        await teacherApi.removeStudent(studentId);

        students = students.filter(item => String(item.id) !== studentId);

        renderStudentList();
        renderRemoveStudentsList();
        });

        function renderClassCards(selector, limit = Infinity) {
            const container = view.querySelector(selector);
            if (!container) return;

            if (!classes.length) {
                container.innerHTML = `<p>${t("noClasses")}</p>`;
                return;
            }

            container.innerHTML = classes.slice(0, limit).map(item => `
                <article class="teacher-card teacher-class-card">
                    <h3>${escapeHTML(item.name)}</h3>
                    <p>${t("classCode")}: ${escapeHTML(item.join_code || "—")}</p>
                    <button class="teacher-secondary-button"
                        data-class-id="${escapeHTML(item.id)}">
                        ${t("manageClass")}
                    </button>
                </article>
            `).join("");

            container.querySelectorAll("[data-class-id]").forEach(button => {
                button.addEventListener("click", () => {
                    selectedClassId = button.dataset.classId;
                    selectedPage = "students";

                    page.querySelectorAll("[data-page]").forEach(item => {
                        item.classList.toggle(
                            "active",
                            item.dataset.page === "students"
                        );
                    });

                    renderPage();

                    const filter = view.querySelector("#student-class-filter");
                    if (filter) {
                        filter.value = selectedClassId;
                        filter.dispatchEvent(new Event("change"));
                    }
                });
            });
        }

        if (filter) {
            filter.addEventListener("change", async () => {
                selectedClassId = filter.value || null;
                await loadStudents(selectedClassId);
                renderStudentList();
            });
        }
    }

    function renderStudentList() {
        const container = view.querySelector("#students-list");
        if (!container) return;

        if (!students.length) {
            container.innerHTML = `<p>${t("noStudents")}</p>`;
            return;
        }

        container.innerHTML = `
            <div class="teacher-table-wrapper">
                <table class="teacher-table">
                    <thead>
                        <tr>
                            <th>${t("student")}</th>
                            <th>${t("progress")}</th>
                            <th>${t("activities")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(student => `
                            <tr>
                                <td>${escapeHTML(student.name)}</td>
                                <td>${student.progress == null
                                    ? "—"
                                    : `${escapeHTML(student.progress)}%`}</td>
                                <td>
                                    <button class="teacher-secondary-button"
                                        data-student-id="${escapeHTML(student.id)}">
                                        ${t("activities")}
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll("[data-student-id]").forEach(button => {
            button.addEventListener("click", () => {
                // Подключить просмотр прогресса и логов после согласования API.
                console.info("Selected student:", button.dataset.studentId);
            });
        });
    }

    async function loadClasses() {
        classes = await teacherApi.getClasses();
        classes = Array.isArray(classes) ? classes : [];
    }

    async function loadStudents(classId = null) {
        if (!classId && classes.length === 1) {
            classId = classes[0].id;
        }

        if (!classId) {
            students = [];
            return;
        }

        students = await teacherApi.getStudents(classId);
        students = Array.isArray(students) ? students : [];
    }

    async function refresh() {
        loading = true;
        renderPage();

        try {
            await loadClasses();
            await loadStudents(selectedClassId);
        } catch (error) {
            showError(error);
        } finally {
            loading = false;
            renderPage();
        }
    }

    window.addEventListener("languagechange", () => {
        const pageBeforeRender = selectedPage;
        const classBeforeRender = selectedClassId;
        const monitorWasOpen = isMonitorOpen;
        const modalWasOpen = isCreateModalOpen;

        renderPage();

        selectedPage = pageBeforeRender;
        selectedClassId = classBeforeRender;

        if (monitorWasOpen) {
            document.querySelector(".monitor-drawer")?.classList.add("open");
        }

        if (modalWasOpen) {
            document.querySelector(".teacher-modal")?.classList.add("show");
        }
    });
    refresh();
}
