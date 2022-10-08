// Parameters
const itemsPerPage = 5; // Number of items per page of API
const apiUri = 'http://127.0.0.1:8000/api/v1/titles/'; // Root of the API url
// {id: {categorieName : "", genreId : x,endPoint: "",firstItem: index, numberItems: nb}}}
const parameters = {
    best: {categoryName: "Meilleur film", genreId: "All", endPoint: '?sort_by=-imdb_score', firstItem: 0, numberItems: 1},
    category1: {categoryName: "Films les mieux notés", genreId:"All", endPoint: '?sort_by=-imdb_score', firstItem: 1, numberItems: 8},
    category2: {categoryName: "Animation", genreId: 18, endPoint: "?sort_by=-imdb_score", firstItem: 0, numberItems: 7},
    category3: {categoryName:"Mystery", genreId:9, endPoint: "?sort_by=-imdb_score", firstItem: 0, numberItems: 7},
    category4: {categoryName: "Western", genreId: 11, endPoint: "?sort_by=-imdb_score", firstItem: 0, numberItems: 7}
}; 
let allRequestedMovies = [];
let titles = []


// Get the collection of data relative of the wished set of urls and items number.
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
            console.log("Recherche terminée"); // test
            console.log("Nombre films", allRequestedMovies.length); //test
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
function createListTitlelement(justNeededMovies, firstItem, numberItems) {

    titles = justNeededMovies.map(movie => movie.title);
    console.log('titles in addTitles', titles); //test

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
        await recursiveFetch(apiUri+parameters.best.endPoint, parameters.best.numberItems);
        console.log("test response inside feedPage..", allRequestedMovies.length); // test
        console.log("nbcar deleted", allRequestedMovies.length-parameters.best.numberItems) //test
        allRequestedMovies.splice(parameters.best.firstItem+1, allRequestedMovies.length-parameters.best.numberItems);
        createListTitlelement(allRequestedMovies);
    } catch (e) {
        console.log("planté"); //test à revoir
    }
}

feedPage();
// Display the movie with the best imdb_score.
// Display the top of imdb_scores.
// Display the top of imdb_scores of the category 2.
// Display the top of imdb_scores of the category 3.
// Display the top of imdb_scores of the category 4.