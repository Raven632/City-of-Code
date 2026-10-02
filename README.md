# City of Code

English | [Deutsch](README.de.md) | [Русский](README.ru.md)

A browser game for learning Python at school. You solve tasks in a code editor right in the browser,
and every solved task grows your own small city: houses, a town hall, a fire station, a hospital.
The four chapters follow the usual order of a Python course: variables, conditions, loops, functions.

We're building it as a school project at the Friedrich-Dessauer-Schule in Limburg (class BFI 11),
from August 2026 until the hand-in on 22 March 2027.

## Where we are

Early on. Done so far:

- requirements spec and project plan (a network plan with the critical path)
- database design, see [backend/docs/datenbank.md](backend/docs/datenbank.md) (in German), with an
  ER diagram in `datenbank.dbml` that you can paste into dbdiagram.io
- first screens of the frontend: registration, student, teacher and admin views, the code editor
  (CodeMirror 6) and an output panel, UI in German and English

Next: the Flask API with logins and the city itself in Phaser 3, then running and checking student
code with Pyodide. A first playable prototype should be ready by the end of November 2026.

## How the game works

There are 20 levels in 4 chapters. Each level gives you a task. If your code is right, the level
unlocks one or more buildings, and you place them on the map yourself. The next level opens once
everything from the current one is placed. Coins are only for decorations, so you can't buy your way
past a level.

Students sign up with a class code they get from their teacher and land in the right class.
Teachers will get an overview of how far everyone in the class has got.

## How it's going to work

```
 Browser                                     Server (Docker Compose on a VPS)
 ┌─────────────────────────────────┐         ┌──────────────────────────┐
 │ editor (CodeMirror 6)           │  REST   │ Nginx                    │
 │ city (Phaser 3, Tiled maps)     │  + JWT  │ Gunicorn + Flask API     │
 │ Web Worker: Pyodide runs and    │ ──────► │ SQLite via SQLAlchemy    │
 │ checks the student's code       │         └──────────────────────────┘
 └─────────────────────────────────┘
```

Student code is never sent to the server. It runs in the browser with Pyodide (Python compiled to
WebAssembly) inside a Web Worker, and every level has its own check, also written in Python, that
runs against the solution there. If a solution never stops, like `while True: pass`, the worker is
killed after 5 seconds and the page stays usable. The server only keeps accounts and progress.

One decision we like: the status of a level (locked, available, in progress, waiting for placement,
done) isn't stored anywhere. It's worked out from a few timestamps, so it can't contradict them.

## Running it locally

You need Python 3 and Node.js.

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py
```

`seed.py` builds `instance/codequest.db` from scratch and fills it with test data: a teacher, a class
with the code `AB12CD`, a student, all 20 levels and 20 building types. There's no API to start yet.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the address, usually http://localhost:5173. For now there's a "DEV ROLE SWITCH" panel to
jump between the registration, student, teacher and admin screens.

## Team

- Khalil: backend, API, database, deployment, project lead
- Vladyslav: frontend, game engine
- Leon: level design, learning content, testing

## Not part of the project

More than the four chapters, multiplayer or rankings across classes, a mobile app, and teachers
writing their own tasks. We ruled these out at the start so the rest fits into the time we have.
