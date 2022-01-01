// Navbar Menu Toggle
document.getElementById("nav-toggle").addEventListener("click", () => {
    document.getElementById("v-nav").classList.toggle("hide");
})
document.getElementById("close-edit").addEventListener("click", () => {
    document.getElementById("overwrite-loc").classList.toggle("hide");
})



// Map Handling
let markerClustererLayer = undefined;
let map;
const infoWindow = createInfoWindow();

// let gmarkers;

function createMap({ lat, lng }){ 
    return new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: 13
    });
}

function createInfoWindow () {
    return  new google.maps.InfoWindow({
                content: "",
                disableAutoPan: true,
            });
}

const createMarkerClusterer = (map, markers) =>{
    if(markerClustererLayer == undefined){
        markerClustererLayer = 
            new MarkerClusterer(map, markers, {
                imagePath:
                    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
    } else {
        markerClustererLayer.clearMarkers();
        markerClustererLayer.addMarkers(markers);
    }
    return markerClustererLayer;
}
    

//Add MArker function
const addMarker = (props) => {
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
        console.log(marker);
        infoWindow.setContent(props.content);
        infoWindow.open(map, marker);
    });

    function isValidImageURL(str){
        if ( typeof str !== 'string' ) return false;
        return !!str.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
    }

    if (props.iconImage) {
        if (!isValidImageURL(props.iconImage)) {
            marker.setIcon(svgMarker)
        } else {
            // MarkerImage( // url: , // size: , // origin: , // anchor: , // set scaledSize: )
            var newImage = new google.maps.MarkerImage(props.iconImage, new google.maps.Size(32, 37), new google.maps.Point(0, 0), new google.maps.Point(8, 16), new google.maps.Size(32, 37)); 
            marker.setIcon(null);
            marker.setIcon(newImage); 
        }
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


const panTo = (e) => {
    map.panTo({ lat: parseFloat(e.getAttribute("data-lat")), lng: parseFloat(e.getAttribute("data-lng")) })
}

const forceSetSession = (locs) => {
    localStorage.setItem('locs', JSON.stringify(locs));
    pushMarkersOnArray(locs);
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
    }
}

const delData = (e) => {
    const loc = getDataFromLocalStorage();
    const thisLoc = loc.findIndex(el => el.coords.lat == e.getAttribute("data-lat") && el.coords.lng == e.getAttribute("data-lng"));
    const bureLocs = loc.filter((e,i) => i != thisLoc);
    forceSetSession(bureLocs);
}

const editDataWindow = (e) => {
    const loc = getDataFromLocalStorage();
    const thisLoc = loc.findIndex(el => el.coords.lat == e.getAttribute("data-lat") && el.coords.lng == e.getAttribute("data-lng"));
    document.getElementById("lat-info").innerText = loc[thisLoc].coords.lat;
    document.getElementById("lng-info").innerText = loc[thisLoc].coords.lng;
    document.getElementById("loc-icon").value = loc[thisLoc].iconImage;
    document.getElementById("loc-content").value = loc[thisLoc].content;
    document.getElementById("overwrite-loc").classList.toggle("hide");
}

const addDomListElement = (lat, lng, index) => 
    `<li>
        <a class="${index == 0 ? 'active' : ''}" href="javascript:void(0);" data-lat="${lat}" data-lng="${lng}" onclick="panTo(this)">
            ${lat}, ${lng}
        </a>
        <a class="loc-edit" href="javascript:void(0);" data-lat="${lat}" data-lng="${lng}" onclick="editDataWindow(this)">
            <i class="far fa-edit"></i>
        </a>
        <a class="loc-del" href="javascript:void(0);" data-lat="${lat}" data-lng="${lng}" onclick="delData(this)">
            <i class="far fa-trash"></i>
        </a>
    </li>`;

const addDomSelectElement = (pos, startList, endList) => {
    const el = `<option value="${pos.coords.lat},${pos.coords.lng}">
                    ${pos.content? pos.content : pos.coords.lat+', '+pos.coords.lng}
                </option>`;
    startList.innerHTML += el;
    endList.innerHTML += el;
}
    

// Loop through markers
function pushMarkersOnArray(markers) {
    let gmarkers = [];
    // List Parent of the Left Bar
    const domListPosContainer = document.getElementById("nav-menu");    
    domListPosContainer.innerHTML = '';

    // Selection Lists of the Right Bar
    const startPos = document.getElementById("start");
    const endPos = document.getElementById("end");
    startPos.innerHTML = '';
    endPos.innerHTML = '';

    for (let i = 0; i < markers.length; i++) {
        gmarkers.push(addMarker(markers[i]));

        domListPosContainer.innerHTML += 
            addDomListElement(markers[i].coords.lat, markers[i].coords.lng, i)

        addDomSelectElement(markers[i], startPos, endPos); 
    }

    createMarkerClusterer(map, gmarkers);
}

function addMarkerMapResponse(lat, lng){
    map.panTo({ lat, lng });
    const newMarkers = SaveDataToLocalStorage({ lat, lng });
    pushMarkersOnArray(newMarkers);
}

function initMap() {    

    const initialPosition = { lat: 30.6937856, lng: 30.8609024 };
    map = createMap(initialPosition);
    let markers = getDataFromLocalStorage();

    fromToLocs(map);    // Get Directions serves the right list

    // Use the new trackLocation function.
    trackLocation({
        onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
            map.panTo({ lat, lng })

            info.textContent = `Lat: ${lat} Lng: ${lng}`;
            info.classList.remove('error');

            const LocsFromStorage = getDataFromLocalStorage();
            LocsFromStorage.length?
                checkDistance({ lat, lng }) && addMarkerMapResponse( lat, lng )
                :
                addMarkerMapResponse( lat, lng )
        },
        onError: err => {
            info.textContent = `Error: ${getPositionErrorMessage(err.code) || err.message}`;
            info.classList.add('error');
        }
    });

    pushMarkersOnArray(markers);
}
initMap();