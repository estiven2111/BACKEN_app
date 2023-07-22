// const express = require("express");
// const session = require("express-session");
// const passport = require("passport");
// const AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
// const crypto = require("crypto");
// const path = require("path");
// const fs = require("fs");
// const app = express();
// const fileupload = require("express-fileupload");
// const request = require("request");
// // Genera una cadena secreta para la sesión
// const sessionSecret = crypto.randomBytes(64).toString("hex");

// // Configura las credenciales de tu aplicación en Azure AD
// clientID = "e860f65b-a281-411b-9cfa-fa158fa7c2db";
// clientSecret = "2Jd8Q~CGgIP7XU0p8MwdR87RDh3do7d8EnLs6dcd";
// callbackURL = "http://localhost:5000/callback";
// tenantID = "422ce85a-4ac3-4bc8-8429-c79ab5d86930";

// // Configura y utiliza sesiones en Express
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
// app.get("/login", passport.authenticate("azuread-openidconnect"));

// // Ruta de retorno después de la autenticación
// app.get(
//   "/callback",
//   passport.authenticate("azuread-openidconnect", { failureRedirect: "/login" }),
//   (req, res) => {
//     // Redirige o muestra un mensaje de éxito después de la autenticación exitosa
//     res.redirect("/dashboard");
//   }
// );

// // Ruta protegida que requiere autenticación
// app.get("/dashboard", ensureAuthenticated, (req, res) => {
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
//   res.redirect("/login");
// }

// // Inicia el servidor
// app.listen(4000, () => {
//   console.log("Servidor iniciado en http://localhost:4000");
// });
