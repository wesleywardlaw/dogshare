var express = require("express");
var router = express.Router({mergeParams:true});  //mergeParams makes sure params pass when using shortened routes
var Dog = require("../models/dog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req,res){
	//find campground by id
	Dog.findById(req.params.id, function(err, dog){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {dog:dog});
		}
	})

});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
	//lookup dog using id
	Dog.findById(req.params.id, function(err, dog){
		if(err){
			console.log(err);
			res.redirect("/dogs");
		} else{
			//create new comment
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect comment to dog
					dog.comments.push(comment);
					dog.save();
					//redirect to show page
					req.flash("success", "Successfully added comment");
					res.redirect("/dogs/" + dog._id);
				}
			})
		}
	})
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Dog.findById(req.params.id, function(err,foundDog){
		if(err||!foundDog){
			req.flash("error", "Dog not found");
			return res.redirect("/dogs");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("/back");
			} else{
				res.render("comments/edit", {dog_id:req.params.id, comment: foundComment});
			}
		});
	});
	
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/dogs/" + req.params.id);
		}
	});
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	//findbyidandremove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "Comment deleted");
			res.redirect("/dogs/" + req.params.id);
		}
	});
});


module.exports = router;