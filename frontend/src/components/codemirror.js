import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";

export function createCodeMirror(parent) {
    const startCode = `# City of Code
request_registr["name"] = ""
request_registr["password"] = ""
request_registr["role"] = "student"
`;

    const state = EditorState.create({
        doc: startCode,
        extensions: [
            basicSetup,
            python(),
            EditorView.theme({
                "&": {
                    height: "100%",
                    fontSize: "14px"
                },
                ".cm-scroller": {
                    overflow: "auto"
                }
            })
        ]
    });

    const editor = new EditorView({
        state,
        parent
    });

    return editor;
}