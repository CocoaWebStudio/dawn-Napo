class PressApp extends HTMLElement {
  constructor() {
    super();

    this.nextPageToken = '';

    this.observerElement = this.querySelector('.press-observer');

    this.loading__spinner = this.querySelector('.loading__spinner');
    this.loading__spinner.classList.remove('hidden');

    this.onInfititeScroll();
  }

  loadPressItems() {
    fetch(
      `https://firestore.googleapis.com/v1/projects/rahuaimpress/databases/(default)/documents/pressNotes?pageSize=12&orderBy=date%20desc&pageToken=${this.nextPageToken}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error('Error from the firestore server');
        return response.json();
      })
      .then((data) => {
        this.nextPageToken = data.nextPageToken;

        const { documents } = data;

        for (const press of documents) {
          this.loadCard({
            content: press.fields.content.stringValue,
            title: press.fields.title.stringValue,
            productLink: press.fields.productLink.stringValue,
            productName: press.fields.productName.stringValue,
            photoUrl: press.fields.photoUrl.stringValue,
            photoLink: press.fields.photoLink.stringValue,
            logoUrl: press.fields.logoUrl.stringValue,
            logoLink: press.fields.logoLink.stringValue,
            date: press.fields.date.stringValue,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  loadCard({ content, title, productLink, productName, photoUrl, photoLink, logoUrl, date, logoLink }) {
    const pressItemsContainer = this.querySelector('.press-items-container');

    pressItemsContainer.innerHTML += `
    <div class="card-container">
      <div class="card">
        <div class="card-body">
          <a class="logo_image" href="${logoLink}" target="_blank">
            <img
              src="${logoUrl}"
              alt="${productName}-${title}"
              width="300px"
              height="150px"
            >
          </a>
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="25"
            height="25"
            x="0px"
            y="0px"
            viewBox="0 0 50 50"
            xml:space="preserve"
          >
              <path d="M49.3,1.7c1.1,2-0.3,2.7-1.6,3.5c-4.9,3.3-9.2,7.2-12,12.8c-0.8,1.6-1.3,3.3-2.1,5.4c1.7,0,2.9,0,4.1,0
            c6.2,0.3,10.5,4.8,10.8,11.4c0.3,6.6-3.7,12.2-9.2,13.1c-6.3,1.1-11.6-2.7-12.9-9.5c-1.4-7.3,0.8-13.9,4.4-19.9
            c3.8-6.3,9.1-10.9,15-14.7c1-0.7,2-1.5,3-2.2C48.8,1.7,49.1,1.7,49.3,1.7z" style="fill: rgb(84, 48, 26);"></path>{' '}
              <path d="M24.6,1.7c1.1,2-0.3,2.7-1.6,3.5c-4.9,3.3-9.2,7.2-12,12.8c-0.8,1.6-1.3,3.3-2.1,5.4c1.7,0,2.9,0,4.1,0
            c6.2,0.3,10.5,4.8,10.8,11.4c0.3,6.6-3.7,12.2-9.2,13.1c-6.3,1.1-11.6-2.7-12.9-9.5C0.2,31.3,2.4,24.7,6,18.7
            C9.9,12.4,15.1,7.8,21,4c1-0.7,2-1.5,3-2.2C24.2,1.7,24.4,1.7,24.6,1.7z" style="fill: rgb(84, 48, 26);"></path>
          </svg>
          <span>${content}</span>
          <h4>${title}</h4>
          <a class="h4" href="${productLink}" target="_blank">
            <span>${productName}</span>
          </a>
          <div><date class="h5">${date}</date></div>
        </div>
        <a href="${photoLink}" target="_blank">
          <img
            src="${photoUrl}"
            alt="${productName}"
            width="300px"
            height="300px"
          >
        </a>
      </div>
    </div>
    `;
  }

  onInfititeScroll() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const handleIntersect = (entries, observer) => {
      if (entries[0].isIntersecting && this.nextPageToken != null) {
        this.loadPressItems();
      }

      if (this.nextPageToken == null) {
        observer.disconnect();
        this.removeLoading();
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    observer.observe(this.observerElement);
  }

  removeLoading() {
    this.loading__spinner.classList.add('hidden');
    this.observerElement.style.height = '0px';
  }
}

customElements.define('press-app', PressApp);
