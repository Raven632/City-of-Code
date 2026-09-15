import { createCodeMirror } from "./codemirror.js";
export function createMonitor() {
    const monitor = document.createElement("div");

    monitor.className = "monitor";

    monitor.innerHTML = `
        <div class="monitor-header">
            <span>City of Code</span>
        </div>

        <div class="monitor-screen">

            <div class="monitor-content">
                <button class="run-button">
                    Ausführen
                </button>

                <div class="task-area">
                    <h2>Aufgabe</h2>
                    <p class="task-description">
                        Hier wird später die aktuelle Aufgabe angezeigt.
                    </p>
                </div>
                <div class="code-editor" id="code-editor"></div>

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
    const editorContainer = monitor.querySelector("#code-editor");

    createCodeMirror(editorContainer);

    return monitor;
}