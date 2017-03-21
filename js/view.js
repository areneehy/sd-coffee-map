var map;
var locations = [];
var infoWindows = [];
var images = [];
var markers = [];
var hasBeer = [];
var hasFood = [];
var hasOutdoor = [];
var hasParking= [];

function viewModel() {
    var sanDiego = {
        lat: 32.930639,
        lng: -117.4703734
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: sanDiego
    });
    places.forEach(function(place) {
        locations.push(new Location(place));
    });
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
                $("#photos").html(images[innerKey]);
            };
        }(i));
    }
    for (var i = 0; i < listView.length; ++i) {
        listView[i].addEventListener('click', function(innerKey) {
            return function() {
                google.maps.event.trigger(markers[innerKey], 'click');
            };
        }(i));
    }
    var k;
    for (var i = 0; i < locations.length; ++i) {
        if (locations[i].hasBeer === true) {
            k = document.getElementsByClassName("listItems");
            console.log(k[i]);
            k[i].className += " hasBeer";
            hasBeer.push(locations[i].marker);
        }
        if (locations[i].hasFood === true) {
            k = document.getElementsByClassName("listItems");
            console.log(k[i]);
            k[i].className += " hasFood";
            hasFood.push(locations[i].marker);
        }
        if (locations[i].hasOutdoor === true) {
            k = document.getElementsByClassName("listItems");
            console.log(k[i]);
            k[i].className += " hasOutdoor";
            hasOutdoor.push(locations[i].marker);
        }
        if (locations[i].hasParking === true) {
            k = document.getElementsByClassName("listItems");
            console.log(k[i]);
            k[i].className += " hasParking";
            hasParking.push(locations[i].marker);
        }
    }
}

var Location = function(place) {
    this.lat = place.lat;
    this.lng = place.lng;
    this.name = place.name;
    this.description = place.description;
    this.search = place.search;
    this.hasFood = place.hasFood;
    this.hasBeer = place.hasBeer;
    this.hasParking = place.hasParking;
    this.hasOutdoor = place.hasOutdoor;
    this.latlng = new google.maps.LatLng(this.lat, this.lng);
    this.marker = new google.maps.Marker({
        position: this.latlng,
        map: map
    });
    markers.push(this.marker);
    console.log("location set");
    name = '<div id="listView" class="listItems">%data%</div>';
    this.formattedName = name.replace("%data%", this.name);
    $("#list").append(this.formattedName);
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

// Sets map on markers in the selected array.
function setMapOnAll(array, map) {
    for (var i = 0; i < array.length; i++) {
        array[i].setMap(map);
    }
}

// Removes all markers and list items from view.
function clear() {
    drop();
    setMapOnAll(markers, null);
    $(".listItems").hide();
}

// show all markers and list items
function resetAll() {
    drop();
    setMapOnAll(markers, map);
    $(".listItems").show();
}

function showHasFood() {
    clear();
    setMapOnAll(hasFood, map);
    $(".hasFood").show();
}

function showHasBeer() {
  clear();
  setMapOnAll(hasBeer, map);
  $(".hasBeer").show();
}

function showHasOutdoor() {
    clear();
    setMapOnAll(hasOutdoor, map);
    $(".hasOutdoor").show();
}

function showHasParking() {
    clear();
    setMapOnAll(hasParking, map);
    $(".hasParking").show();
}

function mapError() {
  alert("Google Maps has failed.");
}

var startMap = function() {
    ko.applyBindings(new viewModel());
};
