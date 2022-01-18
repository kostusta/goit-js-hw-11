import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import cardTemplate from './templates/card-template.hbs';
import PicturesApiService from './js/pictures-api-service';
import LoadMoreBtn from './js/load-more-btn';

import 'simplelightbox/dist/simple-lightbox.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const refs = {
  form: document.getElementById('search-form'),
  cardsList: document.querySelector('.gallery'),
};

const picturesApiService = new PicturesApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });
const gallery = new SimpleLightbox('.gallery a');

function onFormSubmitHandler(event) {
  event.preventDefault();

  picturesApiService.searchQuery = event.currentTarget.elements.searchQuery.value;

  picturesApiService.resetCurrentPageNumber();
  cardsContainerCleaner();
  loadMoreBtn.btnShow();

  fetchPictures().then(data => Notify.info(`Hooray! We found ${data.totalHits} images.`));
}

function onLoadMoreBtnHandlet() {
  fetchPictures();
}

function cardsListMarkupRender(data) {
  const markup = data.hits.map(hit => cardTemplate(hit)).join('');
  refs.cardsList.insertAdjacentHTML('beforeend', markup);
}

function cardsContainerCleaner() {
  refs.cardsList.innerHTML = '';
}

function fetchPictures() {
  loadMoreBtn.btnDesabled();
  return picturesApiService
    .fetchImages()
    .then(data => {
      cardsListMarkupRender(data);
      loadMoreBtn.btnEnabled();
      return data;
    })
    .then(data => {
      const maxPagesCount = Math.ceil(data.totalHits / 40);
      if (picturesApiService.page > maxPagesCount) {
        loadMoreBtn.btnHide();
        Notify.info("We're sorry, but you've reached the end of search results.");
      }
      return data;
    })
    .catch(error => console.log(error));
}

function addListeners() {
  refs.form.addEventListener('submit', onFormSubmitHandler);
  loadMoreBtn.refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnHandlet);
}

function start() {
  addListeners();
}

start();
