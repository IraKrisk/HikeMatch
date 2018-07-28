$(document).ready(function(){

  // search options
  $('#search').click(function(){
    $('#searchList').slideToggle(1000);
  });
  // county options
  $('#county').click(function(){
    $('#county-dropdown').slideToggle(1000);
  });
  // level options
  $('#diff_level').click(function(){
    $('#level-dropdown').slideToggle(1000);
  });
  // show phone number
  $('#hidePhone').hover(function(){
    $('#showPhone').fadeToggle(1000);
  });
  // comment form
  $('#addComment').click(function(){
    $('#commentForm').fadeToggle(1000);
  });
  // hide intrest
  $('#hideInterest').click(function(){
    $('#showInterest').fadeToggle(1000);
  });
  // hide comments
  $('#hideComment').click(function(){
    $('#showComment').fadeToggle(1000);
  });
  // menu
  $('#hideMobMenu').click(function(){
    $('#showMobMenu').slideToggle(1000);
  });

  // gallery
  $('#prev').click(function(){  
    let currentImg = $('.active');
    let nextImg = currentImg.next();
    let firstImg = $('#firstImg');

    if(nextImg.length){
      currentImg.removeClass('active').css('z-index', -1);
      nextImg.addClass('active').css('z-index', 1);
    }
    if(!nextImg.length){
      currentImg.removeClass('active').css('z-index', -1);
      firstImg.addClass('active').css('z-index', 1);
    }
  })
  $('#next').click(function(){    
    let currentImg = $('.active');
    let prevImg = currentImg.prev();
    let lastImg = $('#lastImg');

    if(prevImg.length){
      currentImg.removeClass('active').css('z-index', -1);
      prevImg.addClass('active').css('z-index', 1);
    }
    if(!prevImg.length){
      currentImg.removeClass('active').css('z-index', -1);
      lastImg.addClass('active').css('z-index', 1);
    }
  })
});

function initMap(){
  const lat = document.getElementById('latitude').value;
  const lng = document.getElementById('longitude').value;

  const location = new google.maps.LatLng(lat, lng);
  map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 10
  });
  let marker = new google.maps.Marker({
    position: location, 
    map: map,
    icon:'../../images/map-icon.png'
  });
  marker.setMap(map);
} 
