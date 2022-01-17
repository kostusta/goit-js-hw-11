export default class LoadMoreBtn {
  constructor({ selector }) {
    this.refs = this.getBtnRef(selector);
  }

  getBtnRef(selector) {
    const refs = [];
    refs.loadMoreBtn = document.querySelector(selector);
    return refs;
  }

  btnEnabled() {
    this.refs.loadMoreBtn.disabled = false;
    this.refs.loadMoreBtn.textContent = 'Load more'
  }

  btnDesabled() {
    this.refs.loadMoreBtn.disabled = true;
    this.refs.loadMoreBtn.textContent = 'Loading...'
  }

  btnHide() {
    this.refs.loadMoreBtn.classList.add('btn-is-hidden');
  }

  btnShow() {
    this.refs.loadMoreBtn.classList.remove('btn-is-hidden');
  }
}
