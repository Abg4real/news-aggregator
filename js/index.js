const outputSection = document.querySelector('.output-section');
const newsArticles = document.getElementById('news-articles'); 
const search = document.querySelector('#search');
const form = document.querySelector('.search-section');
const loader = document.querySelector('.loader');
// form.addEventListener('submit',(e)=>{
//     e.preventDefault();
//     searchResults();
// });
let loading = true;
search.addEventListener('input',searchResults);
function generateUI(data){
    string = '';
    data.forEach((result)=>{
        let list =  `
        <li class="article">
        <a class="card_link" href="#" target="_blank">
            <img
              src=${result.urlToImage}
              class="article-img"
              alt="article-image"
            />
            <h3 class="article-title">${result.title.slice(0,50)}...</h3>
            <p class="article-description">
              ${result.description ? result.description.slice(0,100) : 'Empty Description'}...
            </p>
            <span class="article-author">${result.author}</span>
        </a>
      </li>`
      list = list.trim();
      string+=list;
    });
    newsArticles.innerHTML = string;
}
function addLoading(){
    newsArticles.style.display = 'none';
    loader.style.display = 'block';
}

function removeLoading(){
    newsArticles.style.display = 'grid';
    loader.style.display = 'none';
}
async function headlines() {
    addLoading();
    document.querySelector('.title').innerText = 'Headlines';
    const results = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=f662f9435c314ef3bc7b0d06f3b0441b`);
    if(!results.ok){
        console.log(err=>console.err(err));
        return;
    }
    let data = await results.json();
    console.log(data);
    removeLoading();
    newsArticles.style.display = 'grid';
    generateUI(data.articles);
}
headlines();

async function searchResults(){
    document.querySelector('.title').innerText = 'Results';
    addLoading();
    const keyword = search.value;
    if(!keyword){
        headlines();
        return;
    }
    console.log(keyword);
    const date = new Date();
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    };
    loading = true;
    addLoading();
    const dateNew = formatDate(date);
    const url = `https://newsapi.org/v2/everything?q=${keyword}&from=${dateNew}&language=en&sortBy=popularity&apiKey=f662f9435c314ef3bc7b0d06f3b0441b`
    console.log(url);
    const results = await fetch(url);
    if(!results.ok){
        console.log(err=>console.err(err));
        return;
    }
    let data = await results.json();
    console.log(data);
    removeLoading();
    generateUI(data.articles);
}
