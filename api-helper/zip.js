
import fs from "fs";

const addFilesFromDirectoryToZip = (directoryPath = "", zip, project) => {
  const directoryContents = fs.readdirSync(directoryPath, {
    withFileTypes: true,
  });

  directoryContents.forEach(({ name }) => {

    if (name !== 'node_modules') {

      const path = `${directoryPath}/${name}`;

      if (fs.statSync(path).isFile()) {


        let file = fs.readFileSync(path, "utf-8");

        if (name === 'package.json') {
          const content = JSON.parse(file);
          content.name = project.name;
          file = JSON.stringify(content);
        }

        if (name == '.env.local' || name == '.env')
          file = `NODE_ENV=production
          MONGODB_URI=mongodb://localhost:27017/auto_code_db
          AUTCODE_API_KEY=${project.apikey}`


        zip.file(path, file);
      }


      if (fs.statSync(path).isDirectory()) {
        addFilesFromDirectoryToZip(path, zip);
      }
    }
  });
};
export default async (zip, directoryPath = "", project) => {

  if (directoryPath)
    addFilesFromDirectoryToZip(directoryPath, zip, project);

  //const zipAsBase64 = await zip.generateAsync({ type: "base64" });

  //return zipAsBase64;
};