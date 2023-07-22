const sharp = require("sharp");
const async = require("async");
const fs = require("fs");
const path = require("path");
const sleep = require("util").promisify(setTimeout);
const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;

const key = "292641e03431470eb7f5c30132318dd7";
const endpoint = "https://erpocr.cognitiveservices.azure.com";

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

function Ocr(req, res) {
  const { imagen } = req.files;
  const {token} = req.body
  console.log(imagen);
  let imgs;
  let imagePath;
  let imageBuffer;
  let uploadPath;
  imgs = req.files.imagen;
  console.log(token)
  uploadPath = `uploads/${imgs.name}`;
  imgs.mv(`${uploadPath}`, (err) => {
    if (err) return res.status(500).send(err);
 
    const anchoDeseado = 800;
    const altoDeseado = 600;

    // Utilizar una promesa para esperar a que la imagen se guarde
    const resizeImage = new Promise((resolve, reject) => {
      sharp(uploadPath)
      .resize(anchoDeseado, altoDeseado, { fit: 'inside' })
      .toFile(`uploads/imagenrender.png`, (err) => {
        if (err) {
          console.error("Error al redimensionar la imagen:", err);
          reject(err);
        } else {
          console.log("Imagen redimensionada correctamente.");
          resolve();
        }
      });
    });

    // Continuar con el resto de la lógica después de que la imagen se haya redimensionado
    resizeImage
      .then(() => {
        // Aquí puedes realizar otras operaciones con la imagen redimensionada
        // o enviar una respuesta al cliente, si es necesario.
        imagePath = "uploads/imagenrender.png";
        imageBuffer = fs.readFileSync("uploads/imagenrender.png");
        let texto = "";
        let texto1 = [];
        let cont = 0;
        async.series(
          [
            async function () {
              console.log("-------------------------------------------------");
              console.log("READ PRINTED, HANDWRITTEN TEXT AND PDF");
              console.log();
      
              console.log(
                "Read printed text from local file:",
                imagePath.split("/").pop()
              );
              const printedResult = await readTextFromStream(
                computerVisionClient,
                imageBuffer
              );
              printRecText(printedResult);
      
              async function readTextFromStream(client, image) {
                let result = await client.readInStream(image);
                let operation = result.operationLocation.split("/").slice(-1)[0];
      
                while (result.status !== "succeeded") {
                  await sleep(1000);
                  result = await client.getReadResult(operation);
                }
                return result.analyzeResult.readResults;
              }
      
              async function printRecText(readResults) {
                console.log("Recognized text:");
      
                for (const page in readResults) {
                  if (readResults.length > 1) {
                    console.log(`==== Page: ${page}`);
                  }
                  const result = readResults[page];
                  if (result.lines.length) {
                    for (const line of result.lines) {
                      // line.words.map((w) =>{
      
                      //   texto1.push({
                      //     name:w.text,
                      //     num:cont++
                      //   })
                      // })
                      texto += line.words.map((w) => w.text).join(" ") + " ";
                      // texto1.push({
                      //   name: line.words.map((w) => w.text).join("  "),
                      //   num: cont++,
                      // });
                      // console.log( line.words.map((w) => w.text).join(" "));
                    }
                  } else {
                    console.log("No recognized text.");
                  }
                }
                // await fs.unlink(uploadPath);
              }
            },
          ],
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: "Error al procesar la imagen" });
            } else {
              let obj;
              let iva;
              let rete;
              const regexReciboCajaMenor =
                /(RECIBO DE CAJA MENOR)|(CAJA MENOR)|(CAJA MENOR)/i;
              if (regexReciboCajaMenor.test(texto)) {
                const fechaRegex = /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/;
                const fechaMatch = texto.match(fechaRegex);
                const fecha = fechaMatch ? fechaMatch[1] : null;
                console.log("Fecha:", fecha); // Output: 7/6/2023
      
                const cantidadRegex = /\$\s*([\d.,\s]+)/;
                const cantidadMatch = texto.match(cantidadRegex);
                let cantidad = null;
                if (cantidadMatch) {
                  const cantidadSinSeparadores = cantidadMatch[1].replace(
                    /[^\d]/g,
                    ""
                  );
                  cantidad = parseFloat(cantidadSinSeparadores.replace(",", "."));
                  iva = (cantidad * 19) / 100;
                  rete = (cantidad * 4) / 100;
                }
                console.log("total pagar:", cantidad);
      
                const pagadoRegex = /PAGADO A:\s*([^:]+)\s+(?:por )?CONCEPTO/i;
                const pagadoMatch = texto.match(pagadoRegex);
                const pagadoA = pagadoMatch ? pagadoMatch[1].trim() : null;
                console.log("Pagado a:", pagadoA);
      
                const valorRegex =
                  // /(?:POR|por)?\s*(?:CONCEPTO|concepto) DE:\s*([^:\n]+)\s*VALOR \(en letras\) CÓDIGO FIRMA DE RECIBIDO/i;
                  // /(?:POR\s+)?(?:CONCEPTO(?:\s+DE)?:\s*|CONCEPTO\s+DE\s+)?([^:\n]+)\s*VALOR \(en letras\) CÓDIGO FIRMA DE RECIBIDO/i;
                  // /PAGADO A:\s*([^:]+)\s+CONCEPTO/i;
                  // /(?:CONCEPTO|POR CONCEPTO DE:)\s*([^V]+)\s*VALOR/i;
                  /(?:CONCEPTO|POR CONCEPTO DE:)\s*([^V]+)(?:VALOR|la suma de)/i;
                const valorMatch = texto.match(valorRegex);
                const valor = valorMatch ? valorMatch[1].trim() : null;
                console.log("concepto:", valor);
      
                const codigoRegex = /CÓDIGO(?: FIRMA DE RECIBIDO)?\s*(\d+)/i;
                const codigoMatch = texto.match(codigoRegex);
                const codigo = codigoMatch ? codigoMatch[1].trim() : null;
                console.log("Código:", codigo);
      
                // const noRegex = /(?:NIT|NO|FIRMA DE RECIBIDO APROBADO|NIT.|NO.|No.|No)\s*([\d\s]+)/i;
                // const noMatch = texto.match(noRegex);
                // const no = noMatch ? noMatch[1] : null;
                // console.log("nit o cc:", no); // Output: 7038626003
      
                const noRegex =
                  /(?:NIT|NO|FIRMA\s+DE\s+RECIBIDO\s+APROBADO|NIT\.?|NO\.?|No\.?|No)\s*([\d\s]+)/i;
                const noMatch = texto.match(noRegex);
                const no = noMatch ? noMatch[1].trim() : null;
                console.log("nit o cc:", no);
      
                obj = {
                  nit: no,
                  numFact: codigo,
                  doc: no,
                  total: cantidad,
                  nombre: pagadoA,
                  fecha: fecha,
                  iva,
                  rete,
                  concepto:valor
                };
              }
              res.json(obj);
            }
          }
        );
      })
      .catch((error) => {
        // Manejar cualquier error que ocurra durante el redimensionamiento de la imagen
        res.status(500).send("Error al redimensionar la imagen.");
      });
  });

 
}

module.exports = Ocr;
