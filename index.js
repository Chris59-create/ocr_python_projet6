// Parameters
const itemsPerPage = 5; // Number of items per page of API
const apiUri = 'http://127.0.0.1:8000/api/v1/titles/'; // Root of the API url
// {id: {categorieName : "", genreId : x,endPoint: "",firstItem: index, numberItems: nb}}}
const parameters = [
    { htmlId: "best", categoryName: "Meilleur film", genreId: "All", endPoint: '?sort_by=-imdb_score', firstItem: 0, numberItems: 1 },
    { htmlId: "category1", categoryName: "Films les mieux notés", genreId: "All", endPoint: '?sort_by=-imdb_score', firstItem: 1, numberItems: 8 },
    { htmlId: "category2", categoryName: "Animation", genreId: 18, endPoint: "?sort_by=-imdb_score", firstItem: 0, numberItems: 7 },
    { htmlId: "category3", categoryName: "Mystery", genreId: 9, endPoint: "?sort_by=-imdb_score", firstItem: 0, numberItems: 7 },
    { htmlId: "category4", categoryName: "Western", genreId: 11, endPoint: "?sort_by=-imdb_score", firstItem: 0, numberItems: 7 }
];
var allRequestedMovies = [];


// Includes for the best movie in HTML
async function getMovieAllData(justNeededMovies, i) {

    console.log("getMovies...", justNeededMovies); // test

    for (const movie of justNeededMovies) {

        const blocElement = document.getElementById(parameters[i].htmlId);
        const categoryElement = document.createElement("ul");
        categoryElement.setAttribute("style", "list-style-type:none"); // peut-être )à mettre dans le CSS
        categoryElement.textContent = parameters[i].categoryName;
        blocElement.appendChild(categoryElement);


        try {
            const response = await fetch(apiUri + movie.id);
            const movieData = await response.json();
            console.log("MovieData : ", movieData); // test
            console.log(movieData.duration); // test

            const imageElement = document.createElement("img");
            imageElement.src = (movieData.image_url ? movieData.image_url : "") ;
            const titleElement = document.createElement("h2");
            titleElement.textContent = (movieData.title ? movieData.title : "") ;
            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = (movieData.description ? movieData.description : "") ;

            const movieElement = document.createElement("li");

            movieElement.append(imageElement, titleElement, descriptionElement);

            categoryElement.appendChild(movieElement);

            const modalElements = document.createElement("div");

            const typeElement = document.createElement("p");
            typeElement.textContent = "Genre(s): " + (movieData.genres ? movieData.genres : "" );
            const releaseDateElement = document.createElement("p");
            releaseDateElement.textContent = "Année: " + (movieData.year ? movieData.year : "");
            const rateElement = document.createElement("p");
            rateElement.textContent = "Evaluation: " + (movieData.rated ? movieData.rated: "");
            const imdbElement = document.createElement("p");
            imdbElement.textContent = "Imdb_score: " + (movieData.imdb_score ? movieData.imdb_score : "");
            const directorElement = document.createElement("p");
            directorElement.textContent = "Réalisateur(s): " + (movieData.directors ? movieData.directors : "");
            const actorsElement = document.createElement("p");
            actorsElement.textContent = "Acteurs: " + (movieData.actors ? movieData.actors : "");
            const durationElement = document.createElement("p");
            durationElement.textContent = "Durée: " + (movieData.duration ? movieData.duration + "mn" : "");
            const countriesElement = document.createElement("p");
            countriesElement.textContent = "Pays: " + (movieData.countries ? movieData.countries : "");
            const boxOfficeElement = document.createElement("p");
            boxOfficeElement.textContent = "Box office: " + (movieData.worldwide_gross_income ? movieData.worldwide_gross_income + "$" : "");
            const longDescriptionElement = document.createElement("p");
            longDescriptionElement.textContent = "Description : " + (movieData.long_description ? movieData.long_description : "");

            modalElements.append(
                longDescriptionElement,
                typeElement,
                releaseDateElement,
                rateElement,
                imdbElement,
                directorElement,
                actorsElement,
                durationElement,
                countriesElement,
                boxOfficeElement
            );

            movieElement.appendChild(modalElements);


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
async function recursiveFetch(url, firstItem, numberItems, startNumberItems) {
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
            const numberOfItemsToDelete = allRequestedMovies.length - startNumberItems
            allRequestedMovies.splice(firstItem + 1, numberOfItemsToDelete);
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
        for (let i = 0; i <= parameters.length; i += 1) {
            await recursiveFetch(apiUri + parameters[i].endPoint, parameters[0].firstItem, parameters[i].numberItems, parameters[i].numberItems);
            console.log("test response inside feedPage..", allRequestedMovies.length); // test
            getMovieAllData(allRequestedMovies, i);
        }
    } catch (err) {
        console.log(err); //test à revoir
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
