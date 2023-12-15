const allUsersURL = '/api/admin/getUsers';
const allRolesURL = '/api/admin/getRoles';
const currentUserURL = '/api/admin/getCurrentUser';

async function currentUserShow() {
    let currentUser = fetch(currentUserURL).then(response => response.json());
    currentUser.then(user => {
        console.log("Current user (email): " + user.email);
        document.getElementById("topnavbar-current-user").innerHTML = user.email;
        let roles = '';
        user.roles.forEach(role => {
            roles += role.roleName.replace("ROLE_", "  ");
        });
        document.getElementById("topnavbar-current-roles").innerHTML = roles;
        document.getElementById("table-current-user-rows").innerHTML = "<tr><td>" + user.id + "</td><td>"
            + user.username + "</td><td>" + user.age + "</td><td>"
            + user.email + "</td><td>"
            + roles + "</td></tr>";
    });
}


async function getAllRoles() {
    let rolesListResponse = await fetch(allRolesURL);
    rolesListJson = await rolesListResponse.json();
    rolesListJson.forEach(role => {
        role.roleName = role.roleName.replace("ROLE_", "");
        // rolesArray.push(role);
    });


}

async function allUsersTableShow() {
    let allUsersResponse = await fetch(allUsersURL);
    if (!allUsersResponse.ok) {
        alert("Error in allUsersTable get function");
        return;
    }
    let allUsersListJson = await allUsersResponse.json();
    let allUsersString = '';
    allUsersListJson.forEach(
        user => {
            let rolesString = '';
            user.roles.forEach(role => {
                rolesString += role.roleName.replace("ROLE_", "");
            });
            allUsersString += "<tr><td>" + user.id + "</td><td>"
                + user.username + "</td><td>" + user.age + "</td><td>"
                + user.email + "</td><td>"
                + rolesString + "</td><td><button type='button' class='btn btn-info' data-bs-toggle='modal' data-bs-target='#edit" + user.id + "'>Edit</button></td><div class='modal fade' tabindex='-1' id='edit" + user.id +"' role='dialog' aria-labelledby='editModalLabel' aria-hidden='true'><div class='modal-dialog modal-dialog-scrollable' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Edit user</h5><button type='button' class='close' data-bs-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body text-center'><form method='POST' action='/admin/update?id=" + user.id +"'><input type='hidden' name='${_csrf.parameterName}' value='${_csrf.token}'/><div class='container'><div class='row justify-content-center '><div class='col-7'><div class='mb-1'><label class='fw-bold' for='username'>Username:</label></div><div class='mb-2'><input type='text' name='username'  value='" + user.username +"' id='username' required/></div><div class='mb-1'><label class='fw-bold' for='userPassword'>Password:</label></div><div class='mb-2'><input type='password' id='userPassword' required name='password' value=''/></div><div class='mb-1'><label class='fw-bold' for='email'>Email:</label></div><div class='mb-2'><input type='email' name='email' value='" + user.email + "' id='email' required /></div><div class='mb-1'><label class='fw-bold' for='age'>Age:</label></div><div class='mb-2'><input type='number' class='form-control' min='0' max='120' name='age' value='" + user.age + "' id='age' required /></div><div class='mb-1'><label class='fw-bold'>Role</label></div><div class='mb-2'><select class='form-select' aria-label='Role selection' id='roles" + user.id + "' name='roles' multiple='multiple'  size='2'></select></div></div></div></div><div class='modal-footer'><button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button><button type='submit' class='btn btn-primary'>Edit</button></div></form></div></div></div></div></tr>";
        }
    );
    // console.log("AllUsersTable Rows: " + allUsersString);
    document.getElementById("table-all-users-rows").innerHTML = allUsersString;
    let rolesListResponse = await fetch(allRolesURL);
    let rolesListJson = await rolesListResponse.json();
    rolesListJson.forEach(role => {
        role.roleName = role.roleName.replace("ROLE_", "");
        // document.getElementById("new_roles").options.add(
        //     new Option(role.roleName, role.id));
    });
    allUsersListJson.forEach(user => {
        rolesListJson.forEach( role => {
            document.getElementById("roles" + user.id).options.add(
                new Option(role.roleName, role.id, true, user.roles.includes(role)));
        });
    });

}

async function newUserFormShow() {
    let rolesListResponse = await fetch(allRolesURL);
    let rolesListJson = await rolesListResponse.json();
    rolesListJson.forEach(role => {
        role.roleName = role.roleName.replace("ROLE_", "");

        document.getElementById("new_roles").options.add(
            new Option(role.roleName, role.id));
    });
}



currentUserShow();
allUsersTableShow();
newUserFormShow();

// getAllRoles();
// (async () =>{
//     await getAllRoles();
// })();


//убрать ROLES_ из селектов!!!!!!

var handle201 = function(data, textStatus, jqXHR) {
    allUsersTableShow();
    $('#allusers-tab').tab('show');
};
$(document).ready(function () {
    $("#new-user-form").on("submit", function(){
        let roleList = [];
        for (let i = 0; i < new_roles.selectedOptions.length; i++) {
            roleList.push({
                id: new_roles.selectedOptions[i].value
            });
        }
        let jsonData = JSON.stringify({
            username: new_username.value,
            email: new_email.value,
            password: new_password.value,
            age: new_age.value,
            roles: roleList
        });
        alert(jsonData);
        //       csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        $.ajax({
            url: "/api/admin/create",
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: jsonData,
            statusCode: {
                201: handle201,
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false;
    });

});