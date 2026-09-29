# Datenbankentwurf (AP03)

**Projekt:** CodeQuest: City of Code
**Zuständig:** Khalil (Backend)
**Technik:** SQLite, angebunden über Flask-SQLAlchemy
**Quellcode:** `backend/models.py`, Testdaten: `backend/seed.py`
**ER-Diagramm:** `backend/docs/datenbank.dbml` (auf https://dbdiagram.io einfügen)

---

## 1. Überblick

Die Datenbank speichert drei Arten von Daten:

| Gruppe | Tabellen | Bedeutung |
|---|---|---|
| **Nutzer** | `users`, `classes` | Konten von Schülern und Lehrkräften, Klassen mit Klassencode |
| **Katalog** | `levels`, `building_types`, `level_unlocks` | Spielinhalte, für alle Spieler gleich, werden über `seed.py` angelegt |
| **Spielstand** | `level_progress`, `building_instances` | Fortschritt und Stadt eines einzelnen Schülers |

Leitfrage für die Zuordnung: *Ist der Wert für alle Spieler gleich?*
Ja → Katalog. Nein → Spielstand.

---

## 2. Tabellen

### users
Ein Konto (Schüler oder Lehrkraft).

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| id | Integer | PK | |
| username | String(80) | ja, eindeutig | Anmeldename |
| password_hash | String(255) | ja | Passwort nur als Hash, nie im Klartext |
| role | String(20) | ja | `student` oder `teacher` |
| class_id | Integer → classes | nein | Klasse des Schülers; bei Lehrkräften leer |
| city_name | String(40) | nein | Stadtname, wird in Level 2 gewählt |
| coin_balance | Integer | ja | City-Coins, nur für Kosmetik |
| created_at | DateTime | ja | Registrierungszeitpunkt |
| last_active_at | DateTime | nein | Letzte Aktivität (Lehrer-Dashboard) |

### classes
Eine Schulklasse mit Klassencode für die Registrierung (A01).

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| id | Integer | PK | |
| name | String(80) | ja | z. B. „BFI 11“ |
| class_code | String(20) | ja, eindeutig | Code, den die Lehrkraft ausgibt |
| teacher_id | Integer → users | ja | Lehrkraft der Klasse |
| created_at | DateTime | ja | |

### levels
Die 20 Storymissionen.

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| id | Integer | PK | |
| number | Integer | ja, eindeutig | 1–20 |
| title | String(100) | ja | z. B. „Systemstart“ |
| chapter | Integer | ja | Kapitel 1–4 |
| python_week | Integer | ja | Python-Woche 1–6 |
| validator_key | String(100) | ja | Verweis auf die Validierungsfunktion, z. B. `level_01` |
| coin_reward | Integer | ja | Coins für den Abschluss (Platzhalter) |

### building_types
Katalog der 20 Gebäudetypen.

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| code | String(50) | PK | technische ID, z. B. `wohnhaus` |
| name | String(80) | ja | Anzeigename |
| category | String(20) | ja | `main` = Pflichtobjekt (später z. B. Dekoration) |
| width, height | Integer | ja | Footprint in Tiles |
| max_count | Integer | nein | maximale Anzahl pro Spieler |
| price | Integer | nein | Coin-Preis; leer = kostenlos (alle Pflichtobjekte) |
| requires_access | Boolean | ja | braucht Straßen-/Wegezugang |
| asset_key | String(80) | ja | Name der Grafik im Frontend |

### level_unlocks
n:m-Verbindung: welches Level schaltet wie viele Gebäude welchen Typs frei.

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| level_id | Integer → levels | PK (zusammengesetzt) | |
| building_code | String(50) → building_types | PK (zusammengesetzt) | |
| count | Integer | ja | Anzahl, z. B. 9 Wohnhäuser in Level 11 |

### level_progress
Eine Zeile pro Schüler und Level.

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| id | Integer | PK | |
| user_id | Integer → users | ja | |
| level_id | Integer → levels | ja | |
| attempts | Integer | ja | Anzahl Versuche |
| hints_used | Integer | ja | Anzahl genutzter Hinweise |
| reward_claimed | Boolean | ja | Coins bereits gutgeschrieben |
| code_passed_at | DateTime | nein | Zeitpunkt, an dem der Code korrekt war |
| completed_at | DateTime | nein | Zeitpunkt, an dem alle Gebäude platziert waren |
| updated_at | DateTime | ja | |

Eindeutig: (`user_id`, `level_id`).

### building_instances
Ein konkretes Gebäude in der Stadt eines Schülers.

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| id | Integer | PK | |
| user_id | Integer → users | ja | Besitzer |
| building_code | String(50) → building_types | ja | Gebäudetyp |
| level_id | Integer → levels | ja | Level, das dieses Gebäude freigeschaltet hat |
| instance_number | Integer | ja | laufende Nummer je Typ („Wohnhaus #7“) |
| tile_x, tile_y | Integer | nein | Position; leer = freigeschaltet, aber noch nicht platziert |
| created_at, updated_at | DateTime | ja | |

Eindeutig: (`user_id`, `building_code`, `instance_number`).

---

## 3. Beziehungen

- Eine Klasse hat genau eine Lehrkraft (`classes.teacher_id → users.id`).
- Ein Schüler gehört zu höchstens einer Klasse (`users.class_id → classes.id`).
- Ein Level schaltet einen oder mehrere Gebäudetypen frei, ein Gebäudetyp kann von mehreren Levels freigeschaltet werden (n:m über `level_unlocks`).
- Ein Schüler hat je Level höchstens einen Fortschrittseintrag (`level_progress`).
- Ein Schüler besitzt beliebig viele Gebäude (`building_instances`), jedes gehört zu genau einem Typ und einem Level.

`users` und `classes` verweisen gegenseitig aufeinander. Damit die Tabellen trotzdem angelegt werden können, wird der Fremdschlüssel `classes.teacher_id` nachträglich erzeugt (`use_alter=True`). Deshalb muss beim Anlegen zuerst die Lehrkraft, dann die Klasse, dann der Schüler gespeichert werden.

---

## 4. Entwurfsentscheidungen

### 4.1 Abweichung von den Tabellennamen im Pflichtenheft
Das Pflichtenheft nennt die Tabellen `klasse`, `nutzer`, `aufgabe` und `fortschritt`. Im Laufe der Planung wurde das Spielkonzept (Production-Dokument) detaillierter, deshalb wurde das Modell erweitert:

| Pflichtenheft | Umsetzung | Grund |
|---|---|---|
| klasse | `classes` | gleiche Funktion |
| nutzer | `users` | gleiche Funktion, zusätzlich Rolle, Stadtname, Coins |
| aufgabe | `levels` | 20 Storymissionen statt einzelner Aufgaben |
| fortschritt | `level_progress` + `building_instances` | Fortschritt besteht aus Lösung **und** Platzierung der Gebäude |
| – | `building_types`, `level_unlocks` | Gebäudekatalog für freie Platzierung |

Die vier Lernmodule aus dem Pflichtenheft (Variablen, Bedingungen, Schleifen, Funktionen) entsprechen den vier Kapiteln (`levels.chapter`).

### 4.2 Level-Status wird berechnet, nicht gespeichert
Das Spiel kennt fünf Zustände pro Level. Sie werden aus vorhandenen Daten berechnet:

| Status | Bedingung |
|---|---|
| `completed` | `completed_at` gesetzt |
| `placement_pending` | `code_passed_at` gesetzt, `completed_at` leer |
| `in_progress` | Eintrag vorhanden, `code_passed_at` leer |
| `available` | Level 1 oder vorheriges Level `completed` |
| `locked` | sonst |

**Grund:** Ein gespeicherter Status könnte den Zeitstempeln widersprechen. Ein berechneter Status ist immer konsistent.
**Prinzip:** Fakten speichern, Abgeleitetes berechnen.

### 4.3 Letzte Aktivität wird gespeichert
`users.last_active_at` wird bei jeder Anfrage eines angemeldeten Nutzers aktualisiert.
**Grund:** Die Aktivität lässt sich nicht vollständig aus anderen Tabellen berechnen, z. B. erzeugt eine Anmeldung ohne weitere Aktion keinen anderen Eintrag. Außerdem bleibt die Abfrage für das Lehrer-Dashboard einfach.

### 4.4 n:m-Tabelle `level_unlocks` statt Spalte `unlock_level`
Ein Gebäudetyp kann von mehreren Levels freigeschaltet werden (Wohnhaus: 1× in Level 3, 9× in Level 11), und ein Level kann mehrere Typen freischalten (Level 11: Wohnhäuser und Wohnkomplex). Eine einzelne Spalte `unlock_level` in `building_types` kann das nicht abbilden.

### 4.5 `level_id` in `building_instances`
Damit ist eindeutig, aus welchem Level ein Gebäude stammt. So lässt sich prüfen, ob alle Gebäude eines Levels platziert sind (z. B. Level 11: 9 Wohnhäuser), ohne die Wohnhäuser aus Level 3 mitzuzählen. Das ist nötig, um Teilfortschritt zu speichern (Level 11: 5 von 9 platziert, Browser schließen, später fortsetzen).

### 4.6 „Platziert“ über leere Koordinaten
Ein freigeschaltetes, aber noch nicht platziertes Gebäude hat `tile_x = tile_y = NULL`. Ein zusätzliches Feld `placed` ist nicht nötig.

### 4.7 Natürlicher Schlüssel für Gebäudetypen
`building_types` verwendet `code` (z. B. `wohnhaus`) als Primärschlüssel statt einer Zahl. Der Code ist fest, eindeutig und im Frontend und in den Testdaten direkt lesbar.

### 4.8 Weitere Festlegungen
- **Keine XP:** Es gibt bewusst kein XP-Feld.
- **Coins nur kosmetisch:** Pflichtobjekte haben keinen Preis (`price = NULL`).
- **Kein Schülercode auf dem Server:** Nur der Fortschritt wird gespeichert, Codeentwürfe bleiben im Browser.
- **Zeitstempel in UTC.**

---

## 5. Testdaten (`seed.py`)

`seed.py` legt die Datenbank neu an und füllt sie mit:
- einer Lehrkraft, einer Klasse (Code `AB12CD`) und einem Schüler,
- allen 20 Gebäudetypen,
- allen 20 Levels mit Kapitel, Python-Woche und Freischaltungen.

Zur Kontrolle berechnet das Skript am Ende die Summen und vergleicht sie mit dem Production-Dokument:
**20 Levels, 20 Gebäudetypen, 30 Pflichtobjekte, 310 Tiles.**

Alle Einträge werden in einer Transaktion gespeichert (ein `commit` am Ende): Entweder werden alle Testdaten angelegt oder keine.

---

## 6. Offene Punkte

- Wo werden die Levelinhalte (Story, Frage, Aufgabentext, Hinweise, Startercode) abgelegt: in der Datenbank oder als Dateien im Frontend? (mit Leon/Vladyslav klären)
- Werte für `requires_access` je Gebäudetyp
- Endgültige Coin-Werte (erst nach Prototyp)
- Tabellen für Python-Training und Dekoration (nach dem Kernumfang)
- WAL-Modus für SQLite aktivieren (laut Pflichtenheft)
- Rolle `student | teacher` wird bisher nur im Code geprüft, nicht durch die Datenbank
