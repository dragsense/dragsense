const { spawn } = require("child_process");
const path = require("path");
const { generateBalancedDataset } = require("./generateRandomDataSet");

const pythonScriptPath = path.join(
  process.cwd(),
  "api-helper/ai/training-prediction.py"
);

async function retrainModel(
  numberOfData,
  numberOfTags,
  applyRandomRange,
  numberOfDepth,
  retrain = true,
  callback
) {
  // Generate the dataset before running the Python script
 
  // Return a Promise that resolves when the Python process exits
  return new Promise((resolve, reject) => {
    
    const pythonProcess = spawn("python", [pythonScriptPath, "retrain", retrain]);

    generateBalancedDataset(
      numberOfData,
      numberOfTags,
      applyRandomRange,
      numberOfDepth,
      callback
    ); 
  

    // Stream the output from Python to the client
    pythonProcess.stdout.on("data", (data) => {
      callback(data.toString()); // Stream each chunk to the client
    });

    pythonProcess.stderr.on("data", (data) => {
      callback(data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        callback(`Python process exited with code ${code}.`);
        reject(new Error(`Python process exited with code ${code}.`));
      } else {
        callback("Success: Training completed.");
        resolve();
      }
    });

    pythonProcess.on("error", (err) => {
      callback(`Failed to start Python process: ${err.message}`);
      reject(err);
    });
  });
}

module.exports = retrainModel;
