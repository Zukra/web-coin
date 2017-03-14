export class Coin {
    constructor(coin = {}) {
        this.name   = coin.name;
        this.last   = coin.last;
        this.high   = coin.high;
        this.low    = coin.low;
        this.change = coin.change;

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

        return new Promise(function (resolve) {
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

    static applyCoinsFilter(arr, filter) {
        if (filter === undefined) {
            return false;
        }
        return arr.filter(function (elem) {
            return filter.exec(elem.name);
        })
    }

    static printCoins(coinsArray, idTable) {
        if (idTable === undefined) {
            return false;
        }
        Coin.addTableHeader(coinsArray[0], idTable);
        Coin.addTableElements(coinsArray, idTable);

        return idTable;
    }

    static addTableHeader(obj, idTable) {
        if (idTable === undefined) {
            return false;
        }
        let th = '';
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                th += `<th>${prop}</th>\n`;
            }
        }
        document.querySelectorAll(`#${idTable} thead tr`)[0].innerHTML = th;
    }

    static addTableElements(arr, idTable = '') {
        let tr = '';
        arr.forEach(obj => {
            let td = '';
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    td += `<td>${obj[prop]}</td>\n`;
                }
            }
            tr += `<tr>${td}</tr>\n`;
        });

        document.querySelectorAll(`#${idTable} tbody`)[0].innerHTML = tr;
    }
}

export class CryptopiaCoin extends Coin {

    constructor(coin) {
        super(coin);

        // this.name   = coin.Label;
        // this.last   = coin.LastPrice.toFixed(8);
        // this.high   = coin.High.toFixed(8);
        // this.low    = coin.Low.toFixed(8);
        // this.change = coin.Change;
    }

    static getCoinsFilter(arr) {
        let lastIndex = arr.length - 1,
            listCoins = `^(`;

        arr.forEach(function (item, index) {
            listCoins += (item === 'BTC' ? `${item}/USDT` : `${item}/BTC`)
                + (index != lastIndex ? `|` : '');
        });

        listCoins += ')';

        return new RegExp(listCoins, 'im');
    }

    static setCoinNames(arr) {
        return arr.map(value => {
            value.name = /(\w+)\//.exec(value.name)[1];   // ZEC/BTC => ZEC

            return value;
        });
    }

    static coinsToArray(obj) {
        let arr = [];
        let coin;
        for (let subObj of obj) {
            if (CryptopiaCoin.filter.exec(subObj['Label'])) {
                coin = {
                    name: subObj['Label'],
                    last: subObj['LastPrice'].toFixed(8),
                    high: subObj['High'].toFixed(8),
                    low: subObj['Low'].toFixed(8),
                    change: subObj['Change'].toFixed(8)
                };
                arr.push(new Coin(coin));
            }
        }

        return CryptopiaCoin.sortCoins(CryptopiaCoin.setCoinNames(arr));
    }
}

export class PoloniexCoin extends Coin {

    constructor(coin) {
        super(coin);

        // this.name   = coin.name;
        // this.last   = coin.last;
        // this.high   = coin.high24hr;
        // this.low    = coin.lowestAsk;
        // this.change = coin.percentChange;
    }

    static coinsToArray(obj) {
        let arr = [];
        let coin;
        for (let subObjName in obj) {
            if (obj.hasOwnProperty(subObjName)) {
                if (parseInt(obj[subObjName].isFrozen) == 0 && PoloniexCoin.filter.exec(subObjName)) {
                    coin = {
                        name: subObjName,
                        last: obj[subObjName]['last'],
                        high: obj[subObjName]['high24hr'],
                        low: obj[subObjName]['lowestAsk'],
                        change: obj[subObjName]['percentChange']
                    };
                    arr.push(new Coin(coin));
                }
            }
        }

        return PoloniexCoin.sortCoins(PoloniexCoin.setCoinNames(arr));
    }

    static setCoinNames(arr) {
        return arr.map(value => {
            value.name = /_(\w+)/.exec(value.name)[1];   // BTC_ZEC => ZEC

            return value;
        });
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