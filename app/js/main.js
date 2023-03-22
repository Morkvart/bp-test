const langs = {
    en: './localizations/en.json',
    es: './localizations/es.json',
    fr: './localizations/fr.json',
    ja: './localizations/ja.json',
    nl: './localizations/nl.json',
    ru: './localizations/ru.json',
    zh: './localizations/zh.json',
}

const prices = {
    monthly: '$9.99',
    monthlyPer: '$9.99',
    annual: '$19.99',
    annualPer: '$1.66',
}


let currentLanguage;

/*
Получаем язык системы
Если такого языка нет среди файлов локализации, то устанавливаем EN
*/
let userDeviceLang = navigator.language || navigator.userLanguage;
if (!(userDeviceLang in langs)) {
    userDeviceLang = 'en';
}

if (window.location.search == '') {
    // добавление параметра языка в адрессную строку
    updateURL(userDeviceLang);
} else {
    // изменение параметра языка
    setLang();
}

function updateURL(lang) {
    if (history.pushState) {
        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var newUrl = baseUrl + '?lang=' + lang;
        history.pushState(null, null, newUrl);
        currentLanguage = lang;
    }
    else {
        console.warn('History API не поддерживается');
    }
}

function setLang() {
    if (window.location.search != '') {
        let lang = window.location.search.split('=')[1];
        if (lang in langs) {
            return updateURL(lang);
        } else {
            return updateURL('en');

        }
    }
    return updateURL('en');
}

// ===============================
let path = langs[currentLanguage];

fetch(path)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        setContent(data);
    })

function setContent(json) {
    document.querySelector('.main__title').innerHTML = json.title;
    document.getElementsByClassName('functions__item')[0].textContent = json.func1;
    document.getElementsByClassName('functions__item')[1].textContent = json.func2;
    document.getElementsByClassName('functions__item')[2].textContent = json.func3;
    document.getElementsByClassName('offer__title')[0].textContent = json.monthly;
    document.getElementsByClassName('offer__title')[1].textContent = json.annually;
    document.getElementsByClassName('offer__cost-all')[0].innerHTML = json['monthly-cost'].replace("{{price}}", prices.monthly);
    document.getElementsByClassName('offer__cost-all')[1].innerHTML = json['annually-cost'].replace("{{price}}", prices.annual);
    document.getElementsByClassName('offer__subtitle')[0].textContent = json.free;
    document.getElementsByClassName('offer__subtitle')[1].textContent = json.popular;
    document.getElementsByClassName('offer__cost-month')[0].innerHTML = json['cost-month'].replace("{{price}}", prices.monthlyPer);
    document.getElementsByClassName('offer__cost-month')[1].innerHTML = json['cost-month'].replace("{{price}}", prices.annualPer);
    document.querySelector('.offer__discount').textContent = json.discount;
    document.querySelector('.continue-btn').textContent = json.btn;
    document.querySelector('.main__subtitle').textContent = json.subtitle;
    document.getElementsByClassName('main__link')[0].textContent = json.terms;
    document.getElementsByClassName('main__link')[1].textContent = json.privacy;
    document.querySelector('.restore__text').textContent = json.restore;
}


// ===============================

const offers = document.querySelector('.offers');
const offerShell = document.getElementsByClassName('shell');
const offer = document.getElementsByClassName('offer');
const button = document.querySelector('.continue-btn');

offers.addEventListener("click", function (event) {
    let offerIndex = Array.prototype.indexOf.call(offerShell, event.target);
    selectOffer(offerIndex);
    changeLink(offerIndex);

});

function selectOffer(index) {
    if (index === 1 || index === 0) {
        for (let i = 0; i < offer.length; i++) {
            offer[i].classList.remove('offer--active');
        }
        offer[index].classList.add('offer--active');

    }
}

function changeLink(index) {
    if (index === 0) {
        button.href = 'https://apple.com/';
    } else if (index === 1) {
        button.href = 'https://google.com/';
    }
}