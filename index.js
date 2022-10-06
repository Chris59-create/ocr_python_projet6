let response = [];
let occurencesNumber = 2;
let titles = []

function addTitles(items) {
    response.push(...items);
    titles = response.map(movie => movie.title);
    console.log('titles in addTitles', titles);
    return titles;
    };
        

function createListTitlelement(titles) {

    const titlesElement = document.createElement("ul");

    for (let i = 0; i < titles.length; i++) {
        const titleElement = document.createElement("li");
        titleElement.textContent = titles[i];
        titlesElement.appendChild(titleElement);
    }
    
    document.getElementById("vedette").appendChild(titlesElement); 
    };



function recursiveFetch(url) {
    if (occurencesNumber > 0) {
        fetch(url)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            const items = value["results"];
            addTitles(items);
            return value;
            //return titles;
        })
        .then(function(value) {
            const nextUrl = value["next"];
            occurencesNumber--;
            console.log('occurrencesNumber', occurencesNumber);
            recursiveFetch(nextUrl);
        })
        .catch(function(err) {
            document
                .getElementById("vedette")
                .textContent = err;
        });
    }else{
        createListTitlelement(titles);
    };  
};


recursiveFetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score");

// Get the collection of data relative of the wished set of urls.
// Extracts targeted data of the collection of data.
// Includes the data in the HTML

// Display the movie with the best imdb_score.
// Display the top of imdb_scores.
// Display the top of imdb_scores of the category 2.
// Display the top of imdb_scores of the category 3.
// Display the top of imdb_scores of the category 4.