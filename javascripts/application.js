// globals
var megaplaya = false;
var search_visible = true;
var keyboard_disabled = false;

// parse any hashbangs and use that as search right away
$(document).ready(function(){
  load_player();
});

function load_player(){
  $('#player').flash({
    swf: 'http://vhx.tv/embed/megaplaya',
    width: '100%;',
    height: '100%',
    allowFullScreen: true,
    allowScriptAccess: "always"
  });
}

function megaplaya_loaded(){
  debug(">> megaplaya_loaded()");
  megaplaya = $('#player').children()[0];
  megaplaya_addListeners();
  load_urban_videos();
}

function megaplaya_call(method){
  // "pause" => megaplaya.api_pause();
  (megaplaya["api_" + method])();
}

function megaplaya_addListeners(){
  var events = ['onVideoFinish', 'onVideoLoad', 'onError', 'onPause', 'onPlay', 'onFullscreen', 'onPlaybarShow', 'onPlaybarHide', 'onKeyboardDown'];

  $.each(events, function(index, value) {
    megaplaya.api_addListener(value, "function() { megaplaya_callback('" + value + "', arguments); }")
  });
}

function megaplaya_callback(event_name, args) {
  switch (event_name) {
    case 'onVideoLoad':
      var video = megaplaya.api_getCurrentVideo();
      megaplaya.api_growl(video.word+': '+video.definition);
      debug(video);
    default:
      debug("Unhandled megaplaya event: ", event_name, args);
      break;
  }
}

function load_urban_videos(){
  var url = 'http://www.urbandictionary.com/iphone/search/videos?callback=load_urban_videos_callback&random=1';
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  document.documentElement.firstChild.appendChild(script);
}

function load_urban_videos_callback(resp){
  debug(">> load_urban_videos_callback() - adding listeners", resp);

  var urls = $.map(resp.videos, function (entry, i) {
    entry.url = "http://youtube.com/watch?v=" + entry.youtube_id;
    return entry;
  });
  debug(">> callback(): loading "+urls.length+" videos...");

  $('#player').show();
  $('#player').css('z-index', 10);

  urls = shuffle(urls);
  return megaplaya.api_playQueue(urls);
}

function handle_onvideoload(){
  debug('hi')
  debug('onvideoload', arguments);
}

function debug(string){
  try {
    if(arguments.length > 1) {
      console.log(arguments);
    }
    else {
      console.log(string);
    }
  } catch(e) { console.log('uh oh'); }
}

function shuffle(v){
  for(var j, x, i = v.length; i; j = parseInt(Math.random() * i, 0), x = v[--i], v[i] = v[j], v[j] = x);
  return v;
}
