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
var allRequestedMovies = [];


// Includes for the best movie in HTML
async function getMovieAllData(justNeededMovies) {

    console.log("getMovies...", justNeededMovies); // test

    for (const movie of justNeededMovies) {
        
        try {
            const response = await fetch(apiUri+movie.id);
            const movieData = await response.json();
            console.log(movieData); // test
            console.log(movieData.title); // test
            
            const imageElement = document.createElement("img");
            imageElement.src = movieData.image_url;
            const titleElement = document.createElement("h2");
            titleElement.textContent = movieData.title;
            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = movieData.description;

            const sectionBest = document.getElementById("best");
            sectionBest.appendChild(imageElement);
            sectionBest.appendChild(titleElement);
            sectionBest.appendChild(descriptionElement);


            
        }
        catch (err) {
            console.log(err);
            document
                .getElementById("errors")
                .textContent = err;
        }
        
    }
};


// Get the collection of data relative of the wished set of urls and items number.
async function recursiveFetch(url, numberItems, startNumberItems) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const moviesOnePage = data["results"];
        allRequestedMovies.push(...moviesOnePage);
        const nextUrl = data["next"];            
        numberItems -= itemsPerPage;
        console.log("number of items", numberItems);
        
        if (numberItems > 0) {
            await recursiveFetch(nextUrl, numberItems);
        } else {
            console.log("Recherche terminée"); // test
            console.log("Nombre films", allRequestedMovies.length); //test
            const numberOfItemsToDelete = allRequestedMovies.length-startNumberItems
            allRequestedMovies.splice(parameters.best.firstItem+1, numberOfItemsToDelete);
            return allRequestedMovies;
        };

    } catch (err) {
        console.log(err);
        document
            .getElementById("errors")
            .textContent = err;
    };
};


// main function.
async function feedPage() {

    try {
        await recursiveFetch(apiUri+parameters.best.endPoint, parameters.best.numberItems, parameters.best.numberItems);
        console.log("test response inside feedPage..", allRequestedMovies.length); // test
        getMovieAllData(allRequestedMovies);
    } catch (err) {
        console.log(e); //test à revoir
        document
            .getElementsById("errors")
            .textContent = err;
    }
}

feedPage();


/*
- get the titles dataset of the requested numbers of movies according criteria
    a category -> 
    get all from the needed number of pages
    splice collection according the needed movies numbers
- extract id of the movies
- get the complete data set of each requested movie get with the movie url.
- loop to create the html elements for each movie
    can be a single function for all cases (what about the modal window ?)
*/
