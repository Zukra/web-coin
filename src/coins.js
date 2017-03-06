class Coin {
    constructor(coin) {
        this._name = coin.name;
    }

    set name(value) {
        this._name = value;
    }

    get name() {
        return this._name;
    }

    static getXHTTP() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        // code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }

    static parseJson(json) {

        return JSON.parse(json);
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
}

class PoloniexCoin extends Coin {

    constructor(coin) {
        super(coin);

        this.last          = coin.last;
        this.high24hr      = coin.high24hr;
        this.lowestAsk     = coin.lowestAsk;
        // this.highestBid    = coin.highestBid;
        this.percentChange = coin.percentChange;
        // this.id            = coin.id;
        // this.isFrozen      = coin.isFrozen;
    }

    static coinsToArray(obj) {
        let arr = [];
        for (let subObjName in obj) {
            if (obj.hasOwnProperty(subObjName)) {
                if (parseInt(obj[subObjName].isFrozen) == 0) {
                    obj[subObjName].name = subObjName;
                    delete obj[subObjName].isFrozen;
                    arr.push(new PoloniexCoin(obj[subObjName]))
                }
            }
        }

        return PoloniexCoin.sortCoins(PoloniexCoin.setCoinNames(PoloniexCoin.applyCoinsFilter(arr)));
    }

    static printCoins(coinsArray) {
        PoloniexCoin.addTableHeader(coinsArray[0]);
        PoloniexCoin.addTableElements(coinsArray);
    }

    static applyCoinsFilter(arr, filter = PoloniexCoin.filter) {

        return arr.filter(function (elem) {

            return filter.exec(elem.name);
        })
    }

    static setCoinNames(arr) {
        return arr.map(value => {
            // value.name = /^(BTC_|USDT_)(\w+)/i.exec(value.name)[2];   // BTC_ZEC => ZEC
            value.name = /_(\w+)/.exec(value.name)[1];   // BTC_ZEC => ZEC

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

    static getCoinsFilter(arr) {
        let lastIndex = arr.length - 1,
            listCoins = `^(`;

        arr.forEach(function (item, index) {
            listCoins += (item === 'BTC' ? `USDT_${item}` : `BTC_${item}`)
                + (index != lastIndex ? `|` : '');
        });

        listCoins += ')';

        return new RegExp(listCoins, 'im'); //^(BTC_ZEC|BTC_XMR|BTC_XMG|USDT_BTC)/im
    }
}

// PoloniexCoin.urlPoloniex = "https://poloniex.com/public?command=returnTicker"; // static class variable
// PoloniexCoin.filter      = /^(BTC_|USDT_BTC)/im;