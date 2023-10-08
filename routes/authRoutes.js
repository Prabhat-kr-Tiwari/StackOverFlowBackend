const router = require("express").Router()
const RegisterController = require("../controllers/registerController")


router.post("/register", RegisterController)
// router.post("/login", )


module.exports = {router: authRoutes}