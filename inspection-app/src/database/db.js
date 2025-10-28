const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'inspections.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
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

// Fila para serializar o acesso ao banco de dados
const dbQueue = [];
let isDbBusy = false;

function executeNextInQueue() {
    if (dbQueue.length > 0 && !isDbBusy) {
        isDbBusy = true;
        const task = dbQueue.shift();
        task(() => {
            isDbBusy = false;
            executeNextInQueue();
        });
    }
}

function addToQueue(task) {
    dbQueue.push(task);
    executeNextInQueue();
}

function insertReport(report, callback) {
    addToQueue((done) => {
        const { report_name, screen, user, version, file_path } = report;
        const sql = `INSERT INTO reports (report_name, screen, user, version, file_path) VALUES (?, ?, ?, ?, ?)`;

        db.run(sql, [report_name, screen, user, version, file_path], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, { id: this.lastID });
            }
            done();
        });
    });
}

function insertRecords(records, reportId, callback) {
    addToQueue((done) => {
        db.run("BEGIN TRANSACTION", (err) => {
            if (err) {
                callback(err);
                done();
                return;
            }

            let completed = 0;
            let hasErrored = false;

            records.forEach((record) => {
                const sql = `INSERT INTO records (report_id, fornecedor, razaoSocial, item, descricao, dataEntrada, numAviso, qtdRecebida, oc, record_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [reportId, record.fornecedor, record.razaoSocial, record.item, record.descricao, record.dataEntrada, record.numAviso, record.qtdRecebida, record.oc, record.id], (err) => {
                    if (hasErrored) return;
                    if (err) {
                        hasErrored = true;
                        db.run("ROLLBACK", () => {
                            callback(err);
                            done();
                        });
                        return;
                    }

                    completed++;
                    if (completed === records.length) {
                        db.run("COMMIT", (err) => {
                            if (err) {
                                db.run("ROLLBACK", () => {
                                    callback(err);
                                    done();
                                });
                            } else {
                                callback(null);
                                done();
                            }
                        });
                    }
                });
            });
        });
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

function getRecordsByStatus(status, callback) {
  db.serialize(() => {
    const sql = `SELECT * FROM records WHERE status = ?`;

    db.all(sql, [status], (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  });
}

function updateRecordStatus(recordId, status, callback) {
    addToQueue((done) => {
        const sql = `UPDATE records SET status = ? WHERE id = ?`;

        db.run(sql, [status, recordId], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, { changes: this.changes });
            }
            done();
        });
    });
}

module.exports = {
  insertReport,
  insertRecords,
  getLatestReport,
  getAllRecords,
  getRecordsByStatus,
  updateRecordStatus
};
