const outputSection = document.querySelector('.output-section');
const newsArticles = document.getElementById('news-articles'); 
const search = document.querySelector('#search');
const form = document.querySelector('.search-section');
const loader = document.querySelector('.loader');
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    searchResults();
});
let theme = 'light';
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click',()=>{
    search.classList.toggle('search-dark');
    document.body.classList.toggle('dark');
    const cards = document.querySelectorAll('.card_link');
    cards.forEach(card=>card.classList.toggle('a-dark'));
})
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
    const results = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=4eba71df3cea40d2a8d1b000e02f1c17`);
    if(!results.ok){
        console.log(err=>console.err(err));
        removeLoading();
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
    document.querySelector('.message').style.display = 'none';
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
    addLoading();
    const dateNew = formatDate(date);
    const url = `https://newsapi.org/v2/everything?q=${keyword}&from=${dateNew}&language=en&sortBy=popularity&apiKey=4eba71df3cea40d2a8d1b000e02f1c17`
    const results = await fetch(url);
    if(!results.ok){
        removeLoading();
        console.log(err=>console.err(err));
        return;
    }
    let data = await results.json();
    removeLoading();
    if(data.totalResults<=0){
        console.log('No results!');
        document.querySelector('.message').style.display = 'block';
        newsArticles.style.display = 'none';
        return;
    }
    document.querySelector('.message').style.display = 'none';
    console.log(data);
    generateUI(data.articles);
}
