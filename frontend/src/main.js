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

    // Start screen
    router.show("registration");
}


startApp();