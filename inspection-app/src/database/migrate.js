const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'inspections.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the inspections database for migration.');
});

db.serialize(() => {
    db.run(`ALTER TABLE records ADD COLUMN status TEXT DEFAULT 'pending'`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('"status" column already exists in "records" table.');
            } else {
                console.error(err.message);
            }
        } else {
            console.log('"records" table altered, "status" column added.');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});
