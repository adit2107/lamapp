document.getElementById("loginbtn").addEventListener("click" , () => {
fetch(`https://mallapp21.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=${process.env.cog_client_id}&redirect_uri=http://localhost:3030/&state=STATE&scope=openid+profile+aws.cognito.signin.user.admin`, {
    method: 'GET'
})
.then(res => res.json())
.then(response => {
    console.log(response);
})
});