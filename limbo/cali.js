

var route_map;
var city_map;
var locations;

function init(){
    load_data();
}

function init_map() {

    $('#route-map').show();
    $('#city-map').show();
    $('#progress-wrapper').hide();

	locations = cali_data.reverse();
  console.log('Locations found:', locations.length);

  route_map = new google.maps.Map(document.getElementById('route-map'), {
    zoom: 4,
    center: new google.maps.LatLng(40.133531, -98.225178),
    styles: map_styles
  });

  city_map = new google.maps.Map(document.getElementById('city-map'), {
    zoom: 4,
    center: new google.maps.LatLng(40.133531, -98.225178),
    styles: map_styles
  });

  add_city_cords(city_map, city_cords);

  var vertices = [];
  for(var i = 0; i < locations.length; i++){
  	vertices.push({
          lat: locations[i].latitudeE7 / 10000000,
          lng: locations[i].longitudeE7 / 10000000
      });
  }

  add_lines(route_map, vertices);
}

function add_lines(map, vertices){
    var poly = new google.maps.Polyline({
        path: vertices,
        strokeColor: '#b51538',
        strokeOpaname: 1.0,
        strokeWeight: 4
    });

    poly.setMap(map);
}

function add_city_cords(map, cords){

  for(var i = 0; i < cords.length; i++){
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(cords[i].latitude, cords[i].longitude),
      map: map
    });

    google.maps.event.addListener(marker, "mouseover", function() {
        marker.openInfoWindowHtml("<h3>" + cords[i].name + "</h3>");
    });
  }
}

function update_progress(percent){
    $('#progress').width(percent * 100 + '%');
}

function load_data(){
    $.ajax ({
        url : 'limbo/latlng_data.js',
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function(evt){
               if (evt.lengthComputable) {
                   update_progress(evt.loaded / evt.total);
               }
            }, false);

           return xhr;
        },
        success : init_map
    });
}

var map_styles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
];

var city_cords = [
  {
    "name": "Buffalo",
    "latitude": 42.88644679999999, 
    "longitude": -78.8783689
  },{
    "name": "Detroit", 
    "latitude": 42.331427, 
    "longitude": -83.0457538
  },{
    "name": "Chicago",
    "latitude": 41.8781136, 
    "longitude": -87.6297982
  },{
    "name": "Minneapolis",
    "latitude": 44.977753, 
    "longitude": -93.2650108, 
  },{
    "name": "Calgary",
    "latitude": 51.044739,
    "longitude": -113.998651
  },{
    "name": "Vancouver",
    "latitude": 45.6387281, 
    "longitude": -122.6614861
  },{
    "name": "Seattle",
    "latitude": 47.6062095, 
    "longitude": -122.3320708
  },{
    "name": "Portland",
    "latitude": 45.5230622, 
    "longitude": -122.6764816
  },{
    "name": "Sacramento",
    "latitude": 38.5815719, 
    "longitude": -121.4943996
  },{
    "name": "San Francisco", 
    "latitude": 37.7749295, 
    "longitude": -122.4194155
  },{
    "name": "Salt Lake City",
    "latitude": 40.7607793, 
    "longitude": -111.8910474
  },{
    "name": "Phoenix",
    "latitude": 33.4483771, 
    "longitude": -112.0740373
  },{
    "name": "San Diego", 
    "latitude": 32.715738, 
    "longitude": -117.1610838
  },{
    "name": "Los Angeles",
    "latitude": 34.0522342, 
    "longitude": -118.2436849
  }
];
