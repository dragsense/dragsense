import { findProjectById } from '@/api-helper/database';
import { authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import nc from 'next-connect';

// Create a handler with next-connect
const handler = nc(ncOpts);

// Use database and authorize middlewares
handler.use(database, authorize);

// Function to get current date in DD-MM-YYYY format
const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    return `${day}-${month}-${year}`;
};

// Function to add files to zip
const addFilesToZip = (folderPath, folderName, zip) => {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            let fileContent = fs.readFileSync(filePath, 'utf-8');

            if (file !== 'app-client.js') 
            zip.file(path.join(folderName, file), fileContent);
        }
    });
};

// Handle GET request
handler.get(async (req, res) => {
    try {
        const project = await findProjectById(req.db, req.query.projectId);

        if (!project) {
            return res.status(403).json({ error: { message: 'Project Not Found.' } });
        }

        const zip = new JSZip();

        addFilesToZip('../nodejs-demo/dist', '', zip, project, []);

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=autocode-library-${getCurrentDate()}.zip`);

        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: { message: 'An error occurred while processing your request.' } });
    }
});

export default handler;