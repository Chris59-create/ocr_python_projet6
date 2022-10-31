// Parameters
const itemsPerPage = 5; // Number of items per page of API
const apiUri = 'http://127.0.0.1:8000/api/v1/titles/'; // Root of the API url

// {id: {categorieName : "", endPoint: "", firstItem: index, numberItems: nb}}}
const parameters = [
    { htmlId: "best", categoryName: "En vedette", endPoint: '?sort_by=-imdb_score', firstItem: 0, numberItems: 1 },
    { htmlId: "category1", categoryName: "Films les mieux notés", endPoint: '?sort_by=-imdb_score', firstItem: 1, numberItems: 8 },
    { htmlId: "category2", categoryName: "Animation", endPoint: '?genre=animation&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category3", categoryName: "Mystery", endPoint: '?genre=mystery&sort_by=-imdb_score', firstItem: 0, numberItems: 7 },
    { htmlId: "category4", categoryName: "Western", endPoint: '?genre=western&sort_by=-imdb_score', firstItem: 0, numberItems: 7 }
];

// Initialize the modal and the its close button
const modal = document.getElementById("myModal"); // Get the modal
const span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

//  Create the HTML elements from the movies data collected
async function getMoviesAllData(movies, i) {

    //Select and implement the <div> relative to the treated category 
    const blocElement = document.getElementById(parameters[i].htmlId);
    
    const categoryTitle = document.createElement("h2");
    categoryTitle.innerText = parameters[i].categoryName;
      
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("scroll-category");
    categoryElement.setAttribute("id", "cat" + i);
    
    // Create the scroll buttons for the categories (except for the "best")
    if (i != 0) {
        const leftButton = document.createElement("button");
        leftButton.classList.add("left");
        leftButton.innerHTML = "<i class='fas fa-angle-double-left'></i>";

        leftButton.onclick = function() {
            const left = document.getElementById("cat" + i);
            left.scrollBy(-200, 0);
        }   

        const rightButton = document.createElement("button");
        rightButton.classList.add("right");
        rightButton.innerHTML = "<i class='fas fa-angle-double-right'></i>";

        rightButton.onclick = function() {
            const right = document.getElementById("cat" + i);
            right.scrollBy(200, 0);
        }

        blocElement.append(categoryTitle, leftButton, categoryElement, rightButton);

    } else {
        blocElement.append(categoryTitle, categoryElement);
    }
   
    // Loops in the movies ID to get with the API all needed data for a movie
    for (const index in movies) {

        const movieId = movies[index].id;

        try {

            //Clone the elements for the modal and open the modal
            function openModal() {
                const containerElement = document.getElementById("container");
                const newDiv = document.createElement("div")
                newDiv.classList.add("displayModalContent")
                newDiv.setAttribute("id", "temporary");
                const imageModal = document.createElement("div");
                imageModal.classList.add("elementTemporary");
                imageModal.setAttribute("id", "imageModal");
                imageModal.appendChild(forModal[0].cloneNode(true));
                const dataModal = document.createElement("div");
                dataModal.classList.add("elementTemporary");
                dataModal.setAttribute("id", "dataModal");
                 for (let index = 1; index < forModal.length; index++) {
                    let modalElement = forModal[index].cloneNode(true);
                    dataModal.appendChild(modalElement);
                }
                newDiv.append(imageModal, dataModal);
                containerElement.appendChild(newDiv);
                modal.style.display = "block";
            };

            //Request the API
            const response = await fetch(apiUri + movieId);
            const movieData = await response.json();

            /* 
            Create and append Elements for the foreground
            Class "formodal" helps to list the elements to pass to the modal (js not css need)
            Classes forBest and onlyForModal help to manage the visibility or not of elements in categories (css)
            */
            
            const imageContainer = document.createElement("p");
            const imageElement = document.createElement("img");
            imageElement.classList.add("forModal");
            imageElement.src = (movieData.image_url ? movieData.image_url : "");
            imageElement.setAttribute("onerror", "this.onerror=null; this.src='img/pochette_indisponible.jpeg'");
            imageElement.setAttribute("title", movieData.title);
            imageElement.setAttribute("alt", "Pochette du film");

            imageContainer.appendChild(imageElement);

            // open the modal when click on image
            imageElement.addEventListener("click", openModal);
            
            const titleElement = document.createElement("h1");
            titleElement.classList.add("forModal", "forBest");
            titleElement.innerText = (movieData.title ? movieData.title : "");
            const descriptionElement = document.createElement("p");
            descriptionElement.classList.add("forBest");
            descriptionElement.setAttribute("id", "shortDescription");
            descriptionElement.innerText = (movieData.description ? movieData.description : "");

            const movieElement = document.createElement("div");
            movieElement.classList.add("movie");
           
            //Create and append in the foreground elements for the modal

            const typeElement = document.createElement("p");
            typeElement.classList.add("forModal", "onlyForModal");
            typeElement.innerText = "Genre(s) : " + (movieData.genres ? movieData.genres : "" );

            const releaseDateElement = document.createElement("p");
            releaseDateElement.classList.add("forModal", "onlyForModal");
            releaseDateElement.innerText = "Année : " + (movieData.year ? movieData.year : "");

            const rateElement = document.createElement("p");
            rateElement.classList.add("forModal", "onlyForModal");
            rateElement.innerText = "Evaluation : " + (movieData.rated ? movieData.rated: "");

            const imdbElement = document.createElement("p");
            imdbElement.classList.add("forModal", "onlyForModal");
            imdbElement.innerText = "Score Imdb : " + (movieData.imdb_score ? movieData.imdb_score : "");

            const directorElement = document.createElement("p");
            directorElement.classList.add("forModal", "onlyForModal");
            directorElement.innerText = "Réalisateur(s) : " + (movieData.directors ? movieData.directors : "");

            const actorsElement = document.createElement("p");
            actorsElement.classList.add("forModal", "onlyForModal");
            actorsElement.innerText = "Acteurs : " + (movieData.actors ? movieData.actors : "");

            const durationElement = document.createElement("p");
            durationElement.classList.add("forModal", "onlyForModal");
            durationElement.innerText = "Durée : " + (movieData.duration ? movieData.duration + "mn" : "");

            const countriesElement = document.createElement("p");
            countriesElement.classList.add("forModal", "onlyForModal");
            countriesElement.innerText = "Pays : " + (movieData.countries ? movieData.countries : "");

            const boxOfficeElement = document.createElement("p");
            boxOfficeElement.classList.add("forModal", "onlyForModal");
            boxOfficeElement.innerText = "Box office  : " + (movieData.worldwide_gross_income ? movieData.worldwide_gross_income + "$" : "");

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

            // Create the button "openModal" for the best movie block
            if (i === 0) {
                const btnToModal = document.createElement("button");
                btnToModal.setAttribute("id", "toModal");
                btnToModal.innerText = "+ d'infos"
                movieElement.appendChild(btnToModal);
               
                btnToModal.addEventListener("click", openModal);
            }

            // Close the modal
            function closeModal() {
                const toRemove = document.getElementById("temporary");
                toRemove.remove();
                modal.style.display = "none";
            }

            // When the user clicks on <span> (x), close the modal
            span.onclick = closeModal;
                
         
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    closeModal();
                }
            }
            // When the user click on close button, close the modal
            const closeModalButton = document.getElementById("closeModalButton");
            closeModalButton.onclick = closeModal;


        } catch (err) {
            console.log(err);
            document
                .getElementById("errors")
                .innerText = err;
        }

    }
}


// Build with the API the collection of data relative to the wished set of urls and items number.
async function recursiveFetch(url, allRequestedMovies, numberItems) {

    try {
        const response = await fetch(url);
        const data = await response.json();
        const moviesOnePage = data["results"];
        allRequestedMovies.push(...moviesOnePage);
        const nextUrl = data["next"];
        numberItems -= itemsPerPage;

        // If the waited number of movies is not reached, recursive call
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

// Call the main function
feedPage();