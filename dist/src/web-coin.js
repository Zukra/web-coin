"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Admininstrator on 27.02.2017.
 */

var WebCoin = function () {
    function WebCoin(name, coin) {
        _classCallCheck(this, WebCoin);

        this.name = name;
        this.id = coin.id;
        this.last = coin.last;
        this.lowestAsk = coin.lowestAsk;
        this.highestBid = coin.highestBid;
        this.percentChange = coin.percentChange;
        this.isFrozen = coin.isFrozen;
        this.high24hr = coin.high24hr;
    }

    _createClass(WebCoin, null, [{
        key: "getXHTTP",
        value: function getXHTTP() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            // code for IE6, IE5
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }, {
        key: "getCoinsFromUrl",
        value: function getCoinsFromUrl(url) {
            var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var xhttp = this.getXHTTP();
            if (async) {
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var _objectWebCoins = WebCoin.parseJson(this.responseText),
                            _coinsArray = WebCoin.coinsArray(_objectWebCoins);
                        // WebCoin.printCoins(coinsArray);
                    }
                };
            }
            xhttp.open("GET", url, async);
            xhttp.send();

            if (!async) {
                return xhttp.responseText;
            }
        }
    }, {
        key: "parseJson",
        value: function parseJson(json) {
            return JSON.parse(json);
        }
    }, {
        key: "coinsArray",
        value: function coinsArray(obj) {
            var coinsArray = [];

            for (var key in obj) {
                coinsArray.push(new WebCoin(key, obj[key]));
            }

            return coinsArray;
        }
    }, {
        key: "printCoins",
        value: function printCoins(coinsArray) {
            for (var index in coinsArray) {
                console.log(coinsArray[index].name);
            }
        }
    }]);

    return WebCoin;
}();

var urlPoloniex = "https://poloniex.com/public?command=returnTicker",
    jsonCoins = WebCoin.getCoinsFromUrl(urlPoloniex),
    objectWebCoins = WebCoin.parseJson(jsonCoins),
    coinsArray = WebCoin.coinsArray(objectWebCoins);

// WebCoin.printCoins(coinsArray);
console.log(objectWebCoins);

for (var index in coinsArray) {
    console.log(coinsArray[index].name);
}
//# sourceMappingURL=web-coin.js.map