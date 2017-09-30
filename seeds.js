var mongoose = require("mongoose");
var Dog = require("./models/dog");
var Comment = require("./models/comment");

var data = [
	{
		name: "Jill",
		image: "https://farm4.staticflickr.com/3373/3600836516_ab924c6729.jpg",
		description: "I like long walks on the beach, dog treats, and chasing frisbees.  I am available for petting anytime.  Sometimes it seems like I am barking at nothing, but I assure you there is danger.  "
	},
	{
		name: "Will",
		image: "https://farm8.staticflickr.com/7063/7026318953_e9e96a5c39.jpg",
		description: "I like long walks on the beach, dog treats, and chasing frisbees.  I am available for petting anytime.  Sometimes it seems like I am barking at nothing, but I assure you there is danger.  "
	},
	{
		name: "Frill",
		image: "https://farm6.staticflickr.com/5308/5652496789_70e6f301e9.jpg",
		description: "I like long walks on the beach, dog treats, and chasing frisbees.  I am available for petting anytime.  Sometimes it seems like I am barking at nothing, but I assure you there is danger.  "
	},
];

function seedDB(){
	//remove all dogs
	Dog.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("Removed all dogs!");
		//add a few dogs
		data.forEach(function(seed){
			Dog.create(seed,function(err, dog){
				if(err){
					console.log(err);
				} else{
					console.log("Added a dog!");
					Comment.create({text:"This is a great dog, but I wish it had five legs", author:"Bill Billings"}, function(err, comment){
						
						if(err){
							console.log(err);
						} else {
							dog.comments.push(comment);
							dog.save();
							console.log("Created new comment");
						}
						
					})
				}
			});
		})
	});

	


	//add a few commments
}

module.exports = seedDB;
