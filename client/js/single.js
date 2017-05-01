//CREATE AN ARRAY IN WHICH TO STORE OUR USER NAMES
var users = [];

$(document).ready(function() {
    //MAKE A GET REQUEST TO /USERS AND POPULAR THE USERS ARRAY
    $.get("http://localhost:3000/api/users", function(data) {
        data.forEach(function(user) {
            users.push(user.name);
        })
    })
    //GET A SINGLE CHIRP'S INFORMATION FROM THE SERVER
    $.get("http://localhost:3000/api" + window.location.pathname, function(data) {
        var chirp = data[0];
        //CREATE A DELETE BUTTON THAT, WHEN CLICKED, DELETES THE CHIRP FROM THE DATABASE 
        var delBtn = $("<button>Delete!</button>");
        delBtn.click(function() {
            $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/api" + window.location.pathname
            }).done(function(data) {
                window.location.href = "http://localhost:3000/chirps";
            })
        })
        //PUT ELEMENTS REPRESENTATIVE OF THE CHIRP'S PROPERTIES ON THE PAGE 
        $("body").append(
            $("<h1>User: " + users[chirp.userId - 1] + "</h1>"),
            $("<h2>Message: " + chirp.message + "</h2>"),
            $("<h2>" + chirp.TIMESTAMP + "</h2>"),
            $("<a href='" + window.location.pathname + "/update'>Edit!</a>"),
            delBtn
        );
    })
})