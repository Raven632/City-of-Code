import { router } from "./core/router.js";
import { appState } from "./core/appState.js";

import { showRegistration } from "./registration/registration.js";
import { showStudent } from "./student/student.js";
import { showTeacher } from "./teacher/teacher.js";
import { showAdmin } from "./admin/admin.js";


const routes = {
    registration: showRegistration,
    student: showStudent,
    teacher: showTeacher,
    admin: showAdmin
};


export function startApp() {
    router.setRoutes(routes);

    router.show("registration");
}


startApp();


// DEV TOOL
const devTools = document.createElement("div");

devTools.innerHTML = `
    <div class="dev-tools">
        <strong>DEV ROLE SWITCH</strong>

        <button data-role="registration">
            Registration
        </button>

        <button data-role="student">
            Student
        </button>

        <button data-role="teacher">
            Teacher
        </button>

        <button data-role="admin">
            AdminGod
        </button>
    </div>
`;

devTools.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {
        router.show(button.dataset.role);
    });

});

document.body.appendChild(devTools);