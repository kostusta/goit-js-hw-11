import axios from 'axios';

const API_KEY = '25273523-a46b00b51f98d8c3f042358ca';
const API_URL = 'https://pixabay.com/api/';
const QUERY_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class PicturesApiService {
  constructor() {
    this.searchQueryValue = '';
    this.currentPageNumber = 1;
  }

  async fetchImages() {
    try {
      const response = await axios.get(
        `${API_URL}?key=${API_KEY}&q=${this.searchQueryValue}&${QUERY_PARAMS}&page=${this.currentPageNumber}`,
      );

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      this.incrementPage();

      return response;
    } catch (error) {
      console.log(error);
    }

    // //----- for fetch...then function
    // return axios
    //   .get(
    //     `${API_URL}?key=${API_KEY}&q=${this.searchQueryValue}&${QUERY_PARAMS}&page=${this.currentPageNumber}`,
    //   )
    //   .then(response => {
    //     if (response.status === 200) {
    //       return response;
    //     }
    //     throw new Error(response.statusText);
    //   })
    //   .then(response => {
    //     this.incrementPage();
    //     return response;
    //   });
  }

  incrementPage() {
    this.currentPageNumber += 1;
  }

  resetCurrentPageNumber() {
    this.currentPageNumber = 1;
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
