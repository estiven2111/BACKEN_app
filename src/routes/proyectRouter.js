const { Router } = require("express");
const ProyectRouter = Router();
const {
  getProyectName,
  getProyect,
  registerActivities,
  hourActivities,
  logout,
  Ocr,
} = require("../middlewares/index");


const { ComputerVisionClient, AzureKeyCredential } = require("@azure/cognitiveservices-computervision");
ProyectRouter.get("/search", getProyectName);
ProyectRouter.get("/", getProyect);
ProyectRouter.get("/logout", logout);
ProyectRouter.post("/hours", registerActivities);
ProyectRouter.get("/hours", hourActivities);
ProyectRouter.post("/ocr",Ocr)

//,fileupload({ useTempFiles: true, tempFileDir: "./uploads" })
module.exports = ProyectRouter;
