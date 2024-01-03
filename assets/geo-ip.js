function getQueryValue(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return null;
}

function getGeoip() {
  const geo = getQueryValue('geo');
  if (geo === 'off' || sessionStorage.getItem('geo') === 'false') {
    sessionStorage.setItem('geo', false);
    return false;
  }
  return true;
}

function setCountry() {
  return new Promise((resolve) => {
    const sessionCountry = sessionStorage.getItem('country');

    if (sessionCountry) resolve(sessionCountry);
    else {
      fetch('https://country.geoip.workers.dev/')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((country) => {
          sessionStorage.setItem('country', country);
          resolve(country);
        })
        .catch((error) => {
          console.error(error);
          resolve('US');
        });
    }
  });
}

function getCountry() {
  const geoip = getGeoip();
  if (geoip) {
    let replace;

    setCountry()
      .then((country) => {
        switch (window.location.hostname) {
          case 'rahua.com':
          case 'www.rahua.com':
            switch (country) {
              case 'BE':
              case 'DE':
              case 'LU':
              case 'DK':
              case 'IT':
              case 'CZ':
              case 'PL':
              case 'AT':
              case 'FI':
              case 'IE':
              case 'PT':
              case 'ES':
              case 'SE':
              case 'BG':
              case 'EE':
              case 'LV':
              case 'LT':
              case 'RO':
              case 'SK':
              case 'HR':
              case 'GR':
              case 'HU':
              case 'SI':
              case 'NL':
              case 'RU':
              case 'UA':
                replace = window.location.href.replace('rahua.com', 'rahua.eu');
                window.location.replace(replace);
                break;
              case 'FR':
                replace = window.location.href.replace('rahua.com', 'rahua.fr');
                window.location.replace(replace);
                break;
              case 'GB':
                replace = window.location.href.replace('rahua.com', 'rahua.uk');
                window.location.replace(replace);
                break;
            }
            break;
          case 'rahua.eu':
          case 'www.rahua.eu':
            switch (country) {
              case 'BE':
              case 'DE':
              case 'LU':
              case 'DK':
              case 'IT':
              case 'CZ':
              case 'PL':
              case 'AT':
              case 'FI':
              case 'IE':
              case 'PT':
              case 'ES':
              case 'SE':
              case 'BG':
              case 'EE':
              case 'LV':
              case 'LT':
              case 'RO':
              case 'SK':
              case 'HR':
              case 'GR':
              case 'HU':
              case 'SI':
              case 'NL':
              case 'RU':
              case 'UA':
                break;
              case 'FR':
                replace = window.location.href.replace('rahua.eu', 'rahua.fr');
                window.location.replace(replace);
                break;
              case 'GB':
                replace = window.location.href.replace('rahua.eu', 'rahua.uk');
                window.location.replace(replace);
                break;
              default:
                window.location.replace('https://rahua.com');
                break;
            }
            break;
          case 'rahua.fr':
          case 'www.rahua.fr':
            switch (country) {
              case 'BE':
              case 'DE':
              case 'LU':
              case 'DK':
              case 'IT':
              case 'CZ':
              case 'PL':
              case 'AT':
              case 'FI':
              case 'IE':
              case 'PT':
              case 'ES':
              case 'SE':
              case 'BG':
              case 'EE':
              case 'LV':
              case 'LT':
              case 'RO':
              case 'SK':
              case 'HR':
              case 'GR':
              case 'HU':
              case 'SI':
              case 'NL':
              case 'RU':
              case 'UA':
                replace = window.location.href.replace('rahua.fr', 'rahua.eu');
                window.location.replace(replace);
                break;
              case 'FR':
                break;
              case 'GB':
                replace = window.location.href.replace('rahua.fr', 'rahua.uk');
                window.location.replace(replace);
                break;
              default:
                window.location.replace('https://rahua.com');
                break;
            }
            break;
          case 'rahua.uk':
          case 'www.rahua.uk':
            switch (country) {
              case 'BE':
              case 'DE':
              case 'LU':
              case 'DK':
              case 'IT':
              case 'CZ':
              case 'PL':
              case 'AT':
              case 'FI':
              case 'IE':
              case 'PT':
              case 'ES':
              case 'SE':
              case 'BG':
              case 'EE':
              case 'LV':
              case 'LT':
              case 'RO':
              case 'SK':
              case 'HR':
              case 'GR':
              case 'HU':
              case 'SI':
              case 'NL':
              case 'RU':
              case 'UA':
                replace = window.location.href.replace('rahua.uk', 'rahua.eu');
                window.location.replace(replace);
                break;
              case 'GB':
                break;
              case 'FR':
                replace = window.location.href.replace('rahua.uk', 'rahua.fr');
                window.location.replace(replace);
                break;
              default:
                window.location.replace('https://rahua.com');
                break;
            }
            break;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

getCountry();
