const appId = "4c581ddc";
const appKey = "2b9046cf40a6ddf4b346200f1c9f5cdd";

const submitBtn = document.querySelector("button");
const searchInput = document.querySelector("input.keyword-input");
const recipesSection = document.getElementById("recipes");
const minCal = document.querySelector('input.minCal');
const maxCal = document.querySelector('input.maxCal');

const getData = showResultsFromIndex => {
  let request = new XMLHttpRequest();
  let loader = createLoader();
  let url = requestUrl(showResultsFromIndex);

  request.open("GET", url);

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      createContent(JSON.parse(request.responseText));
      loader.innerHTML = "";
    }
  };

  request.send();
}

const requestUrl = (showResultsFromIndex = 0) => {
  
  var diet = document.querySelector('select[name="diet"]');
  var dietType = diet.value ? "&diet=" + diet.value : "";
  var health = document.querySelector('select[name="health"]');
  var healthType = health.value ? "&health=" + health.value : "";
  var url;

  url =
  "https://api.edamam.com/search?q=" +searchInput.value +"&app_id=" +appId +"&app_key=" +appKey +"&from=" + showResultsFromIndex +"&calories=" +minCal.value +"-" +maxCal.value +dietType +healthType;

  return url;
}
const createEl = (type,path,property) => {
  const element = document.createElement(type);
  if (type === "img") {
    element.setAttribute("src",path);
  } else {
    element.textContent = path;
    if (property) {
      element.classList.add(property)
    }
  }
  return element;
}
const createLoader = () => {
  const loader = document.querySelector(".loader");
  const loaderImage = createEl("img","./img/loader.gif");

  loader.appendChild(loaderImage);
  return loader;

}

// Content
const createContent = data => {
  const allResults = document.querySelector(".recipe-count-number");
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
const createRecipe = article => {
  const recipesSection = document.getElementById("recipes");
  const recipeDiv = createEl("article","","recipe-element");

  recipeDiv.addEventListener("click", () => {
    window.open(article.recipe.url, "_blank");
  });
  const recipeImg = createEl("img",article.recipe.image);
  recipeDiv.appendChild(recipeImg);

  const h3 = createEl("h3",article.recipe.label);
  recipeDiv.appendChild(h3);

  const paragraf = document.createElement("p");
  paragraf.textContent =  Math.round(article.recipe.calories / article.recipe.yield) + " kcal";
  paragraf.classList.add("calories");
  recipeDiv.appendChild(paragraf);

  recipeDiv.appendChild(getLabels(article.recipe.healthLabels))
    
  recipesSection.appendChild(recipeDiv);
}

const getLabels = (labels) => {
  let labelsDiv = createEl("div","","labels");

  labels.forEach( (label) => labelsDiv.appendChild(createEl("p",label,"label")));

  return labelsDiv
};

const createPagination = data => {
  let pagesDiv = document.querySelector(".pagination");
  let allPages = Math.round(data.count / 10);
  let activePage = data.from / 10;
  pagesDiv.innerHTML = "";

  if (allPages > 10) allPages = 10;

  for (let page = 1; page <= allPages; page++) {
    if (page - 1 === activePage) {
      let active = document.createElement("button", page);
      active.setAttribute("disabled", true);
      pagesDiv.append(active);
      continue;
    }
    const someButton = createEl("button", page);
    pagesDiv.append(someButton);
  }

  paginationOnClick();
}
const paginationOnClick = () => {
  const paginationBtns = document.querySelectorAll(".pagination button");

  paginationBtns.forEach(function (btn, i) {
    const index = i * 10;
    btn.addEventListener("click", () => {
      getData(index);
      window.scrollTo({ left: 0, top: 500, behavior: "smooth" });
    });
  });
}
const activeBtn = () => {
  searchInput.value && minCal.value && maxCal.value
    ? submitBtn.removeAttribute("disabled")
    : submitBtn.setAttribute("disabled", true);
}

const setMinMaxInputNum = (e, element, attribute, callback) => {
  const number = Math.abs(e.target.value);

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
