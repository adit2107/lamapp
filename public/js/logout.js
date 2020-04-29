document.getElementById("logoutbtn").addEventListener("click" , (e) => {
    e.preventDefault();
    window.location.replace("https://mallapp21.auth.us-east-1.amazoncognito.com/logout?client_id=7j5upal5ol8dh05qbpn2n1hbk8&logout_uri=http://localhost:3030/logout");
});