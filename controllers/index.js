const LoginController = require("./loginController")
const RegisterController = require("./registerController")

const Authentication = require("./Authentication")
const Authentication2 = require("./Authentication")
// const auth = new Authentication()

const Controllers = {
    register: RegisterController,
    login: LoginController,
    // registration: auth.Login,
    registration2: Authentication2.register
}

module.exports = Controllers