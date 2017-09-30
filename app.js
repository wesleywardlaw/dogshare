var express = require('express'),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Dog = require("./models/dog"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
	dogRoutes	  = require("./routes/dogs"),
	indexRoutes   = require("./routes/index");



mongoose.connect("mongodb://localhost/dogshare");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "dogs are dogarrific",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);  // the slash is just so it matches pattern of providing string first
app.use("/dogs", dogRoutes);
app.use("/dogs/:id/comments", commentRoutes);


app.listen(process.env.port||3090, process.env.IP, function(){
	console.log("The DogShare Server has Started");
});

