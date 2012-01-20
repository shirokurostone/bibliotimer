$(function(){

  const SESSION_ID_PRESENTATION = 1;
  const SESSION_ID_QUESTION     = 2;
  const SESSION_ID_OVERTIME     = 3;
  const SESSION_ID_STOP         = 4;

  const SESSION_NAME_PRESENTATION = "発表時間";
  const SESSION_NAME_QUESTION     = "質問時間";
  const SESSION_NAME_OVERTIME     = "超過時間";
  
  var config = {
    presentation : 300,
    question     : 120
  };

  var session = SESSION_ID_STOP;
  var time = 300 * 1000;
  var totaltime = 300 * 1000;
  
  var timerid;
  var prevTime;
  
  var start = function(){
    session = SESSION_ID_PRESENTATION;
    totaltime = time = config.presentation*1000;
    prevTime = (new Date()).getTime();
    countdown();
  };

  var countdown = function(){
    var now = (new Date()).getTime();

    time -= now - prevTime;
    prevTime = now;

    var sec = parseInt(time/1000);
    
    if (time < 0){
      if (session == SESSION_ID_PRESENTATION){
        session = SESSION_ID_QUESTION;
        totaltime = time = config.question * 1000;
        $("#bell").get(0).play();
      }
      else if (session == SESSION_ID_QUESTION){
        session = SESSION_ID_OVERTIME;
        $("#bell").get(0).play();
      }
      else{
        sec = parseInt(-time/1000);
      }
    }

    draw(sec);
    timerid = setTimeout(countdown, 100);
  };

  var draw = function(tm){
    var min = parseInt(tm/60);
    var sec = parseInt(tm)%60;
    
    if (session == SESSION_ID_PRESENTATION ||
       session == SESSION_ID_STOP){
      $("#title").text(SESSION_NAME_PRESENTATION);
    }
    else if (session == SESSION_ID_QUESTION){
      $("#title").text(SESSION_NAME_QUESTION);
    }
    else{
      $("#title").text(SESSION_NAME_OVERTIME);
    }
        
    $('#timer').text(("0"+min).substr(-2)+":"+("0"+sec).substr(-2));

    if (session == SESSION_ID_OVERTIME){
      $("#progress").css("width", "100%");
    }
    else{
      $("#progress").css("width", (time/totaltime*100)+"%");
    }
    
  };

  var pause = function(){
    if (session == SESSION_ID_STOP){
      start();
      $("#start").text("stop");
      return;
    }
    
    if (timerid != undefined){
      $("#start").text("start");
      clearTimeout(timerid);
      timerid = undefined;
    }
    else{
      $("#start").text("stop");
      prevTime = (new Date()).getTime();    
      countdown();
    }    
  };

  var reset = function(){
    $("#start").text("start");
    if (timerid != undefined){
      clearTimeout(timerid);
      timerid = undefined;
    }

    totaltime = time = config.presentation*1000;
    prevTime = (new Date()).getTime();
    session = SESSION_ID_STOP;

    draw(config.presentation);
  };
  
  $("#start").click(function(){pause();});
  $("#reset").click(function(){reset();});

  $("#icon").click(function(){
    $("#window").css("display", "block");
    $("#shadow").css("display", "block");
  });

  $("#shadow").click(function(){
    $("#shadow").css("display", "none");
    $("#window").css("display", "none");
  });

  $("#sound").click(function(){
    $("#bell").get(0).play();
  });
  
  reset();
});