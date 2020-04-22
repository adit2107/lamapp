function login(e){
    e.preventDefault();  
    window.location.replace(`https://${process.env.cog_client_name}.auth.${process.env.cog_region}.amazoncognito.com/login?response_type=code&client_id=${process.env.cog_client_id}&redirect_uri=${process.env.redirecturi}&state=STATE&scope=openid+profile+aws.cognito.signin.user.admin`);
}