const getDataFromLocalStorage = () => JSON.parse(localStorage.getItem('locs')) || [];
let markers = getDataFromLocalStorage();

const forceSetSession = (locs) => {
  localStorage.setItem('locs', JSON.stringify(locs));
}

const SaveDataToLocalStorage = (data) => {
    a = getDataFromLocalStorage();
    // Push the new data (whether it be an object or anything else) onto the array
    a.push({coords: data, iconImage: '', content: ''});
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('locs', JSON.stringify(a));

    markers = a;
}

// Get proper error message based on the code.
const getPositionErrorMessage = code => {
  switch (code) {
      case 1:
          return 'Permission denied.';
      case 2:
          return 'Position unavailable.';
      case 3:
          return 'Timeout reached.';
      default:
          return null;
  }
}

// Track user's location.
const trackLocation = ({ onSuccess, onError = () => { } }) => 
    ('geolocation' in navigator === false) ?
        onError(new Error('Geolocation is not supported by your browser.'))   :
        navigator.geolocation.watchPosition(onSuccess, onError, {
            // Enable the high accuracy
            enableHighAccuracy: true,
            timeout: 1500000,
            maximumAge: 0
        });

function haversine_distance(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
    var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
}

function checkDistance( loc ){
  let flag = 1;
  const LocsFromStorage = getDataFromLocalStorage();
  let distance;
  for( let i = 0; i<LocsFromStorage.length; i++ ){
    distance = haversine_distance({lat: loc.lat, lng: loc.lng}, {lat: LocsFromStorage[i].coords.lat, lng: LocsFromStorage[i].coords.lng})
    if(distance < 1){
      flag = 0;
      return flag;
    }
  }
  return flag;              
}
  