// Parameters
const itemsPerPage = 5; // Number of items per page of API
const apiUri = 'http://127.0.0.1:8000/api/v1/titles/'; // Root of the API url
// {id: {categorieName : "", genreId : x,endPoint: "",firstItem: index, numberItems: nb}}}
const parameters = [
    { htmlId: "best", categoryName: "Meilleur film", endPoint: '?sort_by=-imdb_score', firstItem: 0, numberItems: 1 },
    { htmlId: "category1", categoryName: "Films les mieux notés", endPoint: '?sort_by=-imdb_score', firstItem: 1, numberItems: 8 },
    { htmlId: "category2", categoryName: "Animation", endPoint: '?genre=animation&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category3", categoryName: "Mystery", endPoint: '?genre=mystery&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category4", categoryName: "Western", endPoint: '?genre=western&sort_by=-imdb_score', firstItem: 0, numberItems: 7 }
];


// Includes for the best movie in HTML
async function getMoviesAllData(movies, i) {

    console.log("getMovies...", movies); // test

    const blocElement = document.getElementById(parameters[i].htmlId);
    console.log("htmlId", parameters[i].htmlId)
    const categoryElement = document.createElement("ul");
    categoryElement.setAttribute("style", "list-style-type:none"); // peut-être à mettre dans le CSS
    categoryElement.textContent = parameters[i].categoryName;
    console.log("categoryElement", categoryElement);
    blocElement.appendChild(categoryElement);

    for (const index in movies) {

        const movieId = movies[index].id;

        try {
            const response = await fetch(apiUri + movieId);
            const movieData = await response.json();
            console.log("MovieData : ", movieData); // test
            console.log(movieData.duration); // test

            // Create and append Elements for the foreground
            const imageElement = document.createElement("img");
            imageElement.src = (movieData.image_url ? movieData.image_url : "") ;
            const titleElement = document.createElement("h2");
            titleElement.textContent = (movieData.title ? movieData.title : "") ;
            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = (movieData.description ? movieData.description : "") ;

            const movieElement = document.createElement("li");

            movieElement.append(imageElement, titleElement, descriptionElement);

            categoryElement.appendChild(movieElement);

            //Create and append in the foreground Elements for the modal

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


        } catch (err) {
            console.log(err);
            document
                .getElementById("errors")
                .textContent = err;
        }

    }
};


// Get the collection of data relative of the wished set of urls and items number.
async function recursiveFetch(url, allRequestedMovies, numberItems) {

    try {
        const response = await fetch(url);
        const data = await response.json();
        const moviesOnePage = data["results"];
        allRequestedMovies.push(...moviesOnePage);
        const nextUrl = data["next"];
        numberItems -= itemsPerPage;

        if (numberItems > 0) {
            await recursiveFetch(nextUrl, allRequestedMovies, numberItems);
        } else {
            console.log("else numberItems", numberItems);
            await allRequestedMovies.splice(numberItems);
        };
    } catch (err) {
        console.log(err);
        document
            .getElementById("errors")
            .textContent = err;
    };
    return allRequestedMovies;
};


// main function.
async function feedPage() {

    console.log("parameters.length", parameters.length); // test

    for (let i = 0; i < parameters.length; i++) {

        try {
            let allRequestedMovies = [];
            const justNeededMovies = await recursiveFetch(apiUri + parameters[i].endPoint, allRequestedMovies, parameters[i].numberItems);
            
            console.log("feedpage try firstItem, i",parameters[i].firstItem, i);

            if (parameters[i].firstItem === 1) {
                console.log("feedPage if firstItem", parameters[i].firstItem)
                const movieToDelete = justNeededMovies.shift();
                console.log("movieToDelete", movieToDelete);
            };

            await getMoviesAllData(justNeededMovies, i);
        } catch (err) {
            console.log(err);
            document
                .getElementById("errors")
                .textContent = err;
        }
    }
}


feedPage();