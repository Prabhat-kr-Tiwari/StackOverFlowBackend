async function RegisterController(request, response) {
   
        //1 getting data from req.body of the user
        const user_details=request.body
        
    
        //2 after checking confirm_password or password save users collection
        // {
        //     _id:'kjksn'
        //     email:email,
        //     password:password
        //     confirmpassword:password
        // }
        const register = await db.collection('user').insertOne(user_details)
        response.send(register)
    
        if (result.modifiedCount === 1) {
                console.log("User registered  successfully");
               } else {
                 console.error("Failed to registered");
            }
        //3 send res user register successfully { id, username,  profile} except password
  
}

module.exports =  RegisterController