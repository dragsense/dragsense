import nc from "next-connect";
import fs from "fs";
import path from "path";
import { ncOpts } from "@/api-helper/nc";
import { database } from "@/api-helper/middlewares";
import Cors from "cors";

import { _findProjectById } from "@/api-helper/database";

const cors = Cors({
  origin: "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  credentials: true,
});

const handler = nc(ncOpts);

handler.use(cors);

const generateJson = (userInput) => {
  const elements = userInput.trim().split(" ");
  const jsonStructure = elements.map((element, index) => ({
    _id: `element-${index + 1}`,
    tagName: element.toLowerCase(),
    parent: index === 0 ? null : `element-${index}`,
    nodeValue: element,
    childNodes: index === 0 ? [`element-${index + 2}`] : [],
    attributes: [],
    className: `elem-class-${Math.random().toString(36).substr(2, 5)}`,
  }));
  return jsonStructure;
};

handler.options(async (req, res) => {
  return res.status(200).json({});
});

handler.post(database, async (req, res) => {
  const project = await _findProjectById(req.db, req.query.projectId);

  if (!project) {
    return res.status(404).json({ error: { message: "Project Not Found." } });
  }

  const apiKey = req.headers["x-api-key"];

  if (apiKey !== project.apikey) {
    return res.status(401).json({ error: { message: "Please authenticate" } });
  }

  const { modelName } = req.query;
  const { userInput } = req.body;

  /* const modelDir = path.join(process.cwd(), "models", modelName);

  if (!fs.existsSync(modelDir)) {
    return res.status(404).json({ error: "Model not found" });
  }

  // Read model files
  const modelJson = fs.readFileSync(path.join(modelDir, "model.json"));
  const modelWeightsBin = fs.readFileSync(
    path.join(modelDir, "model.weights.bin")
  );
  const modelMetadata = fs.readFileSync(
    path.join(modelDir, "model_metadata.json")
  );

  res.status(200).json({
    modelJson: JSON.parse(modelJson),
    modelWeightsBin: modelWeightsBin.toString("base64"), // Send as base64 string
    modelMetadata: JSON.parse(modelMetadata),
  }); */

  const results = generateJson(userInput);

  return res.status(200).json(results);
});

export default handler;
