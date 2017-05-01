//CREATE AN ARRAY TO STORE USERS
var users = [];

$(document).ready(function() {
    //PARSE THAT PATH NAME FROM /CHIRPS/SOMETHING/UPDATE TO AN ARRAY (IE ['', 'CHIRPS', 'SOMETHING', 'UPDATE'])
    var id = window.location.pathname.split("/")[2];
    var message = "HELLO DARKNESS MY OLD FRIEND";
    message.split(" ");
    //MAKE A GET REQUEST TO USERS AND POPULATE THE USERS ARRAY
    $.get("http://localhost:3000/api/users", function(data) {
        data.forEach(function(user) {
            users.push(user.name);
        })
    })
    //GET THAT INDIVIDUAL CHIRP FROM THE DATABASE
    $.get("http://localhost:3000/api/chirps/" + id, function(data) {
        //SAVE IT TO A VARIABLE CALLED CHIRP
        var chirp = data[0];
        //CREATE AN UPDATE BUTTON 
        var upBtn = $("<button>Update!</button>");
        //WHEN CLICKED, SEND A 'PUT' REQUEST TO THE SERVER WITH THE UPDATED CHIRP MESSAGE
        upBtn.click(function() {
            var obj = {
                message: $("#message").val()
            }
            $.ajax({
                method: "PUT",
                url: "http://localhost:3000/api/chirps/" + id, 
                data: JSON.stringify(obj),
                contentType: "application/json"
            }).then(function(data) {
                //IF SUCCESSFUL, GO BACK TO THE MAIN SINGLE_VIEW PAGE
                console.log("SUCCESS!");
                window.location.href = "http://localhost:3000/chirps/" + id
            }, function(err) {
                console.log(err);
            })
        })
        //APPEND THE ELEMENTS TO THE PAGE THAT ARE REPRESENTATIVE OF THE CHIRP'S PROPERTIES
        $("body").append(
            //GET A NAME FROM THE USERS ARRAY USING THE CHIRP USERID PROPERTY
            $("<h1>" + users[chirp.userId - 1] + "</h1>"),
            //SET THE VALUE OF THE INPUT BOX TO BE THE CHIRP'S MESSAGE
            $("<input id='message' type='text'></input>").val(chirp.message),
            upBtn
        )
    });
});