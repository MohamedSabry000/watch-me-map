// Navbar Menu Toggle
document.getElementById("nav-toggle").addEventListener("click", () => {
    document.getElementById("v-nav").classList.toggle("hide");
})
document.getElementById("close-edit").addEventListener("click", () => {
    document.getElementById("overwrite-loc").classList.toggle("hide");
})



// Map Handling
let map;
let goToBase = 1;
const createMap = ({ lat, lng }) =>
    new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: 13
    });

const createMarkerClusterer = (map, markers) =>
    new MarkerClusterer(map, markers, {
        imagePath:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });

//Add MArker function
const addMarker = (props, infoWindow) => {
    const svgMarker = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: "#BA68C8",
        fillOpacity: 0.9,
        strokeWeight: 0,
        strokeColor: '#AB47BC',
        rotation: 0,
        scale: 1.2,
        anchor: new google.maps.Point(12, 24),
    };

    let marker = new google.maps.Marker({
        position: props.coords,
        map: map,
    });

    marker.addListener("click", () => {
        console.log(props);
        infoWindow.setContent(props.content);
        infoWindow.open(map, marker);
    });

    if (props.iconImage) {
        // MarkerImage( // url: , // size: , // origin: , // anchor: , // set scaledSize: )
        var newImage = new google.maps.MarkerImage(props.iconImage, new google.maps.Size(32, 37), new google.maps.Point(0, 0), new google.maps.Point(8, 16), new google.maps.Size(32, 37)); 
        marker.setIcon(null);
        marker.setIcon(newImage); 
        // if (!marker.setIcon(newImage)) {
        //     marker.setIcon(svgMarker)
        // }
    }
    //Check content
    if (props.content) {
        let infoWindow = new google.maps.InfoWindow({
            content: props.content
        });
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });
    }
    return marker;
}

const createInfoWindow = () =>
    new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });

const panTo = (e) => {
    map.panTo({ lat: parseFloat(e.getAttribute("data-lat")), lng: parseFloat(e.getAttribute("data-lng")) })
}

const editData = (e) => {
    const loc = getDataFromLocalStorage();
    const thisLoc = loc.findIndex(el => el.coords.lat == e.getAttribute("data-lat") && el.coords.lng == e.getAttribute("data-lng"));
    document.getElementById("lat-info").innerText = loc[thisLoc].coords.lat;
    document.getElementById("lng-info").innerText = loc[thisLoc].coords.lng;
    document.getElementById("loc-icon").value = loc[thisLoc].iconImage;
    document.getElementById("loc-content").value = loc[thisLoc].content;
    document.getElementById("overwrite-loc").classList.toggle("hide");
}

const editLocData = () => {
    let obj = {};
    obj.lat = document.getElementById("lat-info").innerText;
    obj.lng = document.getElementById("lng-info").innerText;
    obj.icon = document.getElementById("loc-icon").value;
    obj.content = document.getElementById("loc-content").value;

    let loc = getDataFromLocalStorage();
    const thisLoc = loc.findIndex(el => el.coords.lat == obj.lat && el.coords.lng == obj.lng);
    if (thisLoc != undefined) {
        loc[thisLoc].iconImage = obj.icon;
        loc[thisLoc].content = obj.content;
        forceSetSession(loc);
        // console.log(loc);
    }
}

// Loop through markers
const puskMarkersOnArray = (markers, infoWindow) => {
    let gmarkers = [];
    // List Parent of the Left Bar
    const ul = document.getElementById("nav-menu");    
    ul.innerHTML = '';

    // Selection Lists of the Right Bar
    const start = document.getElementById("start");
    const end = document.getElementById("end");
    start.innerHTML = '';
    end.innerHTML = '';

    for (let i = 0; i < markers.length; i++) {
        gmarkers.push(addMarker(markers[i], infoWindow));
        // Add Position to The List on Left
        ul.innerHTML +=
            `<li>
                <a class="${i == 0 ? 'active' : ''}" href="javascript:void(0);" data-lat="${markers[i].coords.lat}" data-lng="${markers[i].coords.lng}" onclick="panTo(this)">
                    ${markers[i].coords.lat}, ${markers[i].coords.lng}
                </a>
                <a class="loc-edit" href="javascript:void(0);" data-lat="${markers[i].coords.lat}" data-lng="${markers[i].coords.lng}" onclick="editData(this)">
                    <i class="far fa-edit"></i>
                </a>
            </li>`;
        // Add Position to the List Right
        const el = `
        <option value="${markers[i].coords.lat},${markers[i].coords.lng}">
            ${markers[i].content? markers[i].content : markers[i].coords.lat+', '+markers[i].coords.lng}
        </option>`;

        start.innerHTML += el;
        end.innerHTML += el;

    }

    return gmarkers;
}

const markerCluster = (map, markers) => {
    new MarkerClusterer(map, markers, {
        imagePath:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
}

function initMap() {    
    const initialPosition = { lat: 30.6937856, lng: 30.8609024 };

    map = createMap(initialPosition);

    fromToLocs(map);    // Get Directions

    let InfoWindow = createInfoWindow();
    let gmarkers;

    // Use the new trackLocation function.
    trackLocation({
        onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
            // marker.setPosition({ lat, lng });
            if (goToBase) { map.panTo({ lat, lng }); goToBase = 0; }
            // Print out the user's location.
            info.textContent = `Lat: ${lat} Lng: ${lng}`;
            // Don't forget to remove any error class name.
            info.classList.remove('error');
            const LocsFromStorage = getDataFromLocalStorage();
            if (LocsFromStorage.length) {
                if (checkDistance({ lat: lat, lng: lng })) {
                    SaveDataToLocalStorage({ lat: lat, lng: lng });
                    map.panTo({ lat, lng });
                    gmarkers = puskMarkersOnArray(markers, InfoWindow);
                    createMarkerClusterer(map, gmarkers);
                    console.log("here");
                }
            } else {
                map.panTo({ lat, lng });
                SaveDataToLocalStorage({ lat: lat, lng: lng });
                gmarkers = puskMarkersOnArray(markers, InfoWindow);
                createMarkerClusterer(map, gmarkers);
            }
            // drawLine({lat: 30.3409044, lng: 31.1712409}, {lat: 52.520007, lng: 13.404954})
            // const distance = haversine_distance({lat: 30.3409044, lng: 31.1712409}, {lat: 52.520007, lng: 13.404954})
            // console.log(distance);
        },
        onError: err => {
            // Print out the error message.
            info.textContent = `Error: ${getPositionErrorMessage(err.code) || err.message}`;
            // Add error class name.
            info.classList.add('error');
        }
    });

    gmarkers = puskMarkersOnArray(markers, InfoWindow);
    createMarkerClusterer(map, gmarkers);
}
initMap();