
class LocationSearch {
    constructor(cityName, latitude, longitude) {
        this.cityName = cityName;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

// Initialize or retrieve search histories from local storage
let savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
localStorage.setItem('savedSearches', JSON.stringify(savedSearches));

let lastSearchItem = JSON.parse(localStorage.getItem('lastSearchItem')) || {};
localStorage.setItem('lastSearchItem', JSON.stringify(lastSearchItem));

// Declare variables for UI elements
let loadingIndicator = false;

const searchContainer = $('#search-container');
const searchHistorySection = $('#search-history');
const emptySearchMessage = $('#empty-search');
const weatherDetailsSection = $('#weather-details');
const weatherForecastSection = $('#weather-forecast');

const cityInputField = $('#city-input');
const searchButton = $('#search-button');
const clearHistoryButton = $('#clear-history-button');

let searchHistory = JSON.parse(localStorage.getItem('savedSearches'));

// Function to handle city search
function handleCitySearch(event) {
    loadingIndicator = true;
    let cityInput = cityInputField.val().trim();

    // Check if city already searched
    if (searchHistory.some(search => search.cityName === cityInput)) {
        loadingIndicator = false;
        return;
    }

    // Construct API request for city search
    let geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid='420c006df726b132282a06990426589b`;

    fetch(geoApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Response not OK');
        }
        return response.json();
    }).then(data => {
        if (!data.length) {
            throw new Error('No data found');
        }
        // Add new search to history and update local storage
        let newSearchIndex = searchHistory.push(new LocationSearch(cityInput, data[0].lat, data[0].lon)) - 1;
        localStorage.setItem('savedSearches', JSON.stringify(searchHistory));
        showSearchHistory(newSearchIndex);
        displayWeatherForCity(newSearchIndex);
    }).catch(() => {
        loadingIndicator = false;
    });
}

// Function to display weather details for a city
function displayWeatherForCity(index) {
    emptySearchMessage.hide();
    weatherDetailsSection.show();
    weatherForecastSection.show();

    loadingIndicator = true;

    let weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${searchHistory[index].latitude}&lon=${searchHistory[index].longitude}&appid=&units=imperial` = '420c006df726b132282a06990426589b';

    fetch(weatherApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Response not OK');
        }
        return response.json();
    }).then(data => {
        let forecastItems = weatherForecastSection.children();
        data.list.forEach((item, i) => {

        });
        loadingIndicator = false;
    }).catch(() => {
        loadingIndicator = false;
    });
}

// Clear search history
function clearSearchHistory() {
    localStorage.setItem('savedSearches', JSON.stringify([]));
    searchHistorySection.empty();
}

// Display historical search as buttons
function showSearchHistory(index) {
    let historyBtn = $('<button>').addClass('button-class').text(searchHistory[index].cityName);
    historyBtn.on('click', () => displayWeatherForCity(index));
    searchHistorySection.append(historyBtn);
}

// Event listeners for UI interactions
searchButton.click(handleCitySearch);
clearHistoryButton.click(clearSearchHistory);

// Populate search history on load
searchHistory.forEach((_, index) => showSearchHistory(index));





//////////////


// API Call: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// Documentation: https://openweathermap.org/forecast5

//#region Class and Function Definitions
class WeatherLocation {
    constructor(city, lat, lon) {
        this.city = city;
        this.lat = lat;
        this.lon = lon;
    }
}
//#endregion

//#region Local Storage Initialization

//#endregion

//#region Runtime variables
var IsLoading_Page = false;

const SECTION_SearchContainer = $('#Search-Container');
const SECTION_SearchHistory = $('#Search-History');
const SECTION_NoSearch = $('#No-Search');
const SECTION_CurrentWeather = $('#Current-Weather');
const SECTION_Forecast = $('#Forecast');

const IN_InputCity = $('#Input-City');
const BTN_SearchCity = $('#Search-City');
const BTN_ResetSearchHistory = $('#Reset-Search-History');

var SearchHistory = JSON.parse(localStorage.getItem('Searches'));
//#endregion

//#region Runtime Functions
/**
 * Used when searching a new city through the input forms
 * @param {Event} event 
 */
let SearchCity = function (event) {
    IsLoading_Page = true;
    let searchCityInput = IN_InputCity[0].value;

    SearchHistory.forEach((search) => {
        if (search.city === searchCityInput) {
            IsLoading_Page = false;
            return;
        }
    });

    try {
        var apiCall =
            'http://api.openweathermap.org/geo/1.0/direct?q='
            + searchCityInput +
            '&limit=1&appid='
            + '420c006df726b132282a06990426589b';

        fetch(apiCall)
            .then((response) => {
                if (!response) {
                    throw true;
                }
                return response.json();
            })
            .then((data) => {
                if (data.length == 0) {
                    throw true;
                }
                var newIndex = SearchHistory.push(new WeatherLocation(
                    searchCityInput,
                    data[0].lat,
                    data[0].lon
                ));
                localStorage.setItem('Searches', JSON.stringify(SearchHistory));
                SearchHistory = JSON.parse(localStorage.getItem('Searches'));
                newIndex--;
                return newIndex;
            }).then((newIndex) => {
                DisplayHistory(newIndex);
                DisplayCity(newIndex);
            })
    } catch {
        IsLoading_Page = false;
        return;
    }
}

/**
 * 
 * @param {number} index 
 */
let DisplayCity = function (index) {
    SECTION_NoSearch.attr('hidden', true);
    SECTION_CurrentWeather.attr('hidden', false);
    SECTION_Forecast.attr('hidden', false);

    IsLoading_Page = true;

    try {
        var apiCall =
            'http://api.openweathermap.org/data/2.5/forecast?lat='
            + SearchHistory[index].lat +
            '&lon='
            + SearchHistory[index].lon +
            '&appid='
            + '420c006df726b132282a06990426589b' +
            '&units=imperial';
        fetch(apiCall)
            .then((response) => {

                if (!response) {
                    throw true;
                }
                return response.json();
            })
            .then((data) => {
                const weatherList = data.list;
                var forecastItems = SECTION_Forecast.children();

                for (i = 0; i < 6; i++) {
                    var editLabels;
                    if (i == 0) {
                        editLabels = SECTION_CurrentWeather.children();
                    } else {
                        editLabels = forecastItems.eq(i - 1).children();
                    }
                    var listI = i * 8;
                    if (listI == 40) listI--;

                    editLabels.eq(0).text(data.city.name);
                    editLabels.eq(1).text(new Date(weatherList[listI].dt * 1000).toLocaleDateString('en-US'));
                    editLabels.eq(2).attr('src', () => {
                        return 'https://openweathermap.org/img/wn/' + weatherList[listI].weather[0].icon + '.png';
                    });
                    editLabels.eq(3).text('Temperature: ' + weatherList[listI].main.temp + '°F');
                    editLabels.eq(4).text('Wind: ' + weatherList[listI].wind.speed + '/mph');
                    editLabels.eq(5).text('Humidity: ' + weatherList[listI].main.humidity + '%');
                }
            });
    } catch {
        IsLoading_Page = false;
        return;
    }
}

let ResetInputs = function () {
    localStorage.setItem('Searches', JSON.stringify([]));
    SECTION_SearchHistory.children().off();
    SECTION_SearchHistory.html('');
}

let DisplayHistory = function (index) {
    var historyButton = $('<button>');
    historyButton.addClass('text-center b-0 mb-2 btn btn-success col')
    historyButton.attr('data-index', index);
    historyButton.text(SearchHistory[index].city);
    historyButton.on('click', { index: historyButton.attr('data-index') }, function (event) {
        DisplayCity(event.data.index);
    });
    SECTION_SearchHistory.append(historyButton);
}

//#endregion

//#region Add Event Listeners
BTN_SearchCity.on('click', SearchCity);
BTN_ResetSearchHistory.on('click', ResetInputs)
//#endregion

SearchHistory.forEach((history, index) => {
    DisplayHistory(index);
});