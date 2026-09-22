import de from "../locales/de.js";
import en from "../locales/en.js";

const languages = {
    de,
    en
};

let currentLanguage =
    localStorage.getItem("language") || "de";

export function getLanguage() {
    return currentLanguage;
}

export function setLanguage(language) {

    if (!languages[language]) {
        return;
    }

    currentLanguage = language;

    localStorage.setItem(
        "language",
        language
    );

    window.dispatchEvent(
        new CustomEvent("languagechange")
    );
}

export function t(key) {

    return languages[currentLanguage][key]
        ?? key;
}