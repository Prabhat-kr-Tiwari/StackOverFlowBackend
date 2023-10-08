async function LoginController(request, response) {
   

        //1 data from req body
        const {email,password}=request.body
        //2 check user using email in user collection
        // if present then 
            // email and password check
        // else
            // user credential invalid
    
        const user= await db.collection('user').findOne({email})
        // console.log(user)
    
        if(user&&user.password===password){
            response.send(user)
            console.log("User logged in successfully");
        }else{
    
            console.error("Failed to login");
            response.status(401).json({ error: "Invalid credentials" });
        }
    
        // res send {user_id, username, email} except password'
       // response.send(login)

}

module.exports =  LoginController