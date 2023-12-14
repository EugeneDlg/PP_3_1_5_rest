const allUsersURL = '/api/admin/getUsers';
const allRolesURL = '/api/admin/getRoles';
const currentUserURL = '/api/admin/getCurrentUser';

async function currentUserShow() {
    let currentUser = fetch(currentUserURL).then(response => response.json());
    currentUser.then(user => {
            console.log("Current user (object): " + user);
            document.getElementById("topnavbar-current-user").innerHTML = user.email;

            let roles = '';
            user.roles.forEach(role => {
                roles += role.roleName.replace("ROLE_", "  ");
            });
            document.getElementById("topnavbar-current-roles").innerHTML = roles;
        }
    );
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
                rolesString += role.roleName.replace("ROLE_", "  ");
            });
            allUsersString += "<tr><td>" + user.id + "</td><td>"
                + user.username + "</td><td>" + user.age + "</td><td>"
                + user.email + "</td><td>"
                + rolesString + "</td></tr>";
        }
    );
    // console.log("AllUsersTable Rows: " + allUsersString);
    document.getElementById("table-all-users-rows").innerHTML = allUsersString;
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

// ??? Нужно отобразить список полученных ролей в форме добавления нового юзера
//убрать ROLES_ из селектов!!!!!!

var handle201 = function(data, textStatus, jqXHR) {
    allUsersTableShow();
    $('#innerTab a:first').tab('show');
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
            // success: function(data){
            //     alert(data.ok);
            //     if (data.ok){
            //         alert("HURAY");
            //         // allUsersTableShow();
            //     }
            //     else {
            //         alert("Achtung!");
            //     }
            // },
            error: function (data) {
                console.log(data);
            }
        });
        return false;
    });

});