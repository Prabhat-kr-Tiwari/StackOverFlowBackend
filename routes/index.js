// const router = require("express").Router()
// const RegisterController = require("../controllers/registerController")

const authRoutes = require("./authRoutes");


// router.post("/register", RegisterController)
// // router.post("/login", )


const routes = {
    authRoute: authRoutes,
    user: userRoute,
    question: question
}

module.exports = routes