
require("dotenv").config();
const msGraph = require("msgraph-sdk-javascript");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const msal = require("@azure/msal-node");


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
 const SCOPES = ["https://graph.microsoft.com/.default"];
//  const SCOPES = ['offline_access', 'files.readwrite.all'];
const onedrive_folder_url =
  "https://creameincubadora-my.sharepoint.com/:f:/g/personal/simerp1_creame_com_co/Eo9hZL4U8-hLjKjmJXs5AoYBiwXDqmM8jV71L090fWRn4g?e=rD1p7P";

// Extraer el ID de la carpeta compartida de la URL
const sharedFolderId = onedrive_folder_url.split("/g/")[1].split("/")[0];
const file = path.join(__dirname, "..", "routes", "MASCOTAS.jpg");
const onedrive_folder = `/drive/items/${sharedFolderId}`;


const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

// Crear una instancia del cliente de MSAL
const cca = new msal.ConfidentialClientApplication(msalConfig);

const authUpload = async (req, res) => {
      // const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=${SCOPES.join(' ')}`;
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=offline_access%20Files.ReadWrite.All`;
  // const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=online_access%20Files.ReadWrite.All`;
  res.redirect(authUrl);
};
const uploadFiles = async (req, res) => {
 

  try {
    // Obtener un token de acceso usando el flujo de autenticación "client_credentials"
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: SCOPES.join(" "),
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;


    const client = msGraph.Client.init({
      defaultVersion: "beta",
      debugLogging: true,
      authProvider: (done) => {
        done(null, accessToken);
      },
    });




    // Leer el archivo desde el sistema de archivos
    const imageBuffer = fs.readFileSync(file);
console.log(imageBuffer)
    // Subir el archivo a OneDrive
    const uploadResponse = await client
    .api(`${onedrive_folder}/filename.jpg/content`)
    .headers({
      "Content-Type": "application/json",
    })
    .put(imageBuffer);

    console.log("Archivo subido:", uploadResponse);

    // Hacer algo con el resultado de la subida...

    res.send("Archivo subido correctamente");
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    res.status(500).send("Error al subir el archivo");
  }
};



module.exports = { authUpload, uploadFiles };

