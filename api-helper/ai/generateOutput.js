const { spawn } = require("child_process");
const path = require("path");

const { wordToNumber } = require("./utils");

// Path to the Python script
const pythonScriptPath = path.join(
  process.cwd(),
  "api-helper/ai/training-prediction.py"
);

// Function to generate JSON from text using the Python model
async function generateOutput(inputText, callback) {
  return new Promise((resolve, reject) => {
    inputText = wordToNumber(inputText);
    // Spawn the Python process
    const pythonProcess = spawn("python", [
      pythonScriptPath,
      "generate",
      true,
      inputText,
    ]);

    // Handle errors that occur while spawning the process
    pythonProcess.on("error", (err) => {
      callback(`Failed to start Python process: ${err.message}`);
    });

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
        callback("Success: Prediction completed.");
        resolve();
      }
    });

    pythonProcess.on("error", (err) => {
      callback(`Failed to start Python process: ${err.message}`);
      reject(err);
    });
  });
}

export default generateOutput;
