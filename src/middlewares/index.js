const login = require("./login");
// const registerUser = require("./registerUser");
const {
  getProyectName,
  getProyect,
  registerActivities,
  hourActivities,
  logout
} = require("./proyect");
const Ocr = require("./Ocr")

module.exports = {
  login,
  getProyectName,
  getProyect,
  registerActivities,
  hourActivities,
  logout,
  Ocr
};
