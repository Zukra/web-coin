/**
 * Created by Admininstrator on 27.02.2017.
 */

class WebCoin {
    constructor(coin) {
        this._name         = coin.name;
        this.id            = coin.id;
        this.last          = coin.last;
        this.lowestAsk     = coin.lowestAsk;
        this.highestBid    = coin.highestBid;
        this.percentChange = coin.percentChange;
        this.isFrozen      = coin.isFrozen;
        this.high24hr      = coin.high24hr;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    static getXHTTP() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        // code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }

    static getCoinsFromUrlPromise(url) {
        let xhttp = this.getXHTTP();

        return new Promise(function (resolve, reject) {
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status === 200) {
                        resolve(this.responseText);
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        );
    }

    static parseJson(json) {
        return JSON.parse(json);
    }

    static coinsToArray(obj) {
        let arrNameCoin = Object.keys(obj);

        return arrNameCoin.map(value => {
            obj[value].name = value;
            return new WebCoin(obj[value]);
        });

        /*
         return arrNameCoin.map(function (value) {
         obj[value].name = value;
         return new WebCoin(obj[value]);
         });
         */
    }

    static printCoins(coinsArray) {
        // coinsArray.forEach(function (e) {
        //     console.log(e);
        // });
        coinsArray.forEach((e) => {
            console.log(e)
        });

    }

    static applyCoinsFilter(arr, filter = WebCoin.filter) {
        return arr.filter(function (elem) {
            let patt = new RegExp(`^${WebCoin.filter}`, 'ig'); // /^BTC_/ig

            return patt.exec(elem.name);
        })
    }

    static sortCoins(arr) {
        return arr.sort(function (a, b) {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {
                return -1;
            } else if (x > y) {
                return 1;
            }
            return 0;
        });
    }

    static setNormalCoinsNames(arr) {
        return arr.map(value => {
            value.name = new RegExp(`^${WebCoin.filter}(\\w+)`, 'ig').exec(value.name)[1];   // BTC_ZEC => ZEC

            return value;
        });
    }
}

WebCoin.urlPolonix = "https://poloniex.com/public?command=returnTicker"; // static class variable
WebCoin.filter     = 'BTC_';

/*
 WebCoin.getCoinsFromUrlPromise(WebCoin.urlPolonix)
 .then(json => {
 return WebCoin.parseJson(json);
 })
 .then(objectWebCoins => {
 return WebCoin.coinsToArray(objectWebCoins)
 })
 .then(coinsArray => WebCoin.printCoins(coinsArray))
 .catch(error => console.error(error));
 */

WebCoin.getCoinsFromUrlPromise(WebCoin.urlPolonix)
    .then(WebCoin.parseJson)
    .then(WebCoin.coinsToArray)
    .then(WebCoin.applyCoinsFilter)
    .then(WebCoin.sortCoins)
    .then(WebCoin.setNormalCoinsNames)
    .then(WebCoin.printCoins)
    .catch(error => console.error(error));
