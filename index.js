const app = require("./src/app");
const { sequelize } = require("./src/db");
// Iniciar el servidor

sequelize.sync({ force: false }).then(() => {
  const port =5000 || process.env.PORT; // Puedes cambiar el número de puerto si lo deseas
  app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
  });
});
