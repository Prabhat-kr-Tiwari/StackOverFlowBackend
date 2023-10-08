const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require('body-parser');
const Controllers = require("./controllers");
// const RegisterController = require("./controllers/registerController")


const url = "mongodb://prabhat:secret@127.0.0.1:27017/Queries";
let db;
(async () => {
  const client = await MongoClient.connect(url);
  db = client.db("Queries");
})();

const app = express();
app.use(bodyParser.json());



// app.post("/register", Controllers.register)
app.post("/register", async(request,response)=>{


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
 
    //  if (result.modifiedCount === 1) {
    //          console.log("User registered  successfully");
    //         } else {
    //           console.error("Failed to registered");
    //      }
     //3 send res user register successfully { id, username,  profile} except password

})
app.post("/login", async(request,response)=>{
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
})


// to insert question in db
// app.post("/questions", async (req, res) => {
//     // 1 req.body question details
//     const question = await Question.insertOne({req.body})
//     question.save()

//     res.json({message: "Created ladua lahsun!"})

// })


// for all question 
app.get("/questions", async (req, res) => {
    const questions = await db.collection('Query').find().toArray()
    res.json({data: questions})
})


// getting specific question from id 
// app.get("/questions/:id", async (req, res) => {
   
//    const {id} =  req.params
//    const questions = await db.collection('Query').findOne({_id: id})
//    console.log(questions)
//    res.send(questions)
// //    res.json({data: questions})
// })
app.get("/questions/:id", async (req, res) => {
    try {
       const { id } = req.params;
       const question = await db.collection('Query').findOne({ $or:  [{_id: {$eq: new ObjectId(id)} } , {createdBy: {$eq: id}}] });
       if (question) {
          console.log(question);
          res.send(question);
       } else {
          res.status(404).json({ error: 'Question not found' });
       }
    } catch (error) {
       console.error("Error while fetching question:", error);
       res.status(500).json({ error: 'Internal server error' });
    }
 });
 
//post a question

app.post('/postquestion',async (request,response) => {
    const {title,description,createdBy}=request.body
    const question =await db.collection('Query').insertOne({title:title,description:description,createdBy:createdBy})
    response.send(question)
    if (question.acknowledged === true) {
        console.log(" question posted  successfully");
       } else {
         console.error("Failed to posted");
    }

})
//reply to question
// app.post("/reply/:id", async(request,response)=>{

//     const {id}=request.params
//     const question=await db.collection('Query').findOne({_id:new ObjectId(id)})
//     const newReplies=request.body
//     question.replies.push(...newReplies)

//     // Update the document in the MongoDB collection
//    const result = await db.collection("Query")
//      .updateOne({ _id: new  ObjectId(postId) }, { $set: { replies: post.replies } });

//      console.log(result)
//     response.send(result)
//     if (result.modifiedCount === 1) {
//              console.log("New replies added successfully");
//            } else {
//              console.error("Failed to update the post");
//            }



// })
app.post("/reply/:id", async (request, response) => {
    const { id } = request.params;
    const newReplies = request.body.replies;

    try {
        // Find the question by its _id
        const question = await db.collection('Query').findOne({ _id: new ObjectId(id) });

        if (!question) {
            return response.status(404).json({ error: 'Question not found' });
        }

        // Add new replies to the question's replies array
        if (!question.replies) {
            question.replies = []; // Ensure that replies is an array
        }

        question.replies.push(...newReplies);

        // Update the document in the MongoDB collection
        const result = await db.collection("Query").updateOne(
            { _id: new ObjectId(id) },
            { $set: { replies: question.replies } }
        );

        if (result.modifiedCount === 1) {
            console.log("New replies added successfully");
            response.json({ message: "New replies added successfully" });
        } else {
            console.error("Failed to update the question with replies");
            response.status(500).json({ error: "Failed to update the question with replies" });
        }
    } catch (error) {
        console.error("Error while adding replies:", error);
        response.status(500).json({ error: "Internal server error" });
    }
});




// app.post("/reply", async (request, response) => {
//   const postId = "65229a2b94d8fa648fd82997";

//   const post = await db
//     .collection("Query")
//     .findOne({ _id: new  ObjectId(postId) });
//     console.log(post)
//   if (!post) {
//     console.error("Post not found");
//     return;
//   }

//   const repliesFromBody=request.body
   
//   // Add new replies to the post
//   const newReplies = [
//     {
//       id: 456,
//       replydescription: "A new reply",
//     },
//     {
//       id: 789,
//       replydescription: "Another new reply",
//     },
//   ];
// //   post.replies.push(...newReplies);
//   post.replies.push(...repliesFromBody);
//   // Update the document in the MongoDB collection
//   const result = await db
//     .collection("Query")
//     .updateOne({ _id: new  ObjectId(postId) }, { $set: { replies: post.replies } });

//     console.log(result)
//     response.send(result)
//   if (result.modifiedCount === 1) {
//     console.log("New replies added successfully");
//   } else {
//     console.error("Failed to update the post");
//   }
// });

// app.post("/postQuery", (request, response) => {});

// app.get("/", async (request, response) => {
//   try {
//     const data = await db.collection("Query").find().toArray();
//     response.send(data);
//   } catch (error) {
//     console.log(error);
//   }

//   // response.send('<h1>hello from express</h1>')
// });

app.listen(4000, (request, response) => {
  console.log("server listening on port 4000");
});
