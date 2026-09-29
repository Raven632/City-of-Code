const API_BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || data.error || `HTTP ${response.status}`
        );
    }

    return data;
}

export const teacherApi = {
    async getClasses() {
        const data = await request("/teacher/classes");
        return data.classes ?? data;
    },

    async createClass(name) {
        return request("/teacher/classes", {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    },

    async getStudents(classId) {
        const data = await request(
            `/teacher/classes/${classId}/students`
        );

        return data.students ?? data;
    },
};