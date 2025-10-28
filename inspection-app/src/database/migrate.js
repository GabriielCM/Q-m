const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'inspections.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
});

db.serialize(() => {
    db.run(`ALTER TABLE records ADD COLUMN status TEXT DEFAULT 'pending'`, (err) => {
        if (err) {
            if (!err.message.includes('duplicate column name')) {
                console.error(err.message);
            }
        }
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
});
