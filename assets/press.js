class PressApp extends HTMLElement {
  constructor() {
    super();

    this.nextPageToken = '';

    this.onInfititeScroll();
  }

  loadPressItems() {
    fetch(
      `https://firestore.googleapis.com/v1/projects/rahuaimpress/databases/(default)/documents/pressNotes?pageSize=12&orderBy=date%20desc&pageToken=${this.nextPageToken}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error('Error from the server');
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
            date: press.fields.date.stringValue,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  loadCard({ content, title, productLink, productName, photoUrl, photoLink, logoUrl, date }) {
    const pressItemsContainer = this.querySelector('.press-items-container');
    const card = document.createElement('div');
    card.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    cardBody.innerHTML += `
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
        <path
          d="M49.3,1.7c1.1,2-0.3,2.7-1.6,3.5c-4.9,3.3-9.2,7.2-12,12.8c-0.8,1.6-1.3,3.3-2.1,5.4c1.7,0,2.9,0,4.1,0
      c6.2,0.3,10.5,4.8,10.8,11.4c0.3,6.6-3.7,12.2-9.2,13.1c-6.3,1.1-11.6-2.7-12.9-9.5c-1.4-7.3,0.8-13.9,4.4-19.9
      c3.8-6.3,9.1-10.9,15-14.7c1-0.7,2-1.5,3-2.2C48.8,1.7,49.1,1.7,49.3,1.7z"
          style="fill: rgb(84, 48, 26);"
        ></path>{' '}
        <path
          d="M24.6,1.7c1.1,2-0.3,2.7-1.6,3.5c-4.9,3.3-9.2,7.2-12,12.8c-0.8,1.6-1.3,3.3-2.1,5.4c1.7,0,2.9,0,4.1,0
      c6.2,0.3,10.5,4.8,10.8,11.4c0.3,6.6-3.7,12.2-9.2,13.1c-6.3,1.1-11.6-2.7-12.9-9.5C0.2,31.3,2.4,24.7,6,18.7
      C9.9,12.4,15.1,7.8,21,4c1-0.7,2-1.5,3-2.2C24.2,1.7,24.4,1.7,24.6,1.7z"
          style="fill: rgb(84, 48, 26);"
        ></path>
      </svg>
    `;

    const quote = document.createElement('span');

    quote.innerText += content;
    cardBody.appendChild(quote);

    const h4Title = document.createElement('h4');

    h4Title.innerText += title;
    cardBody.appendChild(h4Title);

    const anchorTitle = document.createElement('a');
    anchorTitle.classList.add('h3');
    anchorTitle.href = productLink;
    anchorTitle.innerHTML += `<span>${productName}</span>`;

    cardBody.appendChild(anchorTitle);

    const dateElement = document.createElement('date');
    dateElement.innerText += date;
    const dateDiv = document.createElement('div');
    dateDiv.appendChild(dateElement);
    cardBody.appendChild(dateDiv);

    card.appendChild(cardBody);

    const productAnchor = document.createElement('a');
    productAnchor.href = photoLink;

    const photoUrlElement = document.createElement('img');
    photoUrlElement.src = photoUrl;

    productAnchor.appendChild(photoUrlElement);
    card.appendChild(productAnchor);

    const logoAnchor = document.createElement('a');
    logoAnchor.href = photoLink;

    const logoUrlElement = document.createElement('img');
    logoUrlElement.src = logoUrl;

    logoAnchor.appendChild(logoUrlElement);
    card.appendChild(logoAnchor);

    pressItemsContainer.appendChild(card);
  }

  onInfititeScroll() {
    const observerElement = this.querySelector('.press-observer');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const handleIntersect = (entries, observer) => {
      if (entries[0].isIntersecting && this.nextPageToken != null) {
        this.loadPressItems();
        console.log('fetching...');
      }

      if (this.nextPageToken == null) {
        observer.disconnect();
        console.log('disconnect');
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    observer.observe(observerElement);
  }
}

customElements.define('press-app', PressApp);
