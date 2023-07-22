const { Router } = require("express");
const userRouter = require("./userRouter");
const ProyectRouter = require("./proyectRouter");

const router = Router();

router.use("/user", userRouter);
router.use("/user/api/proyect", ProyectRouter);

module.exports = router;
