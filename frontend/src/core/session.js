const SESSION_KEY = "cityOfCode_session";

export function saveSession(session) {
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );
}

export function loadSession() {
    const data = localStorage.getItem(SESSION_KEY);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}