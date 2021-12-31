document.getElementById("nav-toggle-right").addEventListener("click", () => {
  document.getElementById("floating-panel").classList.toggle("hide-right");
})

function fromToLocs(map) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map)

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  document.getElementById("start").addEventListener("change", onChangeHandler);
  document.getElementById("end").addEventListener("change", onChangeHandler);
  document.getElementById("mode").addEventListener("change", onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  
  // Get Start Location
  const startValueArray = document.getElementById("start").value.split(',')
  // Convert The Start Loc From String To Object
  const bureStartLatLngObj = {lat: parseFloat(startValueArray[0]), lng: parseFloat(startValueArray[1])}
  
  const endValueArray = document.getElementById("end").value.split(',')
  const bureEndLatLngObj = {lat: parseFloat(endValueArray[0]), lng: parseFloat(endValueArray[1])}
  //  Get the Mode
  const mode = document.getElementById("mode").value;
  
  directionsService.route({
      origin: bureStartLatLngObj,
      destination: bureEndLatLngObj,
      travelMode: mode,
    }, function(response, status) {
      console.log(status);
      if( status = 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    })
}
