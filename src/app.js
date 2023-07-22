const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const router = require("./routes/index");
// require("dotenv").config()
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fileupload());
const path = require("path");
const fs = require("fs");
const request = require('request');
const session = require("express-session");
const passport = require("passport");
const AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
const crypto = require("crypto");
// app.use(express.static("uploads"));
 app.use("/", router);
 app.use(fileupload());
const sessionSecret = crypto.randomBytes(64).toString("hex");
require("dotenv").config();
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, TENANT_ID } = process.env;
const clientID = CLIENT_ID;
const clientSecret = CLIENT_SECRET;
const callbackURL = REDIRECT_URI; //"http://localhost:5000/callback";
const tenantID = TENANT_ID;

// app.use(
//   session({
//     secret: sessionSecret,
//     resave: true,
//     saveUninitialized: false,
//   })
// );

// // Inicializo Passport y lo utilizo en Express
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(fileupload());

// passport.use(
//   "azuread-openidconnect",
//   new AzureAdOAuth2Strategy(
//     {
//       clientID: clientID,
//       clientSecret: clientSecret,
//       callbackURL: callbackURL,
//       tenant: tenantID,
//       resource: "https://graph.microsoft.com/",
//     },
//     (accessToken, refreshToken, params, profile, done) => {
//       // aca puede realizar acciones para obtener los datos de los usuarios
//       //para enviar ala base datos o lo que desee y se pueda hacer
//       return done(null, { accessToken, refreshToken, profile });
//     }
//   )
// );

// // Configura la serialización de usuarios
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // Ruta de inicio de sesión
// app.get("/user/api/files", passport.authenticate("azuread-openidconnect"));

// // Ruta de retorno después de la autenticación
// app.get(
//   "/user/api/callback",
//   passport.authenticate("azuread-openidconnect", { failureRedirect: "/user/api/files" }),
//   (req, res) => {
//     // Redirige o muestra un mensaje de éxito después de la autenticación exitosa
//     res.redirect("/user/api/dashboard");
//   }
// );

// // Ruta protegida que requiere autenticación
// app.get("/user/api/dashboard", ensureAuthenticated, (req, res) => {
//   console.log("entro", __dirname);
//   const file = path.join(__dirname, "", "routes", "MASCOTAS.jpg");

//   const onedrive_folder = "SampleFolder";
//   const onedrive_filename = path.basename(file);
//   const accessToken = process.env.ACCESS_TOKEN; // Tu propio token de acceso

//   fs.readFile(file, function (err, data) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log("entro1");
//     request.put(
//       {
//         url: `https://graph.microsoft.com/v1.0/drive/root:/${onedrive_folder}/${onedrive_filename}:/content`,
//         headers: {
//           Authorization: "Bearer " + req.user.accessToken,
//           "Content-Type": "application/json",
//         },
//         body: data,
//       },
//       function (err, response, body) {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         console.log(body);
//         const accessUrl = JSON.parse(body)["webUrl"];
//         console.log("URL de acceso:", accessUrl);
//         res.send(accessUrl);
//       }
//     );
//   });
// });

// // Middleware para proteger rutas
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/user/api/files");
// }

module.exports = app;
