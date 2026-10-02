# City of Code

[English](README.md) | Deutsch | [Русский](README.ru.md)

Ein Browserspiel, mit dem man in der Schule Python lernt. Man löst Aufgaben in einem Code-Editor
direkt im Browser, und mit jeder gelösten Aufgabe wächst die eigene kleine Stadt: Wohnhäuser,
ein Rathaus, eine Feuerwehr, ein Krankenhaus. Die vier Kapitel folgen dem üblichen Aufbau eines
Python-Kurses: Variablen, Bedingungen, Schleifen, Funktionen.

Wir entwickeln das Spiel als Schulprojekt an der Friedrich-Dessauer-Schule in Limburg (Klasse BFI 12),
von August 2026 bis zur Abgabe am 22.03.2027.

## Stand

Noch am Anfang. Fertig sind bisher:

- Pflichtenheft und Projektplan (Netzplan mit kritischem Pfad)
- der Datenbankentwurf, siehe [backend/docs/datenbank.md](backend/docs/datenbank.md), dazu ein
  ER-Diagramm in `datenbank.dbml`, das man in dbdiagram.io einfügen kann
- die ersten Seiten des Frontends: Registrierung, Schüler-, Lehrer- und Admin-Ansicht, der
  Code-Editor (CodeMirror 6) und ein Ausgabefenster, Oberfläche auf Deutsch und Englisch

Als Nächstes kommen die Flask-API mit Anmeldung und die Stadt selbst in Phaser 3, danach das Ausführen
und Prüfen des Schülercodes mit Pyodide. Ein erster spielbarer Prototyp soll Ende November 2026 stehen.

## So funktioniert das Spiel

Es gibt 20 Level in 4 Kapiteln. Jedes Level stellt eine Aufgabe. Stimmt der Code, schaltet das Level
ein oder mehrere Gebäude frei, und die stellt man selbst auf die Karte. Das nächste Level öffnet sich,
sobald alles aus dem aktuellen platziert ist. Coins gibt es nur für Dekoration, ein Level kann man
sich also nicht kaufen.

Schülerinnen und Schüler registrieren sich mit einem Klassencode von ihrer Lehrkraft und landen
automatisch in der richtigen Klasse. Lehrkräfte bekommen eine Übersicht, wie weit die Klasse ist.

## Wie es aufgebaut wird

```
 Browser                                     Server (Docker Compose on a VPS)
 ┌─────────────────────────────────┐         ┌──────────────────────────┐
 │ editor (CodeMirror 6)           │  REST   │ Nginx                    │
 │ city (Phaser 3, Tiled maps)     │  + JWT  │ Gunicorn + Flask API     │
 │ Web Worker: Pyodide runs and    │ ──────► │ SQLite via SQLAlchemy    │
 │ checks the student's code       │         └──────────────────────────┘
 └─────────────────────────────────┘
```

Der Code der Schüler wird nie an den Server geschickt. Er läuft im Browser mit Pyodide (Python als
WebAssembly) in einem Web Worker, und jedes Level hat eine eigene Prüfung, ebenfalls in Python, die
dort gegen die Lösung läuft. Hört eine Lösung nicht auf, etwa `while True: pass`, wird der Worker nach
5 Sekunden beendet und die Seite bleibt bedienbar. Auf dem Server liegen nur Konten und Fortschritt.

Eine Entscheidung, die uns gefällt: Der Status eines Levels (gesperrt, verfügbar, in Arbeit, wartet
auf Platzierung, fertig) wird nirgends gespeichert. Er wird aus ein paar Zeitstempeln berechnet und
kann ihnen deshalb nicht widersprechen.

## Lokal starten

Man braucht Python 3 und Node.js.

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py
```

`seed.py` legt `instance/codequest.db` neu an und füllt sie mit Testdaten: eine Lehrkraft, eine Klasse
mit dem Code `AB12CD`, ein Schüler, alle 20 Level und 20 Gebäudetypen. Eine API zum Starten gibt es
noch nicht.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Vite zeigt die Adresse an, meistens http://localhost:5173. Vorerst gibt es ein Feld "DEV ROLE SWITCH",
mit dem man zwischen Registrierung, Schüler-, Lehrer- und Admin-Ansicht wechselt.

## Team

- Khalil: Backend, API, Datenbank, Deployment, Projektleitung
- Vladyslav: Frontend, Spiel-Engine
- Leon: Level-Design, Lerninhalte, Qualitätssicherung

## Nicht Teil des Projekts

Mehr als die vier Kapitel, Mehrspieler oder Ranglisten über Klassen hinweg, eine App fürs Handy und
eigene Aufgaben von Lehrkräften. Das haben wir am Anfang bewusst ausgeschlossen, damit der Rest in die
Zeit passt.
