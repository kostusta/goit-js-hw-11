import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import cardTemplate from './templates/card-template.hbs';
import PicturesApiService from './js/pictures-api-service';
import LoadMoreBtn from './js/load-more-btn';

import 'simplelightbox/dist/simple-lightbox.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const refs = {
  form: document.getElementById('search-form'),
  cardsList: document.querySelector('.gallery'),
};

const picturesApiService = new PicturesApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });
const gallery = new SimpleLightbox('.gallery a');

function cardsListMarkupRender(response) {
  const markup = response.data.hits.map(hit => cardTemplate(hit)).join('');
  refs.cardsList.insertAdjacentHTML('beforeend', markup);
}

function cardsContainerCleaner() {
  refs.cardsList.innerHTML = '';
}

function scrollDown() {
  window.scroll({
    top: refs.cardsList.offsetHeight - 150,
    behavior: 'smooth',
  });
}

// //----- fetchPictures function for fetch...then
// function fetchPictures() {
//   loadMoreBtn.btnDesabled();
//   return picturesApiService
//     .fetchImages()
//     .then(response => {
//       loadMoreBtn.btnEnabled();

//       if (response.data.hits.length === 0) {
//         Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//         loadMoreBtn.btnHide();
//         return;
//       }

//       cardsListMarkupRender(response);
//       scrollDown();
//       gallery.on('show.simplelightbox');
//       gallery.refresh();

//       return response;
//     })
//     .then(response => {
//       const maxPagesCount = Math.ceil(response.data.totalHits / 40);

//       if (picturesApiService.page > maxPagesCount) {
//         loadMoreBtn.btnHide();
//         Notify.info("We're sorry, but you've reached the end of search results.");
//       }

//       return response;
//     })
//     .catch(error => console.log(error));
// }

async function fetchPicturesAsync() {
  loadMoreBtn.btnDesabled();

  try {
    const fetchedData = await picturesApiService.fetchImages();

    if (fetchedData.data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.btnHide();
      return;
    }

    loadMoreBtn.btnEnabled();
    cardsListMarkupRender(fetchedData);
    setTimeout(scrollDown, 300); 
    gallery.on('show.simplelightbox');
    gallery.refresh();

    const maxPagesCount = Math.ceil(fetchedData.data.totalHits / 40);

    if (picturesApiService.page > maxPagesCount) {
      loadMoreBtn.btnHide();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    return fetchedData;
  } catch (error) {
    console.log(error);
  }
}

async function onFormSubmitHandler(event) {
  event.preventDefault();

  picturesApiService.searchQuery = event.currentTarget.elements.searchQuery.value;

  picturesApiService.resetCurrentPageNumber();
  loadMoreBtn.btnShow();
  cardsContainerCleaner();

  const fetchedData = await fetchPicturesAsync();

  try {
    Notify.info(`Hooray! We found ${fetchedData.data.totalHits} images.`);
  } catch (error) {}

  // //----- for fetch...then function
  // fetchPicturesAsync().then(fetchedData =>
  //   Notify.info(`Hooray! We found ${fetchedData.data.totalHits} images.`),
  // );
}

function onLoadMoreBtnHandlet() {
  fetchPicturesAsync();
}

function addListeners() {
  refs.form.addEventListener('submit', onFormSubmitHandler);
  loadMoreBtn.refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnHandlet);
}

function start() {
  addListeners();
}

start();
