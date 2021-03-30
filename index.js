console.log("Hi there! Let's get started");

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster !== "N/A" ? movie.Poster : "";
    return `
    <img src="${imgSrc}"/>
   ${movie.Title}  (${movie.Year})
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "ee0ef8ef",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

// Set focus to first autocomplete input box on load
document.querySelector("#left-autocomplete input").focus();

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftMovie;
let rightMovie;
onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: "ee0ef8ef", i: movie.imdbID },
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else if (side === "right") {
    rightMovie = response.data;
  }

  // Check if both left and right movie are defined
  if (leftMovie && rightMovie) {
    // Run the comparision
    runComparison();
  }
};

const runComparison = () => {
  // Iterate through the movies
  // Compare and set appropriate class flags
  // Compare the data values between the two summaries, set a css flag for the winner

  // You can do this with if en dan de queryselectors daar in. Maar izin

  leftSidestats = document.querySelectorAll("#left-summary .notification");
  rightSidestats = document.querySelectorAll("#right-summary .notification");

  leftSidestats.forEach((leftStat, index) => {
    const rightStat = rightSidestats[index];

    leftSideValue = parseInt(leftStat.dataset.value);
    rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      rightStat.classList.add("is-primary");
      rightStat.classList.remove("is-danger");
      leftStat.classList.add("is-danger");
      leftStat.classList.remove("is-primary");
    } else {
      rightStat.classList.add("is-danger");
      rightStat.classList.remove("is-primary");
      leftStat.classList.add("is-primary");
      leftStat.classList.remove("is-danger");
    }
  });

  console.log("time to run a comparison now...");

  // Hoe zou je deze comparison schijven.
  // Pak de root van link en rechts. Document query select if compare.
};

// Render movie data to screen
const movieTemplate = (movieDetail) => {
  // Here you are reformatting the documents,
  // The reason you use data properties inside of the html is because
  // you can use that as the store of truth. Without having to hardcode links. You can use it as
  // a database of some sort.s
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  console.log(awards);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" alt="" class="src" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p> ${movieDetail.Plot} </p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification">
      <p class="title">${movieDetail.Awards} </p>
      <p class="subtitle">Awards</p>
    </article>

    <article data-value=${dollars} class="notification">
    <p class="title">${movieDetail.BoxOffice} </p>
    <p class="subtitle">Box Office</p>
  </article>

  <article data-value=${metascore} class="notification">
  <p class="title">${movieDetail.Metascore} </p>
  <p class="subtitle">Metascore</p>
</article>

<article data-value=${imdbRating} class="notification">
<p class="title">${movieDetail.imdbRating} </p>
<p class="subtitle">IMDB  Rating</p>
</article>

<article data-value=${imdbVotes} class="notification">
<p class="title">${movieDetail.imdbVotes} </p>
<p class="subtitle">IMDB Votes</p>
</article>
  `;
};
