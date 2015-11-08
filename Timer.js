//------------------------------Timer class
function Timer(){

  var startTime;
  var currentTime;
  var elapsedTime;


  this.create = function (){
    startTime = millis();
  }

  this.reset = function(){
    startTime = millis();
    elapsedTime = 0;
  }

  this.realTime = function(){
    currentTime = millis();
    elapsedTime = currentTime - startTime;
    return elapsedTime;
  }


}