$(document).ready(function () {
    function getToken() {
        let tokenString = document.cookie;
        const tokenSplit = tokenString.split("=")
        const tokenValue = tokenSplit[1];
        console.log(tokenValue);
        return {Authorization :'Bearer '+ tokenValue}
    }
    console.log(getToken())
});
