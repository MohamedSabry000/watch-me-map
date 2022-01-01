# watch-me-map

## Features
* save our positions with its `lat , lng` 
* list all location i visited
* can edit any position marker
* can edit any position info window content
* can get the route from location to another
* show me the current `lat, lng` position
* can go to a pecific `lat, lng` position

## Technologies
* HTML5
* CSS
* Native Javascriot

## Live
we can try the Application on netlify [https://condescending-fermat-aba37c.netlify.app/](https://condescending-fermat-aba37c.netlify.app/)

## Describ some JS Functionalities

#### Scripts.js
* after window load, start the Map
* ```createInfoWindow()``` function is for creating a note, be visible on marker click, the default content is **empty** 
* ```createMarkerClusterer = (map, markers) =>{``` function takes the **map** and array of **markers** 
    * the *markerClustererLayer* object is created for once
    * each time called again, remove all past *markers* from the *map*, and then rerender the updated ones
* ```addMarker = (props) => {``` function takes the **marker** object
    * marker object like this => 
    ```
        {
            content: String,
            iconImage: URL,
            coords: {
                lat: Float,
                lng: Float
            }
        }
    ```
    * create *marker* object
    * on click that marker, replace the **infowindow** note with its Note Content
    * if the image url on it is empty, so the default marker image will be exist
        * else if the image isn't a valid URL, replace the default marker image with an *svg* image detected on the function
        * else, replace the default marker with the users'
* ```panTo = (e) => {``` function is responsible for take the user to a specific `lat,lng` based on the element fired it, all it needs is that the element has two attributes **data-lat** and **data-lng** saving the *lat* and *lng* values.
* ```forceSetSession = (locs) => {``` function takes a collection of position objects and save it on **local storage**, and call **pushMarkersOnArray()** function sending these locations for it.
* ```editLocData = () => {``` function takes the values on inputs in the left hand side window modifying a specific marker data, and modify it on **local storage** then rerender the map by calling *forceSetSession()* function passing the updated locations for it.
* ```delData = (e) => {``` function to delete elemets from **local storage** and rerender
* ```editDataWindow = (e) => {``` function to just open the real *edit* window based on the specified element
* ```pushMarkersOnArray(markers)``` function is for 
    * creating google markers objects from markers objects available to use on map
    * ass data to left and right hand side windows (means on DOM elements)
    * and finally called `createMarkerClusterer()` function to put the google markers into the map
* ```addMarkerMapResponse(lat, lng)``` function for adding position to **local storage** and zoom on the lat position, then rerender the map with updates.
* ```initMap() ``` is the base function of all
        * call for creating a map *createMap()*
        * call *fromToLocs(map)* function from *directions.js* file preparing the prerequesits of **find route** service.
        * track the user's location, calculating the distance between the current location and any other location on the local storage if it was greater than 1 mile, save the location, else don't, except it was the first time working the app.
        * rerender the map
#### Locations.js
* ```getDataFromLocalStorage = () =>``` function getting data from **local storage**
* ```SaveDataToLocalStorage = (data) => {``` function for append new location to **local storage**
* ```trackLocation = ({ onSuccess, onError = () => { } }) => ``` function verifying if the current browser accepts the **geolocation** service, if yes, do what in *onSuccess* function, else, do what on *onError** function
* ```haversine_distance(mk1, mk2)``` getting the distance between two locations on map
* ```checkDistance( loc )``` returns a boolean value if that **loc** was near to any position got from the local storage or not
#### Directions.js
* ```fromToLocs(map)``` function preparing the prerequisits for creating a road between two points on map using **directionsService** and **directionsRenderer** objects from google 
* ```calculateAndDisplayRoute(directionsService, directionsRenderer) {``` function generating the route using *origin*, *destination*, and *travel mode*
#### InsertLoc.js
is for pan to a specific `lat, lng` the user enter be himself!

