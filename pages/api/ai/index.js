import nc from "next-connect";
import { ncOpts } from "@/api-helper/nc";
import { authorize } from "@/api-helper/middlewares";
import { retrainModel, generateOutput } from "@/api-helper/ai";

const handler = nc(ncOpts);

handler.use(authorize);

handler.post(async (req, res) => {
  const { inputText } = req.body;

  try {
    // Set headers for chunked transfer encoding and SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Flush headers to start streaming

    await generateOutput(inputText, (progressMessage) => {
      res.write(`\n\n${progressMessage}\n\n`); // Write message in SSE format
    });

    res.end(); // Close the stream after process completes
  } catch (e) {
    res.write(
      `\n\nmessage: Error: ${e?.message || "Something went wrong."}\n\n`
    );
    res.end();
  }
});

handler.put(async (req, res) => {
  const { numberOfData, numberOfTags, applyRandomRange, numberOfDepth, retrain } =
    req.body;

  // Set headers for chunked transfer encoding and SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Flush headers to start streaming

  try {
    // Simulating the retraining model function that will stream progress
    await retrainModel(
      numberOfData,
      numberOfTags,
      applyRandomRange,
      numberOfDepth,
      retrain,
      (progressMessage) => {
        res.write(`\n\n${progressMessage}\n\n`); // Write message in SSE format
      }
    );

    res.end(); // Close the stream after process completes
  } catch (e) {
    res.write(
      `\n\nmessage: Error: ${e?.message || "Something went wrong."}\n\n`
    );
    res.end();
  }
});

export default handler;
