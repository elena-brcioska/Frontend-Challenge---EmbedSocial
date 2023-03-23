// LOAD CARDS

const cardContainer = document.getElementById("cardContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let initialCardsLoaded = 4;
let loadMoreCards = 4;

const createACardElement = (data) => {
  let liked = false;

  const card = document.createElement("div");
  card.classList.add("card");
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("card-wrapper");
  card.appendChild(cardWrapper);
  const div = document.createElement("div");
  cardWrapper.appendChild(div);
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  cardHeader.innerHTML = `
    <div class="profile-badge">
        <div class="profile-image" style="background-image: url(${
          data.profile_image
        })">
        </div>
        <div class="profile-info">
            <h4>${data.name}</h4>
            <p>${data.date}</p>
        </div>
    </div>
    <div class="social-icon">
        <a href=${data.source_link}>
            <img src="../icons/${
              data.source_type === "instagram" ? "instagram-logo" : "facebook"
            }.svg" alt="instagram logo">
        </a>

    </div>`;
  div.appendChild(cardHeader);
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardBody.innerHTML = `<div class="card-image" style="background-image: url(${data.image})"></div>
      <div class="card-description">
          <p>${data.caption}</p>
      </div>`;
  div.appendChild(cardBody);
  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");
  const likeImg = document.createElement("div");
  likeImg.classList.add("like-img")

  const likeCount = document.createElement("span");
  likeCount.innerHTML = data.likes;

  const likeClickHandler = () => {
    liked = !liked;

    if (liked) {
      likeCount.innerHTML = parseFloat(data.likes) + 1;
      likeImg.classList.add("liked");
    } else {
      likeCount.innerHTML = parseFloat(data.likes);
      likeImg.classList.remove("liked");
    }
  };

  likeImg.addEventListener("click", likeClickHandler);
  likeImg.src = "../icons/heart.svg";

  cardFooter.appendChild(likeImg);
  cardFooter.appendChild(likeCount);
  cardWrapper.appendChild(cardFooter);

  cardContainer.appendChild(card);
  fadeIn(card);
};

// LOADING AND FILTERING

let filter = "all";

document.getElementById("all").addEventListener("change", (e) => {
  filter = e.target.value;
  cardContainer.innerHTML = "";
  document.getElementById("loadMoreBtn").style.display = "block";
  loadInitialCards();
});

document.getElementById("instagram").addEventListener("change", (e) => {
  filter = e.target.value;
  cardContainer.innerHTML = "";
  document.getElementById("loadMoreBtn").style.display = "block";
  loadInitialCards();
});

document.getElementById("facebook").addEventListener("change", (e) => {
  filter = e.target.value;
  cardContainer.innerHTML = "";
  document.getElementById("loadMoreBtn").style.display = "block";
  loadInitialCards();
});

document.getElementById("twitter").addEventListener("change", (e) => {
  cardContainer.innerHTML = "<h1>No items available</h1>";
  document.getElementById("loadMoreBtn").style.display = "none";
});

const backgroundChange = (cards) => {

    for (i = 0; i < cards.length; i++) {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(bgInput.value)) {
          cards[i].style.backgroundColor = bgInput.value;
          cards[i].style.color = "#000000";

        } else if (
          document.getElementById("darkTheme").checked &&
          bgInput
        ) {
          cards[i].style.backgroundColor = "#000000";
          cards[i].style.color = "#ffffff";
        }
        if (document.getElementById("darkTheme").checked) {
          cards[i].style.backgroundColor = "#000000";
          cards[i].style.color = "#ffffff";
        }
      }


}

const loadInitialCards = () => {
  fetch("../data.json")
    .then((response) => response.json())
    .then((posts) => {
      let counter = 0;
      let filteredPosts = posts.filter((post) => filter === post.source_type);
      if (filter === "all") {
        for (let post of posts) {
          if (counter < initialCardsLoaded) {
            createACardElement(post);

            const cards = document.getElementsByClassName("card");

            backgroundChange(cards)

          }

          counter++;
        }
      } else {
        for (let post of filteredPosts) {
          if (filteredPosts.length <= initialCardsLoaded) {
            createACardElement(post);
            const cards = document.getElementsByClassName("card");

            backgroundChange(cards)

            document.getElementById("loadMoreBtn").style.display = "none";
          } else {
            if (counter < initialCardsLoaded) {
              createACardElement(post);
              const cards = document.getElementsByClassName("card");

              backgroundChange(cards)

            }
          }

          counter++;
        }
      }
    });
};

const loadMore = () => {
  fetch("../data.json")
    .then((response) => response.json())
    .then((posts) => {
      let currentPosts = document.getElementsByClassName("card").length;
      let counter = 0;
      let filteredPosts = posts.filter((post) => filter === post.source_type);
      console.log(filteredPosts);
      if (filter === "all") {
        for (let post of posts) {
          if (
            counter >= currentPosts &&
            counter < loadMoreCards + currentPosts
          ) {
            createACardElement(post);
            const cards = document.getElementsByClassName("card");

            backgroundChange(cards)

          }
          counter++;
        }
        if (document.getElementsByClassName("card").length === posts.length) {
          loadMoreBtn.style.display = "none";
        }
      } else {
        for (let post of filteredPosts) {
          if (filteredPosts.length <= loadMoreCards) {
            createACardElement(post);
            const cards = document.getElementsByClassName("card");
            if (cards.length >= filteredPosts.length) {
              loadMoreBtn.style.display = "none";
            }

            backgroundChange(cards)

          } else {
            if (
              counter >= currentPosts &&
              counter < loadMoreCards + currentPosts
            ) {
              createACardElement(post);
              const cards = document.getElementsByClassName("card");

              backgroundChange(cards)
            }
          }

          counter++;
        }

        if (
          document.getElementsByClassName("card").length ===
          filteredPosts.length
        ) {
          loadMoreBtn.style.display = "none";
        }
      }
    });

  const bgInput = document.getElementById("cardBackgroundColor");
};

function fadeIn(div) {
  let opacity = 0;
  let interval = setInterval(() => {
    if (opacity <= 1) {
      opacity = opacity + 0.1;
      div.style.opacity = opacity;
    } else {
      clearInterval(interval);
    }
  }, 30);
}

loadInitialCards();

// CHANGE COLUMNS

const columnsOnChangeHandler = (e) => {
  if (e.target.value === "2") {
    cardContainer.className = "cards-container two-columns";
  } else if (e.target.value === "3") {
    cardContainer.className = "cards-container three-columns";
  } else if (e.target.value === "4") {
    cardContainer.className = "cards-container four-columns";
  } else if (e.target.value === "5") {
    cardContainer.className = "cards-container five-columns";
  } else {
    cardContainer.className = "cards-container dynamic-layout";
  }
};

const columnsInput = document.getElementById("numberOfColumns");
columnsInput.addEventListener("change", columnsOnChangeHandler);

// CHANGE BACKGROUND

const backgroundOnChangeHandler = (e) => {
  const cards = document.getElementsByClassName("card");


  for (i = 0; i < cards.length; i++) {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(e.target.value)) {
      cards[i].style.backgroundColor = e.target.value;
      cards[i].style.color = "#000000";
      document.getElementById("darkTheme").checked = false
      document.getElementById("lightTheme").checked = true

    }
  }
};

const bgInput = document.getElementById("cardBackgroundColor");
bgInput.addEventListener("input", backgroundOnChangeHandler);

// CHANGE GAP

const gapOnChangeHandler = (e) => {
  cardContainer.style.gap = e.target.value;
};

const gapInput = document.getElementById("cardSpaceBetween");
gapInput.addEventListener("input", gapOnChangeHandler);

// CHANGE THEME

document.getElementById("lightTheme").addEventListener("change", () => {
  const cards = document.getElementsByClassName("card");
  for (let card of cards) {
    card.style.backgroundColor = "#ffffff";
    card.style.color = "#000000";
  }
});

document.getElementById("darkTheme").addEventListener("change", () => {
  const cards = document.getElementsByClassName("card");
  for (let card of cards) {
    card.style.backgroundColor = "#000000";
    card.style.color = "#ffffff";
  }
});
