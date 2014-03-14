// Userlist data array for filling in the info box
var userListData = [];

// DOM Ready =========================================
$(document).ready(function() {
    //Populate the user table on initial page load.
    populateTable();

    //On show user click.
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    //Add user button click.
    $('#btnAddUser').on('click', addUser);
    //On delete user click.
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

//Functions =========================================

//Fill table with data
function populateTable() {
    var tableContent = '';

    //AJAX call to get the JSON userlist
    $.getJSON( '/userlist', function( data ) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        
        //For each item in the returned JSON, add a table row and cells to the content.
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
            tableContent += '<td>' +this.email+ '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Delete</a></td>';
            tableContent += '</tr>'
        });

     //Inject the whole table into the existing table.
     $('#userList table tbody').html(tableContent);
    });
};

//Show User Details

function showUserInfo(event) {

    //prevent the link from firing
    event.preventDefault();

    //retrieve the relevant username
    var thisUserName = $(this).attr('rel');

    //Get index of object based on username
    var arrayPosition = userListData.map(function(arrayItem) {return arrayItem.username; }).indexOf(thisUserName);

    //Get the user object
    var thisUserObject = userListData[arrayPosition];

    //Populate the info box:
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};


function addUser(event) {
    event.preventDefault();

    //Basic validation...
    var errorCount = 0
    $('#addUser input').each(function(index,val) {
        if($(this).val() === '') {errorCount++;}
    });

    if (errorCount === 0) {
      var newUser = {
        'username': $('#addUser fieldset input#inputUserName').val(),
        'email': $('#addUser fieldset input#inputUserEmail').val(),
        'fullname': $('#addUser fieldset input#inputUserFullname').val(),
        'age': $('#addUser fieldset input#inputUserAge').val(),
        'location': $('#addUser fieldset input#inputUserLocation').val(),
        'gender': $('#addUser fieldset input#inputUserGender').val()
      }

      $.ajax({
          type: 'POST',
          data: newUser,
          url: 'adduser',
          dataType: 'JSON'
      }).done(function( response ) {
          //Check for successful (blank) response
          if (response.msg === '') {
              //Clear form inputs
              $('#addUser fieldset input').val('');

              //Update the table
              populateTable();

          }
          else {

              alert('Error: ' + response.msg);
          }
      });
    } else {
        alert ('Please fill in all the fields!');
        return false;
    }
};
              

function deleteUser(event) {
    event.preventDefault();

    var confirmation = confirm('Are you sure you want to delete this user?');

    if (confirmation === true) {
        //Perform the delete
        $.ajax({
            type: 'DELETE',
            url: '/deleteuser/' +$(this).attr('rel')
        }).done(function ( response ) {
            //check for success (blank response)
            if (response.msg === '') {
            }
            else {
                alert('Error: ' +response.msg);
            }

            //update the table
            populateTable();

        });
    }
    else
    {
        return false
    }
}
        
