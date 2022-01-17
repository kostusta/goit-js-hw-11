import { Notify } from 'notiflix';

const API_KEY = '25273523-a46b00b51f98d8c3f042358ca';
const API_URL = 'https://pixabay.com/api/';
const QUERY_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class PicturesApiService {
  constructor() {
    this.searchQueryValue = '';
    this.currentPageNumber = 1;
    // this.countOfPages = 0;
  }

  fetchImages() {
    return fetch(
      `${API_URL}?key=${API_KEY}&q=${this.searchQueryValue}&${QUERY_PARAMS}&page=${this.currentPageNumber}`,
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(data => this.responseHandler(data))
      .then(data => {
        this.incrementPage();
        return data;
      });
  }

  incrementPage() {
    this.currentPageNumber += 1;
  }

  resetCurrentPageNumber() {
    this.currentPageNumber = 1;
  }

  // getPagesCount(data) {
  //   this.countOfPages = data.totalHits / 40;
  //   return this.countOfPages;
  // }

  responseHandler(data) {
    if (data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    return data;
  }

  get searchQuery() {
    return this.searchQueryValue;
  }

  set searchQuery(newSearchQueryValue) {
    this.searchQueryValue = newSearchQueryValue;
  }

  get page() {
    return this.currentPageNumber;
  }

  set page(newPage) {
    this.currentPageNumber = newPage;
  }
}
