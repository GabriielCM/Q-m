const express = require('express');
const cors = require('cors');
const path = require('path');
const { insertReport, insertRecords, getAllRecords, getRecordsByStatus, updateRecordStatus, getLatestReport } = require('./src/database/db');
const { parseLstFile } = require('./src/fileParser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to get all records
app.get('/api/records', (req, res) => {
    getAllRecords((err, records) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(records);
    });
});

// Endpoint to get records by status
app.get('/api/records/:status', (req, res) => {
    const { status } = req.params;
    getRecordsByStatus(status, (err, records) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(records);
    });
});

// Endpoint to import a new report
app.post('/api/import', (req, res) => {
    const { fileName, fileContent } = req.body;

    try {
        const parsedRecords = parseLstFile(fileContent);

        const parts = fileName.split('.');
        const screen = parts[0];
        const user = parts[1];
        const version = parseInt(parts[2], 10);

        getLatestReport(screen, user, (err, latestReport) => {
            if (err) {
                console.error('Error getting latest report:', err);
                return res.status(500).json({ error: err.message });
            }

            if (latestReport && version <= latestReport.version) {
                return res.status(409).json({ message: 'Este relatório não é o mais recente.' });
            }

            const report = {
                report_name: fileName,
                screen,
                user,
                version,
                file_path: fileName
            };

            insertReport(report, (err, result) => {
                if (err) {
                    console.error('Error inserting report:', err);
                    return res.status(500).json({ error: err.message });
                }

                const reportId = result.id;
                insertRecords(parsedRecords, reportId, (err) => {
                    if (err) {
                        console.error('Error inserting records:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(200).json({ message: 'Relatório e registros importados com sucesso.' });
                });
            });
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Erro ao processar o arquivo .lst.' });
    }
});

// Endpoint to update a record's status
app.put('/api/records/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    updateRecordStatus(id, status, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Status do registro atualizado com sucesso.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
