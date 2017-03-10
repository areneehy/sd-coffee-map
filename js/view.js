var map;
var locations = [];
var infoWindows = [];
var markers = [];

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
        }
      }(i));
    }
}

viewModel.displayInfo = function(id) {
// {
//   return function () {
    console.log("inform");
    // google.maps.event.trigger(markers[id], 'click');
    console.log(id);
};

var count = 0;
var Location = function(place) {
    this.lat = place.lat;
    this.lng = place.lng;
    this.name = place.name;
    this.description = place.description;
    this.latlng = new google.maps.LatLng(this.lat, this.lng);
    this.marker = new google.maps.Marker({
      position: this.latlng,
      map: map
    });
    count +=1;
    this.id = count;
    id = this.id;
    markers.push(this.marker);
    console.log("location set");
    name = '<div data-bind="click: viewModel.displayInfo(id)">%data%</div>';
    this.formattedName = name.replace("%data%", this.name);
    $("#list").append(this.formattedName);
    contentString = '<div id="content">' + this.description + '</div>';
    this.infowindow = new google.maps.InfoWindow({
         content: contentString
       });
    infoWindows.push(this.infowindow);
}

var startMap = function() {
  ko.applyBindings(new viewModel());
}
