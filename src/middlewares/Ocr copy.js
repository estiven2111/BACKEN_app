const Tesseract = require("tesseract.js");
const path = require("path");
const fs_extra = require("fs-extra");
const { Client } = require("@microsoft/microsoft-graph-client");
const fs = require("fs");
const Jimp = require("jimp"); //! organizar pixeles de imagenes
const pdf2pic = require("pdf2pic"); //!convertir de pdf a jpg

// const { createCanvas, loadImage } = require("canvas");
// const multer = require('multer')
const Ocr = async (req, res) => {
  // await fs_extra.unlink(`./Conversor-de-imagen-a-texto-en-Chrome (1).png`);
  const { imagen } = req.files;
  console.log(imagen);
  let imgs;
  let uploadPath;
  imgs = req.files.imagen;
  uploadPath = `uploads/${imgs.name}`;
  imgs.mv(`${uploadPath}`, (err) => {
    if (err) return res.status(500).send(err);
  });

  try {
    //! convertir pdf a jpg  pdfPath=ruta donde esta la img, page= la 1 o la pagina que se desea convertir
    // const converter = pdf2pic.default({
    //   density: 100,   // Densidad de la imagen en DPI (puntos por pulgada)
    //   format: 'jpg',  // Formato de imagen de salida
    //   size: '600x800', // Tamaño de la imagen de salida (ancho x alto)
    //   quality: 100    // Calidad de la imagen de salida (valor de 0 a 100)
    // });

    // const result = await converter.convert(pdfPath, page, '__output.jpg');
    // return result.path;

    // Jimp.read(`uploads/${imgs.name}`, (err, image) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }

    //   // Aquí puedes realizar las mejoras en la imagen

    //   // Obtener los píxeles de la imagen
    //   image.scan(
    //     0,
    //     0,
    //     image.bitmap.width,
    //     image.bitmap.height,
    //     function (x, y, idx) {
    //       // Obtener los valores de los canales de color (rojo, verde, azul) del píxel actual
    //       // const red = this.bitmap.data[idx + 0];
    //       // const green = this.bitmap.data[idx + 1];
    //       // const blue = this.bitmap.data[idx + 2];
    //        const black = this.bitmap.data[idx];
    //       // Ajustar los niveles de color
    //       const threshold = 100; // Valor de umbral para determinar los límites de ajuste
    //       // // Si el valor del canal de color negro supera el umbral, se ajusta a un valor mayor
    //       if (black > threshold) {
    //         this.bitmap.data[idx] = 255; // Máximo valor para el canal de color negro
    //       }
    //       // // Si el canal rojo es mayor que el umbral, se ajusta a un valor máximo
    //       //   if (red > threshold) {
    //       //     this.bitmap.data[idx + 0] = 100; // Máximo valor para el canal rojo
    //       //   }
    //       //   // Si el canal verde es mayor que el umbral, se ajusta a un valor mínimo
    //       //   if (green > threshold) {
    //       //     this.bitmap.data[idx + 1] = 0; // Mínimo valor para el canal verde
    //       //   }
    //       //   // Si el canal azul es mayor que el umbral, se ajusta a un valor mínimo
    //       //   if (blue > threshold) {
    //       //     this.bitmap.data[idx + 2] = 0; // Mínimo valor para el canal azul
    //       //   }
    //     }
    //   );

    //   // Ajustar brillo y contraste
    //   image.brightness(0.1).contrast(0.2);

    //   // // Ecualizar el histograma

    //   image.normalize();

    //   // // Aplicar filtrado de ruido
    //   // image.gaussian(1);

    //   // // Mejorar nitidez
    //   // image.convolute([
    //   //   [-1, -1, -1],
    //   //   [-1, 9, -1],
    //   //   [-1, -1, -1],
    //   // ]);

    //   // // Corregir el balance de blancos
    //   // image.color([{ apply: 'desaturate', params: [20] }]);

    //   image.write(`uploads/proce${imgs.name}`, (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }

    //     console.log("Imagen procesada guardada correctamente.");
    //   });
    // });

    const { createWorker } = Tesseract;
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(`uploads/${imgs.name}`);
    await worker.terminate();

    //! EXPRESSIONES REGULARES
    const regexNetDoe = /MET\/Doe:\s+(.+)/;
    const regexFacturaVenta = /Factura de venta: No.\s+(.+)/;
    const regexNumeroDocumento = /Namero de Documento:\s+(.+)/;
    // const regexValorAPagar = /VALOR A PAGAR:\)\s+\$(.+)/;
    const regexValorAPagar = /\$([\d,.]+)/;
    const regexNombre = /FIERRO § BURGER ESPERANZA/;
    const regexfecha = /Fecha Factwia: ([\d\/:\s]+[ap]\.m\.)\s*;/;

    const matchNetDoe = text.match(regexNetDoe);
    const matchFacturaVenta = text.match(regexFacturaVenta);
    const matchNumeroDocumento = text.match(regexNumeroDocumento);
    const matchValorAPagar = text.match(regexValorAPagar);
    const matchNombre = text.match(regexNombre);
    const matchFecha = text.match(regexfecha);

    const netDoe = matchNetDoe ? matchNetDoe[1] : null;
    const facturaVenta = matchFacturaVenta ? matchFacturaVenta[1] : null;
    const numeroDocumento = matchNumeroDocumento
      ? matchNumeroDocumento[1]
      : null;
    const valorAPagar = matchValorAPagar ? matchValorAPagar[1] : null;
    const Nombre = matchNombre ? matchNombre[0] : null;
    const fechafactura = matchFecha ? matchFecha[0] : null;
    const obj = {
      nit: netDoe,
      numFact: facturaVenta,
      doc: numeroDocumento,
      total: valorAPagar,
      nombre: Nombre,
      fecha: fechafactura,
    };
    // console.log("NET/Doe:", netDoe);
    // console.log("Factura de venta: No.", facturaVenta);
    // console.log("Nimero de Documento:", numeroDocumento);
    // console.log("VALOR A PAGAR:) $", valorAPagar);
    // console.log("la fecha es ",fechafactura)
    console.log(text);
    res.send(obj);
  } catch (error) {
    return res.send(error);
  }
};

//!validar onedrive

// const Ocr = async (req, res) => {
//   const { img } = req.files;
//   let imagen;
//   let uploadPath;
//   imagen = req.files.img;
//   uploadPath = `uploads/${imagen.name}`;
//   imagen.mv(`${uploadPath}`, (err) => {
//     if (err) return res.status(500).send(err);
//   });

//   const accessToken = "422ce85a-4ac3-4bc8-8429-c79ab5d86930";
//   const folderId = "folderId";
//   const imagePath = uploadPath;
//   const imageName = imagen.name;

//   try {
//     await getFoldersInOneDrive(accessToken);
//     res.send("finss");
//     return;
//   } catch (error) {
//     res.send(error);
//   }
//   uploadImageToOneDrive(accessToken, folderId, imagePath, imageName).catch(
//     (error) => {
//       console.error("Error al subir la imagen:", error);
//     }
//   );
// };

// async function getFoldersInOneDrive(accessToken) {
//   const client = Client.init({
//     authProvider: (done) => {
//       done(null, accessToken);
//     },
//   });

//   const response = await client.api("/me/drive/root/children").get();
//   console.log("eeeeeeeeeeeeeeeeeeeeeeeee", response);
//   if (response && response.value) {
//     console.log("Carpetas en OneDrive:", response.value);
//   } else {
//     console.error("Error al obtener las carpetas de OneDrive.");
//   }
// }

// async function uploadImageToOneDrive(
//   accessToken,
//   folderId,
//   imagePath,
//   imageName
// ) {
//   const client = Client.init({
//     authProvider: (done) => {
//       done(null, accessToken);
//     },
//   });

//   const content = fs.readFileSync(imagePath);

//   const response = await client
//     .api(`/me/drive/items/${folderId}/children`)
//     .post({
//       name: imageName,
//       content: content,
//     });
//   console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", response);
//   if (response && response.id) {
//     console.log("La imagen se ha subido correctamente a OneDrive.");
//   } else {
//     console.error("Error al subir la imagen a OneDrive.");
//   }
// }

module.exports = Ocr;
