var express = require("express");
var router = express.Router();
var Dog = require("../models/dog");
var middleware = require("../middleware");


//INDEX ROUTE - show all dogs
router.get("/", function(req,res){
	//Get all campgrounds from db
	Dog.find({}, function(err, allDogs){
		if(err){
			console.log(err);
		} else {
			res.render("dogs/index", {dogs:allDogs}); //first name, then data
		}
	});
});

//CREATE ROUTE - add new dog to db
router.post("/", middleware.isLoggedIn, function(req,res){
	//get data from form and add to dogs array
	var name = req.body.name;
	var species = req.body.species;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newDog = {name:name, image:image, description: desc, author:author, species: species};
	//Create a new dog and save to db
	Dog.create(newDog, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			//redirect back to dogs page
			res.redirect("/dogs");
		}
	})
	
	
});

//NEW ROUTE - show form to create new dog
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("dogs/new");
});

//SHOW ROUTE - shows more info about one dog
router.get("/:id", function(req,res){
	//find dog with provided id
	Dog.findById(req.params.id).populate("comments").exec(function(err, foundDog){
		if(err||!foundDog){
			req.flash("error", "Dog not found");
			res.redirect("/dogs");
		} else {
			console.log(foundDog);
			//render show template with that dog
			res.render("dogs/show", {dog: foundDog});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkDogOwnership, function(req,res){
	Dog.findById(req.params.id, function(err, foundDog){
		res.render("dogs/edit", {dog:foundDog});
	}); 
});

//UPDATE ROUTE
router.put("/:id", middleware.checkDogOwnership, function(req,res){
	//find and update correct campground
	Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
		if(err){
			res.redirect("/dogs");
		} else{
			//redirect somewhere(show page)
			res.redirect("/dogs/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkDogOwnership, function(req,res){
	Dog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/dogs");
		} else{
			res.redirect("/dogs");
		}
	});
});





module.exports = router;