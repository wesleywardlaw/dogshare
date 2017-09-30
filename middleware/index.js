var Dog = require("../models/dog");
var Comment = require("../models/comment");


//all the middleware goes here

middlewareObj = {};

middlewareObj.checkDogOwnership = function(req,res,next){
	//is user logged in
	if(req.isAuthenticated()){
		Dog.findById(req.params.id, function(err, foundDog){
			if(err || !foundDog){
				req.flash("error", "Dog not found");
				res.redirect("/dogs");
			} else{
				//does the user own the dog
				if(foundDog.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	//is user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found");
				res.redirect("/dogs");
			} else{
				//does the user own the comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}




module.exports = middlewareObj;