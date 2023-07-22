require("dotenv").config();
const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const fs_extra = require("fs-extra");
const mime = require("mime");
const request = require("request");
const path = require("path");
const AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
const passport = require("../routes/userRouter");
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, TENANT_ID, TOKEN } =
  process.env;

const clientID = CLIENT_ID;
const clientSecret = CLIENT_SECRET;
const callbackURL = REDIRECT_URI; //"http://localhost:5000/callback";
const tenantID = TENANT_ID;

// // Configura la serialización de usuarios
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

const authUpload = (req, res) => {
  console.log("login inicial ");
  return passport.authenticate("azuread-openidconnect");
};

const uploadFiles = async (req, res) => {
  console.log("entro al callback ");
  // Redirige o muestra un mensaje de éxito después de la autenticación exitosa
  res.redirect("/user/api/dashboard");
};

const dashboard = async (req, res) => {
  console.log("entroooooooooooooooooooooooo");

  if(req.files){
    const {imagen} = req.files
    console.log(imagen)
  }


  // const { imagen } = req.files;
  // const { user, code } = req.body;
  // //   console.log(imagen);
  // let imgs;
  // let imagePath;
  // let imageBuffer;
  // let uploadPath;
  // imgs = req.files.imagen;
  // uploadPath = `uploads/${imgs.name}`;
  // console.log(imagen);
  // imgs.mv(`${uploadPath}`, (err) => {
  //   if (err) return res.status(500).send(err);

  //   // console.log("dashboard ")
  //   // console.log("entro", __dirname);
  //   const img_fecha = imgs.name;
  //   const file = path.join(__dirname, "../..", "uploads", imgs.name);

    const file = path.join(__dirname, "../..", "uploads", "tesla.jpg");

    // const onedrive_folder = `OCR/${user}`;
    const onedrive_folder = `OCR`;
    const onedrive_filename = path.basename(file);
    const accessToken = process.env.ACCESS_TOKEN; // Tu propio token de acceso

    fs.readFile(file, function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(req.user.accessToken)
      request.put(
        {
          url: `https://graph.microsoft.com/v1.0/drive/root:/${onedrive_folder}/${onedrive_filename}:/content`,
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
            // Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
          body: data,
        },
        async function (err, response, body) {
          if (err) {
            console.error(err);
            return;
          }
          const accessUrl = JSON.parse(body)["webUrl"];
          console.log("URL de acceso:", accessUrl);
          const user = {
            acces_url: accessUrl,
            auth: req.isAuthenticated(),
          };

          // eliminar(file);

          res.json(user);
        }
      );
    });
    //TODO este
  // });
};

const eliminar = (file) => {
  if (fs_extra.existsSync(file)) {
    fs_extra.unlink(file);
  } else {
    console.log("El archivo no existe:", file);
  }
};

// Middleware para proteger rutas
function ensureAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/api/callback");
}

module.exports = { authUpload, uploadFiles, dashboard, ensureAuthenticated };
