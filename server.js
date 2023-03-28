require("dotenv").config() ; 
const express = require("express"); 
const session = require("express-session"); 
const MongoStore = require("connect-mongo"); 
const methodOverride = require("method-override"); 
const globalErrHandler = require("./Middlewares/globalHandlers");
const commentsRoute = require("./routes/comments/Comments");
const postRoute = require("./routes/posts/Posts");
const userRoute = require("./routes/user/Users");
const Post = require("./models/post/Post");
const { truncatepost } = require("./utilis/helper");
require("./config/dbconfig"); 

const app = express() ; 

//middlewares 
app.set("view-engine","ejs"); 

app.use(express.static(__dirname + "/public")); 

app.use(express.json()); 

app.use(express.urlencoded({extended:true})); 

app.use(methodOverride("_method")); 
app.use(session({
    secret: process.env.SessionKey , 
    resave : false , 
    saveUninitialized : true , 
    store: new MongoStore({
        mongoUrl : process.env.MongoUrl , 
        ttl: 24*60*60 ,
    }),
})); 

app.locals.truncate = truncatepost ; 

app.use((req,res,next)=>{
    if(req.session.userAuth)
    {
        res.locals.userAuth = req.session.userAuth ; 
    }
    else
    {
        res.locals.userAuth = null ; 
    }
    next() ; 
}); 
//serving the static pages

app.get("/", async(req,res)=>{
    try {
        const posts = await Post.find().populate("user") ; 
        res.render("home.ejs",{posts}); 
    } catch (error) {
        res.render("home.ejs",{error:error.message}); 
    }
}); 
//Users Routes 
app.use("/api/v1/users",userRoute); 


//comments Routess
app.use("/api/v1/comments",commentsRoute); 

// Posts Routess 

app.use("/api/v1/posts",postRoute); 


app.use(globalErrHandler); 
const PORT = process.env.PORT || 7000 ; 
app.listen(PORT , (req,res)=>{
    console.log(`Server started on the port no ${PORT}`);
}); 

