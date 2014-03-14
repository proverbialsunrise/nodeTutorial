
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.helloworld = function(req, res){
    res.render('helloworld', { title: 'Hello, World!' });
};

exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });
    };
};

exports.newuser = function(req, res) {
    res.render('newuser', {title: 'Add New User'});
};

exports.adduser = function(db) {
    return function(req, res) {

        //Get the form values using the 'name' attribute of the input form
        var userName = req.body.username;
        var userEmail = req.body.useremail;

        //Set the collection we want to use
        var collection = db.get('usercollection');

        //Submit the new item
        collection.insert({
            "username" : userName,
            "email" :userEmail
        }, function (err, doc) {
            if (err) {
                //Return an error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                //If it worked set the header in the address bar
                res.location("userlist")
                //and redirect there
                res.redirect("userlist")
            }
        });

    }
}
