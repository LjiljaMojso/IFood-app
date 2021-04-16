var appId = "4c581ddc";
var appKey = "2b9046cf40a6ddf4b346200f1c9f5cdd";

var submitBtn = document.querySelector("button");
var searchInput = document.querySelector("input.keyword-input");
var recipesSection = document.getElementById("recipes");
var minCal = document.querySelector('input.minCal');
var maxCal = document.querySelector('input.maxCal');

function getData(showResultsFromIndex) {
  var request = new XMLHttpRequest();
  var loader = createLoader();
  var url = requestUrl(showResultsFromIndex);

  request.open("GET", url);

  request.onload = function () {
    if (request.status === 200 || request.status === 201) {
      createContent(JSON.parse(request.responseText));
      loader.innerHTML = "";
    }
  };

  request.send();
}

function requestUrl(showResultsFromIndex = 0) {
  
  var diet = document.querySelector('select[name="diet"]');
  var dietType = diet.value ? "&diet=" + diet.value : "";
  var health = document.querySelector('select[name="health"]');
  var healthType = health.value ? "&health=" + health.value : "";
  var url;

  url =
  "https://api.edamam.com/search?q=" +searchInput.value +"&app_id=" +appId +"&app_key=" +appKey +"&from=" + showResultsFromIndex +"&calories=" +minCal.value +"-" +maxCal.value +dietType +healthType;

  return url;
}

function createLoader() {
  var loader = document.querySelector(".loader");
  var loaderImage = document.createElement("img");
  loaderImage.setAttribute("src","./img/loader.gif")

  loader.append(loaderImage);
  return loader;
}

// Content
function createContent(data) {
  var allResults = document.querySelector(".recipe-count-number");
  allResults.textContent = data.count;

  recipesSection.innerHTML = "";
  if (data.count) {
    data.hits.forEach(function (article) {
      createRecipe(article);
    });
    createPagination(data);
  } else {
    var erorParagraf = document.createElement("p");
    erorParagraf.textContent ="No search results found. Please try again";
    recipesSection.append(erorParagraf);
  }
}

function createRecipe(article) {
  var recipeDiv = document.createElement("article");
  recipeDiv.classList.add("recipe-element");
  recipeDiv.addEventListener("click", function () {
    window.open(article.recipe.url, "_blank");
  });
  var recipeImg = document.createElement("img");
  recipeImg.setAttribute("src",article.recipe.image);
  recipeDiv.appendChild(recipeImg);
  var h3 = document.createElement("h3");
  h3.textContent = article.recipe.label;
  recipeDiv.appendChild(h3);
  var paragraf = document.createElement("p");
  paragraf.textContent =  Math.round(article.recipe.calories / article.recipe.yield) + " kcal";
  paragraf.classList.add("calories");
  recipeDiv.appendChild(paragraf);
  recipeDiv.appendChild(getLabels(article.recipe.healthLabels))
    
  recipesSection.appendChild(recipeDiv);
}

function getLabels(labels) {
  var lablesDiv = document.createElement("div", "", "labels");
  lablesDiv.classList.add("labels");

  labels.forEach(function (label) {
    var labelParagraf = document.createElement("p", label,"label");
    labelParagraf.classList.add("label");
    labelParagraf.textContent=("string",label)

    lablesDiv.appendChild(labelParagraf);
  });
  return lablesDiv;
}

function createPagination(data) {
  var pagesDiv = document.querySelector(".pagination");
  var allPages = Math.round(data.count / 10);
  var activePage = data.from / 10;
  pagesDiv.innerHTML = "";

  if (allPages > 10) allPages = 10;

  for (var page = 1; page <= allPages; page++) {
    if (page - 1 === activePage) {
      var active = document.createElement("button", page);
      active.setAttribute("disabled", true);
      pagesDiv.append(active);
      continue;
    }
    var someButton = document.createElement("button", page);
    someButton.textContent = ("number",page);

    pagesDiv.append(someButton);
  }

  paginationOnClick();
}

function paginationOnClick() {
  var paginationBtns = document.querySelectorAll(".pagination button");

  paginationBtns.forEach(function (btn, i) {
    var index = i * 10;
    btn.addEventListener("click", function () {
      getData(index);
      window.scrollTo({ left: 0, top: 500, behavior: "smooth" });
    });
  });
}

function activeBtn() {
  searchInput.value && minCal.value && maxCal.value
    ? submitBtn.removeAttribute("disabled")
    : submitBtn.setAttribute("disabled", true);
}

function setMinMaxInputNum(e, element, attribute, callback) {
  var number = Math.abs(e.target.value);

  element.setAttribute(attribute, number);
  callback();
}

searchInput.addEventListener("input", activeBtn);

minCal.addEventListener("input", (e) => {
  setMinMaxInputNum(e, maxCal, "min", activeBtn);
});

maxCal.addEventListener("input", (e) => {
  setMinMaxInputNum(e, minCal, "max", activeBtn);
});

submitBtn.addEventListener("click", () => getData());