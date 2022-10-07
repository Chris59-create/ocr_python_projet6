// Parameters
const itemsPerPage = 5; // Number of items per page of API
let allRequestedMovies = [];
let titles = []


// Get the collection of data relative of the wished set of urls.
async function recursiveFetch(url, numberOfItems) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const moviesOnePage = data["results"];
        allRequestedMovies.push(...moviesOnePage);
        const nextUrl = data["next"];            
        numberOfItems -= itemsPerPage;
        console.log("number of items", numberOfItems);
        
        if (numberOfItems > 0) {
            await recursiveFetch(nextUrl, numberOfItems);
        } else {
            console.log("Recherche terminée");
            console.log("test response inside else..", allRequestedMovies.length);
            return allRequestedMovies;
        };
    } catch (err) {
        console.log(err);
        document
            .getElementById("vedette")
            .textContent = err;
    };
};


// Includes the data in the HTML
function createListTitlelement(response) {

    titles = response.map(movie => movie.title);
    console.log('titles in addTitles', titles);


    const titlesElement = document.createElement("ul");

    for (let i = 0; i < titles.length; i++) {
        const titleElement = document.createElement("li");
        titleElement.textContent = titles[i];
        titlesElement.appendChild(titleElement);
    }
    
    document.getElementById("vedette").appendChild(titlesElement);
    };

// main function.
async function feedPage() {
    try {
        await recursiveFetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score", 7);
        console.log("test response inside feedPage..", allRequestedMovies.length);
        createListTitlelement(allRequestedMovies);
    } catch (e) {
        console.log("planté");
    }
    
}

feedPage();
// Display the movie with the best imdb_score.
// Display the top of imdb_scores.
// Display the top of imdb_scores of the category 2.
// Display the top of imdb_scores of the category 3.
// Display the top of imdb_scores of the category 4.