// Parameters
const itemsPerPage = 5; // Number of items per page of API
const apiUri = 'http://127.0.0.1:8000/api/v1/titles/'; // Root of the API url
// {id: {categorieName : "", endPoint: "", firstItem: index, numberItems: nb}}}
const parameters = [
    { htmlId: "best", categoryName: "Meilleur film", endPoint: '?sort_by=-imdb_score', firstItem: 0, numberItems: 1 },
    { htmlId: "category1", categoryName: "Films les mieux notés", endPoint: '?sort_by=-imdb_score', firstItem: 1, numberItems: 8 },
    { htmlId: "category2", categoryName: "Animation", endPoint: '?genre=animation&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category3", categoryName: "Mystery", endPoint: '?genre=mystery&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category4", categoryName: "Western", endPoint: '?genre=western&sort_by=-imdb_score', firstItem: 0, numberItems: 7 }
];


//  Create the HTML elements
async function getMoviesAllData(movies, i) {

    const blocElement = document.getElementById(parameters[i].htmlId);

    


    const categoryElement = document.createElement("ul");
    categoryElement.setAttribute("style", "list-style-type:none"); // peut-être à mettre dans le CSS
    categoryElement.textContent = parameters[i].categoryName;
    blocElement.appendChild(categoryElement);

    for (const index in movies) {

        const movieId = movies[index].id;

        try {
            const response = await fetch(apiUri + movieId);
            const movieData = await response.json();

            // Create and append Elements for the foreground
            const imageElement = document.createElement("img");
            imageElement.classList.add("forModal");
            imageElement.src = (movieData.image_url ? movieData.image_url : "");
            imageElement.onclick = function() {
                modal.style.display = "block";
                };
            const titleElement = document.createElement("h2");
            imageElement.classList.add("forModal");
            titleElement.textContent = (movieData.title ? movieData.title : "");
            const descriptionElement = document.createElement("p");
            imageElement.classList.add("forModal");
            descriptionElement.textContent = (movieData.description ? movieData.description : "");

            const movieElement = document.createElement("li");

            

            //Create and append in the foreground elements for the modal

            const typeElement = document.createElement("p");
            typeElement.classList.add("forModal", "hidden");
            typeElement.textContent = "Genre(s): " + (movieData.genres ? movieData.genres : "" );
            const releaseDateElement = document.createElement("p");
            releaseDateElement.classList.add("forModal", "hidden");
            releaseDateElement.textContent = "Année: " + (movieData.year ? movieData.year : "");
            const rateElement = document.createElement("p");
            rateElement.classList.add("forModal", "hidden");
            rateElement.textContent = "Evaluation: " + (movieData.rated ? movieData.rated: "");
            const imdbElement = document.createElement("p");
            imdbElement.classList.add("forModal", "hidden");
            imdbElement.textContent = "Imdb_score: " + (movieData.imdb_score ? movieData.imdb_score : "");
            const directorElement = document.createElement("p");
            directorElement.classList.add("forModal", "hidden");
            directorElement.textContent = "Réalisateur(s): " + (movieData.directors ? movieData.directors : "");
            const actorsElement = document.createElement("p");
            actorsElement.classList.add("forModal", "hidden");
            actorsElement.textContent = "Acteurs: " + (movieData.actors ? movieData.actors : "");
            const durationElement = document.createElement("p");
            durationElement.classList.add("forModal", "hidden");
            durationElement.textContent = "Durée: " + (movieData.duration ? movieData.duration + "mn" : "");
            const countriesElement = document.createElement("p");
            countriesElement.classList.add("forModal", "hidden");
            countriesElement.textContent = "Pays: " + (movieData.countries ? movieData.countries : "");
            const boxOfficeElement = document.createElement("p");
            boxOfficeElement.classList.add("forModal", "hidden");
            boxOfficeElement.textContent = "Box office: " + (movieData.worldwide_gross_income ? movieData.worldwide_gross_income + "$" : "");
            const longDescriptionElement = document.createElement("p");
            longDescriptionElement.classList.add("forModal", "hidden");
            longDescriptionElement.textContent = "Description : " + (movieData.long_description ? movieData.long_description : "");

            movieElement.append(imageElement,
                titleElement, 
                descriptionElement,
                typeElement,
                releaseDateElement,
                rateElement,
                imdbElement,
                directorElement,
                actorsElement,
                durationElement,
                countriesElement,
                boxOfficeElement,
                longDescriptionElement
            );

            categoryElement.appendChild(movieElement);

            const forModal = document.getElementsByClassName("forModal");
            console.log(forModal);

            // Create the button "openModal" for the best movie block
            if (i === 0) {
                const openModal = document.createElement("button");
                openModal.setAttribute("id", "openModal");

                const modalContent = document.getElementsByClassName("modal-content");
                const modalText = document.createElement("p");
               
               // modalContent.appendChild(modalText);

                // openModal.setAttribute("type", "button");
                openModal.onclick = function() {
                    alert("button is clicked")
                    modal.style.display = "block";
                };
                openModal.textContent = "+ d'infos"
                movieElement.appendChild(openModal);
                }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }


        } catch (err) {
            console.log(err);
            document
                .getElementById("errors")
                .textContent = err;
        }

    }
};


// Build the collection of data relative of the wished set of urls and items number.
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
/* 
- Iterate through the categories to get their parameters defined in the array parameters;
- Call the function to build according to them the set of selected movies for each category;
- Call the function with this set as argument and the index of the category to create the required elements in html.
*/
    for (let i = 0; i < parameters.length; i++) {

        try {
            let allRequestedMovies = [];
            const justNeededMovies = await recursiveFetch(apiUri + parameters[i].endPoint, allRequestedMovies, parameters[i].numberItems);

            if (parameters[i].firstItem === 1) {
                const movieToDelete = justNeededMovies.shift();
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

// Get the modal
var modal = document.getElementById("myModal");
/*
// Get the button that opens the modal
var btn = document.getElementById("openModal");*/

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

