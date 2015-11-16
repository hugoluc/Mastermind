
  var fbUserId;

  function checkLoginState() {
    console.log("checkloginstate");
    
    FB.getLoginStatus(function(response) {
      console.log(response);
      if(response.status === "connected"){
        console.log("connected");
       window.location = "http://104.131.172.143:3000/PDS/Mastermind/game.html";
      }else{
        // display login screen
        console.log("not logged in");
        fbButton = '<div onclick="fb_login();">Click Here to login</div>'
        document.body.innerHTML = fbButton;
      }

    });
  }

  window.fbAsyncInit = function() {
    console.log("init");
    FB.init({
      appId      : '132076473559948',
      xfbml      : true,
      version    : 'v2.4'
    });
    checkLoginState();
  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


function testAPI() {

  console.log("----------------------------");

  FB.api( "/me", function (response) {
      if (response && !response.error) {
        console.log(document.cookie);
      }
    }
  );
}


function fb_login(){

  FB.login(
    function(response){
      console.log(response);
    }
  );

  console.log("fblogin clicked!!"); 

}