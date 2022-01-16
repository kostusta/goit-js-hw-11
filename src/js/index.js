import { Notify } from 'notiflix';
import cardTemplate from '../templates/card-template.hbs';
import { fetchImages } from './fetchImages';

const refs = {
  form: document.getElementById('search-form'),
  cardsList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let currentPage = 1;
let maxPage;
let lastQueryValue = '';

function onFormSubmitHandler(event) {
  event.preventDefault();

  const searchQueryValue = event.currentTarget.elements.searchQuery.value;

  fetchImages(searchQueryValue, currentPage)
    .then(responce => responseHandler(responce))
    .then(response => {
      maxPage = Math.ceil(response.totalHits / 40);
      currentPage += 1;

      if (currentPage >= maxPage) {
        desableLoadMoreBtn();
        return response;
      }

      enableLoadMoreBtn();
      return response;
    })
    .then(data => cardsListMarkupCreate(data.hits))
    .then(markup => cardsListRender(markup))

    .catch(error => console.log(error));
  // .then(console.log);
}

function responseHandler(responce) {
  if (responce.hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  return responce;
}

function cardsListMarkupCreate(data) {
  return data.map(item => cardTemplate(item)).join('');
}

function cardsListRender(markup) {
  refs.cardsList.insertAdjacentHTML('beforeend', markup);
}

function cardsContainerCleaner() {
  refs.cardsList.innerHTML = '';
}

function enableLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('btn-hidden');
}

function desableLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('btn-hidden');
}

function onLoadMoreBtnClick(event) {}

function addListeners() {
  refs.form.addEventListener('submit', onFormSubmitHandler);
  refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
}

function start() {
  addListeners();
}

start();
