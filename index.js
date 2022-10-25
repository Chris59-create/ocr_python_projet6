// Parameters
const itemsPerPage = 5; // Number of items per page of API
const apiUri = 'http://127.0.0.1:8000/api/v1/titles/'; // Root of the API url
// {id: {categorieName : "", endPoint: "", firstItem: index, numberItems: nb}}}
const parameters = [
    { htmlId: "best", categoryName: "En vedette", endPoint: '?sort_by=-imdb_score', firstItem: 0, numberItems: 1 },
    { htmlId: "category1", categoryName: "Films les mieux notés", endPoint: '?sort_by=-imdb_score', firstItem: 1, numberItems: 14 },
    { htmlId: "category2", categoryName: "Animation", endPoint: '?genre=animation&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category3", categoryName: "Mystery", endPoint: '?genre=mystery&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category4", categoryName: "Western", endPoint: '?genre=western&sort_by=-imdb_score', firstItem: 0, numberItems: 14 }
];

// Initialize the modal and the its close button
var modal = document.getElementById("myModal"); // Get the modal
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

//  Create the HTML elements
async function getMoviesAllData(movies, i) {

    const blocElement = document.getElementById(parameters[i].htmlId);
    
    const categoryTitle = document.createElement("h2");
    categoryTitle.innerText = parameters[i].categoryName;
    

  
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("scroll-category");
    categoryElement.setAttribute("id", "cat" + i);
    
    // Create the left and right scroll buttons for the categories.
    if (i != 0) {
        const leftButton = document.createElement("button");
        leftButton.classList.add("left");
        leftButton.innerHTML = "<i class='fas fa-angle-double-left'></i>";

        leftButton.onclick = function() {
            const left = document.getElementById("cat" + i);
            left.scrollBy(-200, 0);
            console.log("test leftButton"); // test
        }   

        const rightButton = document.createElement("button");
        rightButton.classList.add("right");
        rightButton.innerHTML = "<i class='fas fa-angle-double-right'></i>";

        rightButton.onclick = function() {
            const right = document.getElementById("cat" + i);
            right.scrollBy(200, 0);
            console.log("test rightButton"); // test
        }

        blocElement.append(categoryTitle, leftButton, categoryElement, rightButton);

    } else {
        blocElement.append(categoryTitle, categoryElement);
    }
   
    for (const index in movies) {

        const movieId = movies[index].id;

        try {
            const response = await fetch(apiUri + movieId);
            const movieData = await response.json();

            // Create and append Elements for the foreground
            // Class "formodal" helps to list the elements to pass to the modal (js not css need)
            // Classes forBest and onlyForModal help to manage the visibility or not of elements in categories (css)
            
            const imageContainer = document.createElement("p");
            const imageElement = document.createElement("img");
            imageElement.classList.add("forModal");
            imageElement.src = (movieData.image_url ? movieData.image_url : "");
            imageElement.setAttribute("onerror", "this.onerror=null; this.src='img/pochette_indisponible.jpeg'");
            imageElement.setAttribute("title", movieData.title);
            imageElement.setAttribute("alt", "Pochette du film");


            // open the modal when click on image
            imageElement.onclick = function() {
                const containerElement = document.getElementById("container");
                const newDiv = document.createElement("div")
                newDiv.setAttribute("id", "temporary");
                for (let index = 0; index < forModal.length; index++) {
                    let modalElement = forModal[index].cloneNode(true);
                    newDiv.appendChild(modalElement);
                }
                containerElement.appendChild(newDiv);
                modal.style.display = "block";
            };

            imageContainer.appendChild(imageElement);

            const titleElement = document.createElement("h2");
            titleElement.classList.add("forModal", "forBest");
            titleElement.innerText = (movieData.title ? movieData.title : "");
            const descriptionElement = document.createElement("p");
            descriptionElement.classList.add("forBest");
            descriptionElement.innerText = (movieData.description ? movieData.description : "");

            const movieElement = document.createElement("div");
            movieElement.classList.add("movie");
           
            //Create and append in the foreground elements for the modal

            const typeElement = document.createElement("p");
            typeElement.classList.add("forModal", "onlyForModal");
            typeElement.innerText = "Genre(s): " + (movieData.genres ? movieData.genres : "" );
            const releaseDateElement = document.createElement("p");
            releaseDateElement.classList.add("forModal", "onlyForModal");
            releaseDateElement.innerText = "Année: " + (movieData.year ? movieData.year : "");
            const rateElement = document.createElement("p");
            rateElement.classList.add("forModal", "onlyForModal");
            rateElement.innerText = "Evaluation: " + (movieData.rated ? movieData.rated: "");
            const imdbElement = document.createElement("p");
            imdbElement.classList.add("forModal", "onlyForModal");
            imdbElement.innerText = "Imdb_score: " + (movieData.imdb_score ? movieData.imdb_score : "");
            const directorElement = document.createElement("p");
            directorElement.classList.add("forModal", "onlyForModal");
            directorElement.innerText = "Réalisateur(s): " + (movieData.directors ? movieData.directors : "");
            const actorsElement = document.createElement("p");
            actorsElement.classList.add("forModal", "onlyForModal");
            actorsElement.innerText = "Acteurs: " + (movieData.actors ? movieData.actors : "");
            const durationElement = document.createElement("p");
            durationElement.classList.add("forModal", "onlyForModal");
            durationElement.innerText = "Durée: " + (movieData.duration ? movieData.duration + "mn" : "");
            const countriesElement = document.createElement("p");
            countriesElement.classList.add("forModal", "onlyForModal");
            countriesElement.innerText = "Pays: " + (movieData.countries ? movieData.countries : "");
            const boxOfficeElement = document.createElement("p");
            boxOfficeElement.classList.add("forModal", "onlyForModal");
            boxOfficeElement.innerText = "Box office: " + (movieData.worldwide_gross_income ? movieData.worldwide_gross_income + "$" : "");
            const longDescriptionElement = document.createElement("p");
            longDescriptionElement.classList.add("forModal", "onlyForModal");
            longDescriptionElement.innerText = "Description : " + (movieData.long_description ? movieData.long_description : "");

            movieElement.append(imageContainer,
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
                longDescriptionElement,
                );

            categoryElement.appendChild(movieElement);
            
            // List the elements to pass to the modal
            const forModal = Array.from(movieElement.getElementsByClassName("forModal"));
            console.log(forModal);

            // Create the button "openModal" for the best movie block
            if (i === 0) {
                const btnToModal = document.createElement("button");
                btnToModal.setAttribute("id", "toModal");
                btnToModal.innerText = "+ d'infos"
                movieElement.appendChild(btnToModal);
               
                btnToModal.onclick = function() {
                    const containerElement = document.getElementById("container");
                    const newDiv = document.createElement("div")
                    newDiv.setAttribute("id", "temporary");
                    for (let index = 0; index < forModal.length; index++) {
                        let modalElement = forModal[index].cloneNode(true);
                        newDiv.appendChild(modalElement);
                    }
                    containerElement.appendChild(newDiv);
                    modal.style.display = "block";
                } ;
            }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                const toRemove = document.getElementById("temporary");
                toRemove.remove();
                modal.style.display = "none";
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    const toRemove = document.getElementById("temporary");
                    toRemove.remove();
                    modal.style.display = "none";
                }
            }


        } catch (err) {
            console.log(err);
            document
                .getElementById("errors")
                .innerText = err;
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
            .innerText = err;
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
                .innerText = err;
        }
    }
}

feedPage(); // Call the main function