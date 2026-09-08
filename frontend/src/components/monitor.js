export function createMonitor() {
    const monitor = document.createElement("div");

    monitor.className = "monitor";

    monitor.innerHTML = `
        <div class="monitor-header">
            <span>City of Code</span>
        </div>

        <div class="monitor-screen">

            <div class="monitor-content">

                <div class="task-area">
                    <h2>Aufgabe</h2>
                    <p class="task-description">
                        Hier wird später die aktuelle Aufgabe angezeigt.
                    </p>
                </div>

                <!-- |================ CODE EDITOR PLACEHOLDER ================| -->
                <!-- | CodeMirror 6 wird später hier integriert.              | -->
                <!-- |========================================================| -->

                <div class="code-editor-placeholder">
                    <span>CodeMirror 6</span>
                    <small>Editor placeholder</small>
                </div>

                <button class="run-button">
                    Ausführen
                </button>

                <div class="terminal">
                    <div class="terminal-header">
                        Terminal
                    </div>

                    <div class="terminal-output">
                        <span>Bereit...</span>
                    </div>
                </div>

            </div>

        </div>
    `;

    return monitor;
}