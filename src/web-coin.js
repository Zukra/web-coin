class WebCoin {
    constructor(coin) {
        this._name         = coin.name;
        this.last          = coin.last;
        this.high24hr      = coin.high24hr;
        this.lowestAsk     = coin.lowestAsk;
        this.highestBid    = coin.highestBid;
        this.percentChange = coin.percentChange;
        // this.id            = coin.id;
        // this.isFrozen      = coin.isFrozen;
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
        let arr = [];
        for (let subObjName in obj) {
            if (obj.hasOwnProperty(subObjName)) {
                if (parseInt(obj[subObjName].isFrozen) == 0) {
                    obj[subObjName].name = subObjName;
                    delete obj[subObjName].isFrozen;
                    arr.push(new WebCoin(obj[subObjName]))
                }
            }
        }

        return arr;
    }

    static printCoins(coinsArray) {
        WebCoin.addTableHeader(coinsArray[0]);
        WebCoin.addTableElements(coinsArray);
    }

    static applyCoinsFilter(arr, filter = WebCoin.filter) {
        return arr.filter(function (elem) {
            let pattern = new RegExp(`^${WebCoin.filter}`, 'ig'); // /^BTC_/ig

            return pattern.exec(elem.name);
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

    static addTableHeader(obj) {
        let th = '';
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                th += `<th>${prop}</th>\n`;
            }
        }
        $('#poloniex').find('thead tr').html(th);
    }

    static addTableElements(arr) {
        let tr = '';
        arr.forEach(obj => {
            tr += '<tr>';
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    tr += `<td>${obj[prop]}</td>\n`;
                }
            }
            tr += '</tr>\n';

        });

        $('#poloniex').find('tbody').html(tr);
    }
}

WebCoin.urlPoloniex = "https://poloniex.com/public?command=returnTicker"; // static class variable
WebCoin.urlBitrix   = "https://bittrex.com/Home/Api"; // static class variable
WebCoin.filter      = 'BTC_';

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