const allUsersURL = '/api/admin/getUsers';
const currentUserURL = '/api/admin/getCurrentUser';

// const allUsers = fetch(allUsersURL).then(response => response.json());
const currentUser = fetch(currentUserURL).then(response => response.json());

// document.getElementById("topnavbar-current-user").innerHTML = currentUser;
// console.log("AAA:" + currentUser.email);
currentUser.then(user => {
        document.getElementById("topnavbar-current-user").innerHTML = user.email;
        console.log("AAA:" + user.email);
    }
)