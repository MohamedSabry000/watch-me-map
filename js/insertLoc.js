// Find the Bottom Ration of the Bottom Box
let bottomBoxContainer = document.getElementById("insert-loc");

let bottomHeightRation = `-${(bottomBoxContainer.offsetHeight/window.innerHeight)*100}%`
document.documentElement.style.setProperty('--bottom-height-ration', bottomHeightRation);

document.getElementById("nav-toggle-up").addEventListener("click", () => {
    document.getElementById("floating-panel-insert").classList.toggle("hide-bottom");
})
// ***********************************

const locLat = document.getElementById("loc-lat");
const locLng = document.getElementById("loc-lng");

document.getElementById("force-insert-loc").addEventListener("click", () => {
    let lat = parseFloat(locLat.value) || undefined;
    console.log(locLat.value);
    let lng = parseFloat(locLng.value) || undefined;
    if(lat != undefined && lng != undefined && lat >= -85 && lat <= 85 && lng >= -180 && lng <= 180 ){
        map.panTo({lat,lng});
    } else{
        alert("Please Enter Valid Data!")
    }
})