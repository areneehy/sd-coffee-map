var map;
var locations = [];
var infoWindows = [];
var images = [];
var markers = [];
// var hasBeer = [];
// var hasFood = [];
// var hasOutdoor = [];
// var hasParking= [];

function ViewModel() {

    var self = this;
    this.locationsArray = ko.observableArray([]);

    var sanDiego = {
        lat: 32.930639,
        lng: -117.4703734
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: sanDiego
    });
    places.forEach(function(place) {
        var newLocation = new Location(place);
        locations.push(newLocation);
        self.locationsArray.push(newLocation);
    });
    // this.pix = ko.observable('');
    currentInfoWindow = infoWindows[0];
    for (var i = 0; i < markers.length; ++i) {
        google.maps.event.addListener(markers[i], 'click', function(innerKey) {
            return function() {
                currentInfoWindow.close();
                infoWindows[innerKey].open(map, markers[innerKey]);
                markers[innerKey].setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    markers[innerKey].setAnimation(null);
                }, 1450);
                currentInfoWindow = infoWindows[innerKey];
                $("#photos").html(markers[innerKey].images);
                // self.pix(markers[innerKey].images);
            };
        }(i));
    }
    self.clickMarker = function() {
                google.maps.event.trigger(this.marker, 'click');
    }
    // var k;
    // for (var i = 0; i < locations.length; ++i) {
    //     if (locations[i].hasBeer === true) {
    //         // k = document.getElementsByClassName("listItems");
    //         // k[i].className += " hasBeer";
    //         hasBeer.push(locations[i].marker);
    //     }
    //     if (locations[i].hasFood === true) {
    //         // k = document.getElementsByClassName("listItems");
    //         // k[i].className += " hasFood";
    //         hasFood.push(locations[i].marker);
    //     }
    //     if (locations[i].hasOutdoor === true) {
    //         // k = document.getElementsByClassName("listItems");
    //         // k[i].className += " hasOutdoor";
    //         hasOutdoor.push(locations[i].marker);
    //     }
    //     if (locations[i].hasParking === true) {
    //         // k = document.getElementsByClassName("listItems");
    //         // k[i].className += " hasParking";
    //         hasParking.push(locations[i].marker);
    //     }
    // }

    this.filterTermArray = ko.observableArray(['All Results','Has Food','Has Beer','Has Outdoor','Has Parking']);

    this.filter = function(filterTerm) {
        drop();
        console.log(filterTerm);
        var filterProperty;
        if (filterTerm === 'Has Food') {
            filterProperty = 'hasFood';
        }
        if (filterTerm === 'Has Beer') {
            filterProperty = 'hasBeer';
        }
        if (filterTerm === 'Has Outdoor') {
            filterProperty = 'hasOutdoor';
        }
        if (filterTerm === 'Has Parking') {
            filterProperty = 'hasParking';
        }
        if (filterTerm === 'All Results') {
            filterProperty = 'showAll';
        }

        self.locationsArray().forEach(function(location) {
            if (location[filterProperty] === true) {
                location.showLocation(true);
                location.marker.setVisible(true);
            } else {
                location.showLocation(false);
                location.marker.setVisible(false);
            }
            // console.log(location.marker);
        });

    };

}


var Location = function(place) {
    var self = this;
    this.lat = place.lat;
    this.lng = place.lng;
    this.name = place.name;
    this.description = place.description;
    this.search = place.search;
    this.hasFood = place.hasFood;
    this.hasBeer = place.hasBeer;
    this.showAll = true;
    this.hasParking = place.hasParking;
    this.hasOutdoor = place.hasOutdoor;
    this.latlng = new google.maps.LatLng(this.lat, this.lng);
    this.marker = new google.maps.Marker({
        position: this.latlng,
        map: map
    });
    markers.push(this.marker);
    this.showLocation = ko.observable(true);

    this.images = "";
    var flickr = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=583683c6baa1b32fb35b05b46b82ef0c&text=' + this.search + '&per_page=12&format=json&jsoncallback=?';
    var imgs = "";
    $.ajax({
        url: flickr,
        dataType: 'json',
        // async: false,
        success: function(data) {
          $.each(data.photos.photo, function(i, item) {
              var url = 'https://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
              imgs += '<img src="' + url + '"/>';
          });
          self.images = imgs;
          self.marker.images = imgs;
          images.push(imgs);
        },
        error: function() {
            alert("flickr API failed");
        }
    });
    var contentString = '<div class="content">' + this.description + '</div>';
    infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindows.push(infowindow);
};


// Drop menu functionality
function drop() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function mapError() {
  alert('Google Maps has failed.');
}

var startMap = function() {
    ko.applyBindings(new ViewModel());
};
