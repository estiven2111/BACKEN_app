const jwt = require("jsonwebtoken");
const secretKey = "tu_clave_secreta"; // Reemplaza con tu clave secreta

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Acceso no autorizado" });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Acceso no autorizado" });
  }
};

// ...
