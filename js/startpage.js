const welcomeTemplate = ["Evening", "Morning", "Afternoon", "Evening"];
let settings = {
    userName : '',
    accentColor: '#2f5dff',
    bgColor: '#373769',
    bgImage: '../images/indexbg.jpg',
    bgHidden: 'false',
    city : '',
    country : ''
}
let countdowndate;
let countdowninterval;
var countdownoptions = { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


let bookmarks = [{
    title : 'Reference',
    items : [
        {
            name:'Wiki',
            url:'./wiki/'
        },
        {
            name:'Lua Codex',
            url:'./codex/'
        },
    ]
},{
    title : 'Trackers',
    items : [
        {
            name:'Talents Tracker',
            url:'./dutalents/'
        },
    ]
},{
    title : 'Calculators',
    items : [
        {
            name:'Crafting Calculator',
            url:'./craft/'
        },
        {
            name:'SU Time Calculator',
            url:'./sutime/'
        },
    ]
},{
    title : 'Tools',
    items : [
        {
            name:'Helios Map',
            url:'./map/'
        },
        {
            name:'JayleBreak\'s Voxel Planner',
            url:'./voxelplanner/'
        },
    ]
}]


//Function for Setting the Welcome Message
function setupWelcomeMessage(){
    let currentHours = new Date().getHours();
    if (currentHours <=3 || currentHours >21){
        selectHours = 0;
    }else if (currentHours >3 && currentHours <12){
        selectHours = 1;
    }else if (currentHours >=12 && currentHours <17){
        selectHours = 2;
    }else{
        selectHours = 3;
    }
    settings.userName = discordusername; // Global var from index.php
    let welcome = "Good " + welcomeTemplate[selectHours] + ", " + settings.userName + ", Welcome To Dual.sh";
    //let welcome = "Welcome back, " + settings.userName;
    document.getElementById("welcome-greeting").innerHTML = welcome;
}

//Function for Updating the Time
function updateTime() {
    let m = String(new Date().getMinutes());
    let h = String(new Date().getHours());
    if (h.length == 1) {
        h = "0" + h;
    }
    if (m.length == 1) {
        m = "0" + m;
    }
    var time = h + ":" + m;
    document.getElementById("time").innerHTML = time;
}

//Function for Updating the Time
function updateCountdown() {
    let now = new Date().getTime();
    let distance = countdowndate - now;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }

    document.getElementById("countdown").innerHTML = "( "+days + "d:" + hours + "h:" + minutes + "m:" + seconds + "s )";

    if (distance < 0) {
        clearInterval(countdowninterval);
        getServerStatus();
    }
}

//Functions for Updating Settings
function updateSettings(){
    document.documentElement.style.setProperty(`--accent`, settings.accentColor);
    document.documentElement.style.setProperty(`--bg-color`, settings.bgColor );
    if(settings.bgHidden == 'false'){
        document.documentElement.style.setProperty(`--bg-image`, `url(${settings.bgImage})` );
    }else{
        document.documentElement.style.setProperty(`--bg-image`, `url('')` );

    }

}

//Function for Checking if Color is Valid
function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}


//Getting Elements
const editButton = document.getElementById('editBtn');
const locationInput = document.getElementById('locationInput');
const errorMessage = document.getElementById('errorMessage');
const settingsMenu = document.getElementById('settings');
const mainContent = document.getElementById('content');
const serverStatusBar = document.getElementById('server-status-bar');
const navbar = document.querySelector('.nav-area');
const navItems = document.querySelectorAll('.nav-item');
const settingsContent = document.querySelectorAll('.settings-section');

//Display Error
function displayError(message){
    errorMessage.innerHTML = message;
    errorMessage.style.opacity = '1';
    setTimeout(function(){
        errorMessage.style.opacity = '0';
    },3000)
}


//Edit Button
editButton.addEventListener('click', function(){
    settingsMenu.style.display = 'block';
})

//Settings onClick
settingsMenu.addEventListener('click', function(e){
    if(e.target.classList.contains('close')){
        settingsMenu.style.display = 'none';
        createBookmarkForm();
    }else if(e.target.classList.contains('bm-remove')){
        removeBookmark(e.target.parentNode.parentNode.firstElementChild.classList.toString(),e.target.parentNode.parentNode.firstElementChild.textContent)
    }else if(e.target.classList.contains('bm-add')){
        addBookmark(e.target.parentNode.children[0].value,e.target.parentNode.children[1].value, e.target.parentNode.firstElementChild.classList.toString())
    }else if(e.target.classList.contains('cat-remove')){
        removeCategory(e.target.previousElementSibling.textContent);
    }else if(e.target.classList.contains('cat-add')){
        addCategory(e.target.previousElementSibling.value);
    }
})

//Navbar Active
navbar.addEventListener('click', function(e){
    if(!e.target.classList.contains('active')){
        navItems.forEach( function(i){
            i.classList.remove('active');
        })
        e.target.classList.add('active');
        settingsContent.forEach( function(i){
            if(i.classList.contains(e.target.id)){
                i.classList.add('active');
            }else{
                i.classList.remove('active');
            }
        })

    }
})

//Settings Inputs
const colorInput = document.getElementById('colorInput');
const bgcolorInput = document.getElementById('bgcolorInput');
const nameInput = document.getElementById('nameInput');
const coordinateInput = document.getElementById('coordinateInput');
//const countryInput = document.getElementById('countryInput');


colorInput.addEventListener('keyup',function(e){
    if(e.keyCode === 13){
        chosenColor = colorInput.value.toLowerCase();
        if(/^#[0-9a-fA-F]+$/.test(chosenColor) || isColor(chosenColor)){
            settings.accentColor = chosenColor;
            storeSettings();
            updateSettings();
            colorInput.value = '';
        }else{
            colorInput.value = '';
            displayError('Please enter a valid color.')
        }
    }
})
bgcolorInput.addEventListener('keyup',function(e){
    if(e.keyCode === 13){
        chosenColor = bgcolorInput.value.toLowerCase();
        if(/^#[0-9a-fA-F]+$/.test(chosenColor) || isColor(chosenColor)){
            settings.bgColor = chosenColor;
            storeSettings();
            updateSettings();
            bgcolorInput.value = '';
        }else{
            bgcolorInput.value = '';
            displayError('Please enter a valid color.')
        }
    }
})
/*
nameInput.addEventListener('keyup', function(e){
    if(e.keyCode === 13){
        settings.userName = nameInput.value;
        nameInput.value = ''
        storeSettings();
        setupWelcomeMessage();
    }
})
 */
coordinateInput.addEventListener('keyup', function(e){
    if(e.keyCode === 13){
        updateWeather();
    }
})
/*
countryInput.addEventListener('keyup', function(e){
    if(e.keyCode === 13 ){
        updateWeather();
    }
})
*/
/*
function updateWeather(){
    if(cityInput.value == ''){
        displayError('Please enter a town/city.')
    }else if(countryInput.value == ''){
        displayError('Please enter a country code.')
    }else{
        weather.city = cityInput.value;
        weather.countryCode = countryInput.value;
        settings.city = cityInput.value;
        settings.country = cityInput.value;
        countryInput.value='';
        cityInput.value='';
        storeSettings();
        getWeather();
    }
}
 */

// Change Background Image
function changeBg(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            settings.bgImage = e.target.result;
            updateSettings();
            storeSettings();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

//Toggle Background Image
function toggleBg(){
    if(settings.bgHidden == 'false'){
        document.documentElement.style.setProperty(`--bg-image`, `url('')`);
        settings.bgHidden = 'true';
    }else{
        document.documentElement.style.setProperty(`--bg-image`, `url(${settings.bgImage})`);
        settings.bgHidden = 'false';
    }
    storeSettings();
}



//Populating Bookmarks
function populateBookmarks(){
    document.documentElement.style.setProperty(`--noCat`, bookmarks.length);
    mainContent.innerHTML = '';
    bookmarks.forEach(function(i){
        let listGroup = document.createElement('div');
        listGroup.classList.add('list-group');
        let title = document.createElement('h4');
        title.innerHTML = i.title;
        let linkGroup = document.createElement('div');
        linkGroup.classList.add('link-group')
        listGroup.prepend(linkGroup);
        listGroup.prepend(title)
        i.items.forEach(function(link){
            a = document.createElement('a');
            a.classList.add('link');
            a.href = link.url;
            a.innerHTML = link.name;
            linkGroup.append(a)
        })
        mainContent.append(listGroup);
    })
}

function populateServerStatus(serverstatus){
    /*if (currentserverstatus.Error === true) {
        console.log("Error in server status response: " + currentserverstatus.ErrorStatus)
        return
    }*/
    if (serverstatus.Error === true ) {
        console.log("Error in server status response: " + serverstatus.ErrorStatus);
        return
    }
    console.log("Server Status Retrieved Successfully");

    let statusdiv = document.createElement('div');
    statusdiv.classList.add('server-status');
    statusdiv.innerText = "Server Status"

    countdowndiv = document.createElement('div')
    countdowndiv.id = 'countdown';
    countdowndiv.classList.add('countdown');
    statusdiv.append(countdowndiv)

    let blinker = document.createElement('div');
    let countdowntext = document.createElement('div');
    countdowntext.classList.add('server-countdown-text');

    if (serverstatus.Status === "Live") {
        blinker.classList.add('is-green');
        blinker.classList.add('is-blink');
        blinker.classList.add('text-uppercase');
        blinker.innerText = "Live"
        idate = new Date(serverstatus.EndDate);
        countdowndate = idate.getTime();
        countdowntext.innerText = "Until " + idate.toLocaleDateString("en-US", countdownoptions);
    } else {
        blinker.classList.add('is-red');
        blinker.innerText = "Scheduled "
        idate = new Date(serverstatus.StartDate);
        countdowndate = idate.getTime();
        countdowntext.innerText = " To Come Online At " + idate.toLocaleDateString("en-US", countdownoptions);
    }
    blinker.classList.add('ui-helper-center')
    statusdiv.append(countdowntext);

    let itag = document.createElement('i');
    itag.classList.add('fas');
    itag.classList.add('fa-circle');
    blinker.prepend(itag);
    blinker.classList.add('server-status-blinker');
    statusdiv.append(blinker);

    let serverstatustext = document.createElement('div');
    serverstatustext.classList.add('server-status-text');
    serverstatustext.innerText = " "
    statusdiv.append(serverstatustext);


    serverStatusBar.append(statusdiv);
    countdowninterval = setInterval(updateCountdown,1000);
}

function getServerStatus(){

    timeout(10000, fetch("https://api.dual.sh/serverstatus")).then(function(response) {
        return response.json();
    }).then(function(data){
        populateServerStatus(data);
    }).catch(function(error) {
        console.log("Timeout retrieving server status.")
    })

}

//Remove Category
function removeCategory(title){
    bookmarks.forEach((i, id)=>{
        if(i.title == title){
            bookmarks.splice(id,1);
        }
    })
    storeBookmarks();
    populateBookmarks();
}

//Add Category
function addCategory(title){
    console.log(title)
    bookmarks.push({ title : `${title}` ,  items : []});
    console.log(bookmarks);
    storeBookmarks();
    populateBookmarks();
}


//Get Weather Elements
const wLocation = document.getElementById('w-location');
const wIcon = document.getElementById('w-icon');
const wDesc = document.getElementById('w-desc');
const wTemp = document.getElementById('w-temp');

function convertKelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return 'below absolute zero (0 K)';
    } else {
        let myCelcius = 0;
        let myCelciusRounded = 0;
        myCelcius = kelvin-273.15;
        myCelciusRounded = Math.round(myCelcius);
        return myCelciusRounded;
    }
}


//Get Weather Function
/*
function getWeather(){
    weather.getWeather()
        .then(results => {
            wLocation.textContent = `${results.name}`;
            wIcon.src = `http://openweathermap.org/img/wn/${results.weather[0].icon}.png`
            wDesc.textContent = results.weather[0].main;
            wTemp.textContent = `${convertKelvinToCelsius(results.main.temp)}\u00B0C`;;

        })
        .catch(err => console.log(err));
}
*/

//Get Bookmarks from Local Storage
function getBookmarks(){
    if(localStorage.getItem('bookmarks') !== null){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    console.log(bookmarks);
    populateBookmarks();
    //createBookmarkForm();
}

//Store Bookmarks in Local Storage
function storeBookmarks(){
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

//Get Settings from Local Storage
function getSettings(){
    if(localStorage.getItem('settings') !== null){
        settings = JSON.parse(localStorage.getItem('settings'));
    }
}

//Store Settings in Local Storage
function storeSettings(){
    localStorage.setItem('settings', JSON.stringify(settings));
}

function timeout(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("promise timeout"))
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    })
}

// The good stuff happens here
getSettings();
updateSettings();
//Init Weather Object
//const weather = new Weather(settings.city,settings.country);
setupWelcomeMessage();
updateTime();
getBookmarks();
getServerStatus();
//getWeather();
setInterval(updateTime,1000);
