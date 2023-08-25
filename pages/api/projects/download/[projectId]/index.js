import { findProjectById } from '@/api-helper/database';
import { authorize, database } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database, authorize);

const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    return `${day}-${month}-${year}`;
};

handler.get(async (req, res) => {
    const project = await findProjectById(req.db, req.query.projectId);

    if (!project) {
        return res.status(403).json({ error: { message: 'Project Not Found.' } });
    }

    const zip = new JSZip();

    const addFilesToZip = (folderPath, folderName) => {
        const files = fs.readdirSync(folderPath);

        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {

                let fileContent = fs.readFileSync(filePath, 'utf-8');

                if (file === '.env.local' || file === '.env') {
                    fileContent = fileContent.replace('APP_PORT=3001', `APP_PORT=3000`);
                    fileContent = fileContent.replace('AUTCODE_API_KEY=1234', `AUTCODE_API_KEY=${project.apikey}`);
                }

                zip.file(path.join(folderName, file), fileContent);


            } else if (stats.isDirectory() && folderName !== 'node_modules') {
                const subFolderPath = path.join(folderPath, file);
                const subFolderName = path.join(folderName, file);
                addFilesToZip(subFolderPath, subFolderName);
            }
        });
    };

    addFilesToZip('./autocode-project', '');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${project.name}-${getCurrentDate()}.zip`);

    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(res);
});

export default handler;