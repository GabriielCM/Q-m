const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'inspections.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the inspections database.');
  db.run('PRAGMA journal_mode = WAL;');
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

function insertReport(report, callback) {
  db.serialize(() => {
    const { report_name, screen, user, version, file_path } = report;
    const sql = `INSERT INTO reports (report_name, screen, user, version, file_path) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [report_name, screen, user, version, file_path], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  });
}

function insertRecords(records, reportId, callback) {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        function insertOne(index) {
            if (index >= records.length) {
                db.run("COMMIT", callback);
                return;
            }
            const record = records[index];
            const sql = `INSERT INTO records (report_id, fornecedor, razaoSocial, item, descricao, dataEntrada, numAviso, qtdRecebida, oc, record_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql, [reportId, record.fornecedor, record.razaoSocial, record.item, record.descricao, record.dataEntrada, record.numAviso, record.qtdRecebida, record.oc, record.id], (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    callback(err);
                } else {
                    insertOne(index + 1);
                }
            });
        }

        insertOne(0);
    });
}

function getLatestReport(screen, user, callback) {
  db.serialize(() => {
    const sql = `SELECT * FROM reports WHERE screen = ? AND user = ? ORDER BY version DESC LIMIT 1`;

    db.get(sql, [screen, user], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
  });
}

function getAllRecords(callback) {
  db.serialize(() => {
    const sql = `SELECT * FROM records`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  });
}

function updateRecordStatus(recordId, status, callback) {
  db.serialize(() => {
    const sql = `UPDATE records SET status = ? WHERE id = ?`;

    db.run(sql, [status, recordId], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  });
}

module.exports = {
  insertReport,
  insertRecords,
  getLatestReport,
  getAllRecords,
  updateRecordStatus
};
