export function fetchImages(searchQueryValue, page) {
  const API_KEY = '25273523-a46b00b51f98d8c3f042358ca';
  const API_URL = 'https://pixabay.com/api/';
  const QUERY_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=10';

  return fetch(`${API_URL}?key=${API_KEY}&q=${searchQueryValue}&${QUERY_PARAMS}&page=${page}`).then(
    response => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    },
  );
}
