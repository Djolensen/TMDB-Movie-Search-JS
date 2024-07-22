const prikazP = document.querySelector("#prikazP");

const optionsGet = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTM4MjUyMzgxMzU3MGM1ZDllZGVmZmM4YTI3NzY1NCIsInN1YiI6IjY2MDViYmFmMmZhZjRkMDEzMWM2MGEyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0BduYhzXWkIpqo_DvZuayIR5rTj2iDnGMQ3iF0MRsw",
  },
};

//   console.log(fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=8', options))

function pozovi() {
  fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    optionsGet
  )
    .then(function (res) {
      console.log(res);
      return res.json();
    })
    .then((response) => obradi(response, 0))
    .catch((err) => console.error(err));
}

function pretraziSvakiZanr(data) {
  const zanr = document.querySelector("#zanr");
  //const checkbox = document.querySelector("#checkbox");

  let niz = data.genres;
  niz.forEach((element) => {
    let zanrBox = document.createElement("div");
    let box = document.createElement("input");
    box.setAttribute("type", "checkbox");
    box.setAttribute("value", element.id);

    box.classList.add("zanrCheck");
    zanrBox.innerText = element.name;
    zanr.appendChild(zanrBox);
    zanr.appendChild(box);

    let filter = document.querySelector("#filter");
    filter.addEventListener("click", function () {
      filterChange();
    });
  });
}

pretraziZanrove();
pozovi();

function obradi(data, page) {
  let niz = data.results;

  niz = skratiZanr(niz);

  const prikaz = document.querySelector("#prikaz");
  prikaz.textContent = "";
  prikazP.textContent = "";

  if (niz.length == 0) {
    prikaz.textContent = "Nema rezultata!";
    document.querySelector("#zanr").style.display = "none";
    return;
  }

  niz.forEach((element) => {
    let div = document.createElement("div");
    // let img=document.createElement("img");

    // img.src="https://image.tmdb.org/t/p/w500"+element.poster_path;
    // img.alt=element.title;
    // img.classList.add("slika");
    div.classList.add("clanak");
    let naslov = document.createElement("h1");
    naslov.innerText = element.title;
    let html;

    html =
      element.poster_path == null
        ? `<img src="slike/download.jpg">`
        : `<img src="https://image.tmdb.org/t/p/w500${element.poster_path}"
     alt="${element.title}" class="slika">`;

    if (element.title.length > 22) {
      naslov.style.fontSize = "1.4rem";
    }

    div.innerHTML = html;
    div.insertAdjacentElement("afterbegin", naslov);

    prikaz.appendChild(div);
  });

  if (niz.length >= 20 && page > 0) {
    const navig = document.createElement("div");
    const next = document.createElement("button");
    next.textContent = "NEXT";
    next.classList.add("next");
    navig.appendChild(next);
    prikazP.appendChild(navig);

    next.addEventListener("click", function () {
      pretraziFilmove(++pag);
    });
  }

  if (pag > 1) {
    const pocetna = document.createElement("div");
    pocetna.textContent = 1;
    pocetna.style.cursor = "pointer";
    prikazP.appendChild(pocetna);

    pocetna.addEventListener("click", function () {
      pretraziFilmove(1);
    });
  }

  if (page > 0) {
    let firstNum = document.createElement("div");
    firstNum.textContent = "Page number: " + data.page;
    firstNum.style.cursor = "pointer";
    prikazP.appendChild(firstNum);

    firstNum.addEventListener("click", function () {
      pretraziFilmove(data.page);
    });
    if (data.total_pages != data.page) {
      let poslednja = document.createElement("div");
      poslednja.textContent = data.total_pages;
      prikazP.appendChild(poslednja);
      poslednja.style.cursor = "pointer";

      poslednja.addEventListener("click", function () {
        pretraziFilmove(data.total_pages);
      });
    }
  }

  if (pag > 1) {
    const navig = document.createElement("div");
    const previous = document.createElement("button");
    previous.textContent = "previous";
    previous.classList.add("previous");

    navig.appendChild(previous);
    prikazP.appendChild(navig);

    previous.addEventListener("click", function () {
      pretraziFilmove(--pag);
    });
  }
}
let pag = 1;
const dugme = document.querySelector("#pretrazi");

dugme.addEventListener("click", function () {
  pretraziFilmove(pag);
});

function pretraziFilmove(page) {
  document.querySelector("#zanr").style.display = "block";

  let value = document.querySelector("#search").value;
  fetch(
    `https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=false&language=en-US&page=${page}`,
    optionsGet
  )
    .then((response) => response.json())
    .then((response) => obradi(response, 1))
    .catch((err) => console.error(err));
}

function pretraziZanrove() {
  fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", optionsGet)
    .then((response) => response.json())
    .then((response) => pretraziSvakiZanr(response))
    .catch((err) => console.error(err));
}

function filterChange() {
  pozovi();
}

function skratiZanr(data) {
  let cheks = document.querySelectorAll(".zanrCheck:checked");

  if (cheks.length > 0) {
    let niz = [];

    for (let i = 0; i < cheks.length; i++) {
      niz.push(parseInt(cheks[i].value));
      // Mi dodajemo stiklirane u niz
    }

    // Vracamo samo one koji se poklapaju sa stikliranim u nizu
    return data.filter((elem) => elem.genre_ids.some((e) => niz.includes(e)));
  }

  return data;
}

const main = document.querySelector("#main");
main.addEventListener("click", function () {
  pretraziZanrove();
  pozovi();
});
