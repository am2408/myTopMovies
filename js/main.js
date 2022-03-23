let videos = [];

function isInt(n) {
    return n % 1 === 0;
}

function sortList(id) {
    let list, i, switching, b, shouldSwitch;
    list = document.getElementById(id);
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("option");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            // start by saying there should be no switching:
            shouldSwitch = false;
            /* check if the next item should
            switch place with the current item: */
            if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                /* if next item is alphabetically
                lower than current item, mark as a switch
                and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    let user = getCookie(cname);
    if (user != "") {
        return true;
    } else {
        return false;
    }
}

function getAllLang() {
    if (checkCookie('lang')) {
        getLang(getCookie('lang'));
        getPopular(getCookie('lang'));
        getTopRated(getCookie('lang'));
        getUpcoming(getCookie('lang'));
    } else {
        document.cookie = 'lang=fr';
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                let container = document.getElementById('lang');
                for (let i = 0; i < response.length; i++) {
                    let option = document.createElement('option');
                    option.value = response[i].iso_639_1;
                    if (response[i].name == '' || response[i].name.includes('?')) {
                        option.innerHTML = response[i].english_name;
                    } else {
                        option.innerHTML = response[i].name + ' (' + response[i].english_name + ')'
                    }
                    if (response[i].iso_639_1 == 'fr') {
                        option.setAttribute('selected', 'selected');
                    }
                    container.append(option);
                }
                sortList('lang');
                getPopular(getCookie('lang'));
                getTopRated(getCookie('lang'));
                getUpcoming(getCookie('lang'));
            }
        };

        xhttp.open("GET", "https://api.themoviedb.org/3/configuration/languages?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f", true); // get all languages
        xhttp.send();
    }
}

function getLang(lang) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            let container = document.getElementById('lang');
            for (let i = 0; i < response.length; i++) {
                let option = document.createElement('option');
                option.value = response[i].iso_639_1;
                if (response[i].name == '' || response[i].name.includes('?')) {
                    option.innerHTML = response[i].english_name;
                } else {
                    option.innerHTML = response[i].name + ' (' + response[i].english_name + ')'
                }
                if (response[i].iso_639_1 == lang) {
                    option.setAttribute('selected', 'selected');
                }
                container.append(option);
            }
            sortList('lang');
        }
    };

    xhttp.open("GET", "https://api.themoviedb.org/3/configuration/languages?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f", true); // get all languages
    xhttp.send();
}

function changeLangHome(e) {
    let lang = e.value;
    document.cookie = 'lang=' + lang;
    getPopular(lang);
    getTopRated(lang);
    getUpcoming(lang);
}

function changeLangDetail(id, e) {
    let lang = e.value;
    document.cookie = 'lang=' + lang;
    getMovie(id, lang);
}

function getPopular(lang) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText).results;
            let container = document.getElementById('popular');
            container.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                let image = "https://image.tmdb.org/t/p/w500/" + response[i].poster_path;
                let original_title = response[i].original_title;
                let title = response[i].title;
                let note = response[i].vote_average;
                let date = response[i].release_date;
                let id = response[i].id;
                let elementContent = document.createElement('a');
                elementContent.classList = 'movies';
                elementContent.href = 'details.php?id=' + id;
                let elementTitle = document.createElement('h2')
                elementTitle.classList = 'title titleMovie';
                elementTitle.innerHTML = original_title;
                let elementSecTitle = document.createElement('h3');
                elementSecTitle.classList = 'title titleSecond';
                elementSecTitle.innerHTML = title;
                let contentImg = document.createElement('div');
                contentImg.classList = 'contentImg';
                let elementImg = document.createElement('img');
                elementImg.classList = 'pics';
                elementImg.alt = 'movie pic';
                elementImg.src = image;
                contentImg.append(elementImg);
                let elementNote = document.createElementNS("http://www.w3.org/2000/svg", "svg");;
                let elementCircle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                elementCircle.setAttribute('stroke-dasharray', ((note / 10) * 100).toFixed(2) + ', 100');
                if (((note / 10) * 100).toFixed(2) >= 75) {
                    elementCircle.setAttribute('stroke', '#4CC790');
                } else if (((note / 10) * 100).toFixed(2) < 75 && ((note / 10) * 100).toFixed(2) >= 50) {
                    elementCircle.setAttribute('stroke', 'yellow');
                } else if (((note / 10) * 100).toFixed(2) < 50 && ((note / 10) * 100).toFixed(2) >= 25) {
                    elementCircle.setAttribute('stroke', 'orange');
                } else if (((note / 10) * 100).toFixed(2) < 25) {
                    elementCircle.setAttribute('stroke', 'red');
                }
                elementCircle.setAttribute('d', 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831');
                elementCircle.classList = 'circle';
                let textNote = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                if (isInt(note)) {
                    textNote.setAttribute('x', '13');
                } else {
                    textNote.setAttribute('x', '7');
                }
                textNote.setAttribute('y', '23');
                textNote.classList = 'noteVal';
                textNote.innerHTML = note;
                elementNote.append(elementCircle);
                elementNote.append(textNote);
                elementNote.classList = 'note';
                let elementDate = document.createElement('small');
                elementDate.classList = 'date';
                elementDate.innerHTML = date;
                contentImg.append(elementDate);
                elementContent.append(contentImg);
                elementContent.append(elementTitle);
                elementContent.append(elementSecTitle);
                elementContent.append(elementNote);
                container.append(elementContent);
            }
        }
    };

    xhttp.open("GET", "https://api.themoviedb.org/3/movie/popular?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=" + lang, true); // popular
    xhttp.send();
}

function getTopRated(lang) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText).results;
            let container = document.getElementById('top');
            container.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                let image = "https://image.tmdb.org/t/p/w500/" + response[i].poster_path;
                let original_title = response[i].original_title;
                let title = response[i].title;
                let note = response[i].vote_average;
                let date = response[i].release_date;
                let id = response[i].id;
                let elementContent = document.createElement('a');
                elementContent.classList = 'movies';
                elementContent.href = 'details.php?id=' + id;
                let elementTitle = document.createElement('h2')
                elementTitle.classList = 'title titleMovie';
                elementTitle.innerHTML = original_title;
                let elementSecTitle = document.createElement('h3');
                elementSecTitle.classList = 'title titleSecond';
                elementSecTitle.innerHTML = title;
                let contentImg = document.createElement('div');
                contentImg.classList = 'contentImg';
                let elementImg = document.createElement('img');
                elementImg.classList = 'pics';
                elementImg.alt = 'movie pic';
                elementImg.src = image;
                contentImg.append(elementImg);
                let elementNote = document.createElementNS("http://www.w3.org/2000/svg", "svg");;
                let elementCircle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                elementCircle.setAttribute('stroke-dasharray', ((note / 10) * 100).toFixed(2) + ', 100');
                if (((note / 10) * 100).toFixed(2) >= 75) {
                    elementCircle.setAttribute('stroke', '#4CC790');
                } else if (((note / 10) * 100).toFixed(2) < 75 && ((note / 10) * 100).toFixed(2) >= 50) {
                    elementCircle.setAttribute('stroke', 'yellow');
                } else if (((note / 10) * 100).toFixed(2) < 50 && ((note / 10) * 100).toFixed(2) >= 25) {
                    elementCircle.setAttribute('stroke', 'orange');
                } else if (((note / 10) * 100).toFixed(2) < 25) {
                    elementCircle.setAttribute('stroke', 'red');
                }
                elementCircle.setAttribute('d', 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831');
                elementCircle.classList = 'circle';
                let textNote = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                if (isInt(note)) {
                    textNote.setAttribute('x', '13');
                } else {
                    textNote.setAttribute('x', '7');
                }
                textNote.setAttribute('y', '23');
                textNote.classList = 'noteVal';
                textNote.innerHTML = note;
                elementNote.append(elementCircle);
                elementNote.append(textNote);
                elementNote.classList = 'note';
                let elementDate = document.createElement('small');
                elementDate.classList = 'date';
                elementDate.innerHTML = date;
                contentImg.append(elementDate);
                elementContent.append(contentImg);
                elementContent.append(elementTitle);
                elementContent.append(elementSecTitle);
                elementContent.append(elementNote);
                container.append(elementContent);
            }
        }
    };

    xhttp.open("GET", "https://api.themoviedb.org/3/movie/top_rated?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=" + lang, true); // top rated
    xhttp.send();
}

function getUpcoming(lang) {
    let xhttp = new XMLHttpRequest();
    let today = new Date();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText).results;
            let container = document.getElementById('upcoming');
            container.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                let image = "https://image.tmdb.org/t/p/w500/" + response[i].poster_path;
                let original_title = response[i].original_title;
                let title = response[i].title;
                let note = response[i].vote_average;
                let date = response[i].release_date;
                let id = response[i].id;
                let elementContent = document.createElement('a');
                elementContent.classList = 'movies';
                elementContent.href = 'details.php?id=' + id;
                let elementTitle = document.createElement('h2')
                elementTitle.classList = 'title titleMovie';
                elementTitle.innerHTML = original_title;
                let elementSecTitle = document.createElement('h3');
                elementSecTitle.classList = 'title titleSecond';
                elementSecTitle.innerHTML = title;
                let contentImg = document.createElement('div');
                contentImg.classList = 'contentImg';
                let elementImg = document.createElement('img');
                elementImg.classList = 'pics';
                elementImg.alt = 'movie pic';
                elementImg.src = image;
                contentImg.append(elementImg);
                let elementNote = document.createElementNS("http://www.w3.org/2000/svg", "svg");;
                let elementCircle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                elementCircle.setAttribute('stroke-dasharray', ((note / 10) * 100).toFixed(2) + ', 100');
                if (((note / 10) * 100).toFixed(2) >= 75) {
                    elementCircle.setAttribute('stroke', '#4CC790');
                } else if (((note / 10) * 100).toFixed(2) < 75 && ((note / 10) * 100).toFixed(2) >= 50) {
                    elementCircle.setAttribute('stroke', 'yellow');
                } else if (((note / 10) * 100).toFixed(2) < 50 && ((note / 10) * 100).toFixed(2) >= 25) {
                    elementCircle.setAttribute('stroke', 'orange');
                } else if (((note / 10) * 100).toFixed(2) < 25) {
                    elementCircle.setAttribute('stroke', 'red');
                }
                elementCircle.setAttribute('d', 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831');
                elementCircle.classList = 'circle';
                let textNote = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                if (isInt(note)) {
                    textNote.setAttribute('x', '13');
                } else {
                    textNote.setAttribute('x', '7');
                }
                textNote.setAttribute('y', '23');
                textNote.classList = 'noteVal';
                textNote.innerHTML = note;
                elementNote.append(elementCircle);
                elementNote.append(textNote);
                elementNote.classList = 'note';
                let elementDate = document.createElement('small');
                elementDate.classList = 'date';
                elementDate.innerHTML = date;
                contentImg.append(elementDate);
                elementContent.append(contentImg);
                elementContent.append(elementTitle);
                elementContent.append(elementSecTitle);
                let movieDate = new Date(date);
                if (today >= movieDate) {
                    elementContent.append(elementNote);
                }
                container.append(elementContent);
            }
        }
    };

    xhttp.open("GET", "https://api.themoviedb.org/3/movie/upcoming?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=" + lang, true); // upcoming
    xhttp.send();
}

function getMovie(id, lang) {
    getVideo(id, lang);
    let xhttp = new XMLHttpRequest();
    let today = new Date();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            let image = "https://image.tmdb.org/t/p/w500/" + response.poster_path;
            let original_title = response.original_title;
            let title = response.title;
            let note = response.vote_average;
            let date = response.release_date;
            let synop = response.overview;
            let container = document.getElementById('details');
            container.innerHTML = '';
            let elementTitle = document.createElement('h2')
            elementTitle.classList = 'title titleMovie';
            elementTitle.innerHTML = original_title;
            let elementSecTitle = document.createElement('h3');
            elementSecTitle.classList = 'title titleSecond';
            elementSecTitle.innerHTML = title;
            let elementImg = document.createElement('img');
            elementImg.classList = 'pics';
            elementImg.alt = 'movie pic';
            elementImg.src = image;
            let elementSynop = document.createElement('p');
            elementSynop.classList = 'synop';
            elementSynop.innerHTML = synop;
            let elementNote = document.createElementNS("http://www.w3.org/2000/svg", "svg");;
            let elementCircle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            elementCircle.setAttribute('stroke-dasharray', ((note / 10) * 100).toFixed(2) + ', 100');
            if (((note / 10) * 100).toFixed(2) >= 75) {
                elementCircle.setAttribute('stroke', '#4CC790');
            } else if (((note / 10) * 100).toFixed(2) < 75 && ((note / 10) * 100).toFixed(2) >= 50) {
                elementCircle.setAttribute('stroke', 'yellow');
            } else if (((note / 10) * 100).toFixed(2) < 50 && ((note / 10) * 100).toFixed(2) >= 25) {
                elementCircle.setAttribute('stroke', 'orange');
            } else if (((note / 10) * 100).toFixed(2) < 25) {
                elementCircle.setAttribute('stroke', 'red');
            }
            elementCircle.setAttribute('d', 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831');
            elementCircle.classList = 'circle';
            let textNote = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            if (isInt(note)) {
                textNote.setAttribute('x', '13');
            } else {
                textNote.setAttribute('x', '7');
            }
            textNote.setAttribute('y', '23');
            textNote.classList = 'noteVal';
            textNote.innerHTML = note;
            elementNote.append(elementCircle);
            elementNote.append(textNote);
            elementNote.classList = 'note';
            let elementDate = document.createElement('small');
            elementDate.classList = 'date';
            elementDate.innerHTML = date;
            let elementVideo = document.createElement('iframe');
            elementVideo.setAttribute('width', '420');
            elementVideo.setAttribute('height', '315');
            elementVideo.src = videos[0];
            container.append(elementImg);
            container.append(elementTitle);
            container.append(elementSecTitle);
            container.append(elementSynop);
            container.append(elementVideo);
            let movieDate = new Date(date);
            if (today >= movieDate) {
                container.append(elementNote);
            }
            container.append(elementDate);
        }
    };

    xhttp.open("GET", "https://api.themoviedb.org/3/movie/" + id + "?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=" + lang, true); // get movie
    xhttp.send();
}

function getVideo(id, lang) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText).results;
            videos = [];
            for (let i = 0; i < response.length; i++) {
                videos.push('https://www.youtube.com/embed/' + response[i].key + '?origin=https://www.themoviedb.org');
            }
        }
    };

    xhttp.open("GET", "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=" + lang, true); // get video
    xhttp.send();
}