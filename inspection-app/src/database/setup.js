const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'inspections.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the inspections database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_name TEXT NOT NULL UNIQUE,
    screen TEXT NOT NULL,
    user TEXT NOT NULL,
    version INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    imported_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('"reports" table created or already exists.');
  });

  db.run(`CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER,
    fornecedor TEXT,
    razaoSocial TEXT,
    item TEXT,
    descricao TEXT,
    dataEntrada TEXT,
    numAviso INTEGER,
    qtdRecebida REAL,
    oc INTEGER,
    record_id TEXT UNIQUE,
    FOREIGN KEY (report_id) REFERENCES reports (id)
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('"records" table created or already exists.');
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Closed the database connection.');
});
