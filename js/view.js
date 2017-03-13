var map;
var locations = [];
var infoWindows = [];
var markers = [];
var id = 0;
var listItems = [];

function viewModel() {
  var sanDiego = {lat: 32.930639, lng: -117.4703734};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: sanDiego
  });
  places.forEach(function(place){
    locations.push(new Location(place));
  });
  var currentInfoWindow = infoWindows[0];
  for (var i = 0; i < markers.length; ++i) {
    google.maps.event.addListener(markers[i], 'click', function(innerKey) {
        return function() {
            currentInfoWindow.close();
            infoWindows[innerKey].open(map, markers[innerKey]);
            markers[innerKey].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {markers[innerKey].setAnimation(null);}, 1450);
            currentInfoWindow = infoWindows[innerKey];
        };
      }(i));
    }
  for (var i = 0; i < listView.length; ++i) {
    listView[i].addEventListener('click', function(innerKey){
      return function() {
        google.maps.event.trigger(markers[innerKey], 'click');
      };
    }(i));
  }
}

var Location = function(place) {
    this.lat = place.lat;
    this.lng = place.lng;
    this.name = place.name;
    this.search = place.search;
    this.description = place.description;
    // showItem = ko.observable(true);
    this.latlng = new google.maps.LatLng(this.lat, this.lng);
    this.marker = new google.maps.Marker({
      position: this.latlng,
      map: map
    });
    markers.push(this.marker);
    console.log("location set");
    name = '<div id="listView">%data%</div>'
    this.formattedName = name.replace("%data%", this.name);
    $("#list").append(this.formattedName);
    listItems.push(this.formattedName);
    contentString = '<div id="content">' + this.description + '</div>';
    var flickr = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=583683c6baa1b32fb35b05b46b82ef0c&tags=' + this.search + '&per_page=5';
    $.getJSON(flickr, function (data) {
      console.log(data);
      $.each( data.photos.photo, function( i, item ) {
                var url = 'https://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
               $('#content').append('<img src="' + url + '"/>');
             });
			})
      .fail(function() {
        console.log("flickr API failed");
      });
    this.infowindow = new google.maps.InfoWindow({
         content: contentString
       });
    infoWindows.push(this.infowindow);
}


// starter code for implementing filters. refactor later
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function click() {
  console.log("clicked");
  locations[2].showItem = false;
}

var startMap = function() {
  ko.applyBindings(new viewModel());
}
