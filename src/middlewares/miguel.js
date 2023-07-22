require('dotenv').config();
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const mime = require('mime');
const request = require('request');
const path = require('path');
// const imagen = require("../routes/FACT2.jpeg")

const authUpload = (req, res) => {
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=offline_access%20Files.ReadWrite.All`
    res.redirect(authUrl);
}



const uploadFiles = async (req, res) => {
    //! aqui hacer la logica para que se seleccione el archivo de la carpeta deseada
    const file = path.join(__dirname, '..', 'routes', 'MASCOTAS.jpg');
    // const file = "../routes/FACT2.jpeg"; // Nombre del archivo que deseas subir desde tu PC local
    const onedrive_folder = 'SampleFolder'; // Nombre de la carpeta en OneDrive
    const onedrive_filename = path.basename(file); // Nombre del archivo en OneDrive
    const authorizationCode = req.query.code;
  
    request.post(
      {
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        form: {
          redirect_uri: process.env.REDIRECT_URI,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: authorizationCode,
          grant_type: 'authorization_code'
        }
      },
      function (error, response, body) {
        const accessToken = JSON.parse(body).access_token;
  
        fs.readFile(file, function (err, data) {
          if (err) {
            console.error(err);
            return;
          }
  
          request.put(
            {
              url: `https://graph.microsoft.com/v1.0/drive/root:/${onedrive_folder}/${onedrive_filename}:/content`,
              headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': mime.getType(file)
              },
              body: data
            },
            function (err, response, body) {
              if (err) {
                console.error(err);
                return;
              }
            //   const downloadUrl = JSON.parse(body)['@microsoft.graph.downloadUrl'];
              const accessUrl = JSON.parse(body)['webUrl'];
            //   console.log('URL de descarga:', downloadUrl);
              console.log('URL de acceso:', accessUrl);
            //   res.send({downloadUrl, accessUrl});
              res.send(accessUrl);
            }
          );
        });
      }
    );
  } 

module.exports = {authUpload, uploadFiles}
