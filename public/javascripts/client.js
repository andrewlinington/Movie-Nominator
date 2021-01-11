const box = document.getElementById('box');
const results = document.getElementById('results');
const moviesLeft = document.getElementById('movies');
const nominations = document.getElementById('nominees');
const searchBar = document.getElementById('search');
const movieEntry = document.getElementById("movieEntry");
const nominationEntry = document.getElementById("nominationEntry");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const APIKey = "cde8ecf0"
var url;
var search;
var moviesSearchList;
var movieSearch;
var node;
var nominationsList = new Array(0);;
var movieTitle;
var movieButton;
var moviePages;
var pageNum = 1;


searchBar.oninput = searchMovies;
window.onbeforeunload = function () {
    localStorage.setItem('nomList', JSON.stringify(nominationsList));
}

window.onload = function () {
    nominationsList = JSON.parse(localStorage.getItem('nomList'));
    if (nominationsList === null || nominationsList === undefined){
        nominationsList = new Array(0);
    } else {
        refreshNominations();
    }
}

function refreshLists (){
    refreshNominations()
    refreshMovies()
}

function refreshNominations(){
    nominations.innerHTML = "";
    for(var i = 0; i < nominationsList.length; i++) {
        if(nominationsList[i] !== undefined && nominationsList[i] != null){
            node = nominationEntry.content.cloneNode(true);
            movieTitle = node.querySelectorAll("h4");
            movieTitle[0].innerHTML = "&bull; " + nominationsList[i].Title + "&nbsp;(" +nominationsList[i].Year + ")" + movieTitle[0].innerHTML + "";
            movieButton = movieTitle[0].querySelectorAll("button");
            movieButton[0].id = i;
            movieButton[0].style.marginLeft = "5px";
            nominations.appendChild(node);
        }
    }

}

function refreshMovies(){
    moviesLeft.innerHTML = "";
    for(var i = 0; i < moviesSearchList.length; i++) {
        node = movieEntry.content.cloneNode(true);
        movieTitle = node.querySelectorAll("h4");
        movieTitle[0].innerHTML = "&bull; " + moviesSearchList[i].Title + "&nbsp;(" + moviesSearchList[i].Year + ")" + movieTitle[0].innerHTML;
        movieButton = movieTitle[0].querySelectorAll("button");
        movieButton[0].id = i;
        movieButton[0].style.marginLeft = "5px";
        for (var ii = 0; ii < nominationsList.length; ii++) {
            if (nominationsList[ii] !== undefined && nominationsList[ii] != null) {
                if(nominationsList[ii].Title === moviesSearchList[i].Title && nominationsList[ii].Year === moviesSearchList[i].Year ){
                    movieButton[0].disabled = true;
                    break;
                }
            }
        }
        moviesLeft.appendChild(node);
    }
}

function removeNomination(button) {
    nominationsList[parseInt(button.id)] = undefined;
    refreshLists();
}


function isEmpty () {
    if(nominationsList.length === 5 ) {
        for (ii = 0; ii < nominationsList.length; ii++) {
            if (undefined === nominationsList[ii] || nominationsList[ii] === null) {
                return true;
            }
        }
        return false;
    } else {
        return true;
    }

}

function nominateMovie(button) {
    var i = parseInt(button.id);
    var ii;
    node = nominationEntry.content.cloneNode(true);
    movieTitle = node.querySelectorAll("h4");
    movieTitle[0].innerHTML = "&bull; " + moviesSearchList[i].Title + "&nbsp;(" + moviesSearchList[i].Year + ")" + movieTitle[0].innerHTML;
    movieButton = movieTitle[0].querySelectorAll("button");
    if(isEmpty()) {
        button.disabled = true;
        for (ii = 0; ii < nominationsList.length || ii < 5; ii++) {
            if (nominationsList[ii] === undefined || nominationsList[ii] === null) {
                movieButton[0].id = ii;
                movieButton[0].style.marginLeft = "5px";
                nominationsList[ii] = moviesSearchList[i];
                break;
            }
        }
        if (ii === nominationsList.length) {
            nominationsList.push(moviesSearchList[i]);
            movieButton[0].id = ii;
        }
        nominations.appendChild(node);
        if (!isEmpty()) {
            alert("Thank you for your 5 nominations");
        }
    } else {
        alert("You've already used all your nominations");
    }
}


function nextPage(){
    pageNum++;
    searchForPage()
}

function prevPage(){
    pageNum--;
    searchForPage()
}

function addPaging(){
    if(moviePages > pageNum) {
        next.style.visibility = 'visible';
    } else {
        next.style.visibility = 'hidden';
    }
    if(pageNum > 1) {
        prev.style.visibility = 'visible';
    } else {
        prev.style.visibility = 'hidden';
    }
}



function searchForPage (){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var movies = JSON.parse(this.response);
            if (movies.Response === "True") {
                moviesSearchList = movies.Search;
                moviePages = Math.ceil( parseInt(movies.totalResults) /10.0);
                refreshMovies();
                addPaging()
                results.innerHTML = search;
                box.style.visibility = 'hidden';
            } else {
                results.innerHTML = movies.Error;
                box.style.visibility = 'hidden';
                next.style.visibility = 'hidden';
                prev.style.visibility = 'hidden';
            }
        }
    };
    box.style.visibility = 'visible';
    moviesLeft.innerHTML = "";
    if (movieSearch == null) {
        movieSearch = "";
    } else {
        url = "https://www.omdbapi.com/?apikey=" + APIKey + "&type=movie&page=" + pageNum + "&s=" + movieSearch;
        search = "Results for \"" + movieSearch + "\"";
        xhttp.open("GET", url, true);
        xhttp.send();
    }
}

function searchMovies() {
    movieSearch = searchBar.value;
    pageNum = 1;
    if (movieSearch !== undefined && movieSearch.length >= 1) {
        searchForPage()
    }
}
