(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Coin = exports.Coin = function () {
    function Coin() {
        var coin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Coin);

        this.name = coin.name;
        this.last = coin.last;
        this.high = coin.high;
        this.low = coin.low;
        this.change = coin.change;
    }

    _createClass(Coin, null, [{
        key: "getXHTTP",
        value: function getXHTTP() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            // code for IE6, IE5
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }, {
        key: "parseJson",
        value: function parseJson(json) {

            return JSON.parse(json);
        }
    }, {
        key: "getCoinsFromUrlPromise",
        value: function getCoinsFromUrlPromise(url) {
            var xhttp = this.getXHTTP();

            return new Promise(function (resolve) {
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status === 200) {
                        resolve(this.responseText);
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.send();
            });
        }
    }, {
        key: "sortCoins",
        value: function sortCoins(arr) {
            return arr.sort(function (a, b) {
                var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                if (x < y) {
                    return -1;
                } else if (x > y) {
                    return 1;
                }
                return 0;
            });
        }
    }, {
        key: "applyCoinsFilter",
        value: function applyCoinsFilter(arr) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /''/;


            return arr.filter(function (elem) {

                return filter.exec(elem.name);
            });
        }
    }, {
        key: "printCoins",
        value: function printCoins(coinsArray) {
            var idTable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            Coin.addTableHeader(coinsArray[0], idTable);
            Coin.addTableElements(coinsArray, idTable);
            return idTable;
        }
    }, {
        key: "addTableHeader",
        value: function addTableHeader(obj) {
            var idTable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            var th = '';
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    th += "<th>" + prop + "</th>\n";
                }
            }
            document.querySelectorAll("#" + idTable + " thead tr")[0].innerHTML = th;
        }
    }, {
        key: "addTableElements",
        value: function addTableElements(arr) {
            var idTable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            var tr = '';
            arr.forEach(function (obj) {
                var td = '';
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        td += "<td>" + obj[prop] + "</td>\n";
                    }
                }
                tr += "<tr>" + td + "</tr>\n";
            });

            document.querySelectorAll('#' + idTable + ' tbody')[0].innerHTML = tr;
        }
    }]);

    return Coin;
}();

var CryptopiaCoin = exports.CryptopiaCoin = function (_Coin) {
    _inherits(CryptopiaCoin, _Coin);

    function CryptopiaCoin(coin) {
        _classCallCheck(this, CryptopiaCoin);

        return _possibleConstructorReturn(this, (CryptopiaCoin.__proto__ || Object.getPrototypeOf(CryptopiaCoin)).call(this, coin));

        // this.name   = coin.Label;
        // this.last   = coin.LastPrice.toFixed(8);
        // this.high   = coin.High.toFixed(8);
        // this.low    = coin.Low.toFixed(8);
        // this.change = coin.Change;
    }

    _createClass(CryptopiaCoin, null, [{
        key: "getCoinsFilter",
        value: function getCoinsFilter(arr) {
            var lastIndex = arr.length - 1,
                listCoins = "^(";

            arr.forEach(function (item, index) {
                listCoins += (item === 'BTC' ? item + "/USDT" : item + "/BTC") + (index != lastIndex ? "|" : '');
            });

            listCoins += ')';

            return new RegExp(listCoins, 'im');
        }
    }, {
        key: "setCoinNames",
        value: function setCoinNames(arr) {
            return arr.map(function (value) {
                value.name = /(\w+)\//.exec(value.name)[1]; // ZEC/BTC => ZEC

                return value;
            });
        }
    }, {
        key: "coinsToArray",
        value: function coinsToArray(obj) {
            var arr = [];
            var coin = void 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var subObj = _step.value;

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
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return CryptopiaCoin.sortCoins(CryptopiaCoin.setCoinNames(arr));
        }
    }]);

    return CryptopiaCoin;
}(Coin);

var PoloniexCoin = exports.PoloniexCoin = function (_Coin2) {
    _inherits(PoloniexCoin, _Coin2);

    function PoloniexCoin(coin) {
        _classCallCheck(this, PoloniexCoin);

        return _possibleConstructorReturn(this, (PoloniexCoin.__proto__ || Object.getPrototypeOf(PoloniexCoin)).call(this, coin));

        // this.name   = coin.name;
        // this.last   = coin.last;
        // this.high   = coin.high24hr;
        // this.low    = coin.lowestAsk;
        // this.change = coin.percentChange;
    }

    _createClass(PoloniexCoin, null, [{
        key: "coinsToArray",
        value: function coinsToArray(obj) {
            var arr = [];
            var coin = void 0;
            for (var subObjName in obj) {
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
    }, {
        key: "setCoinNames",
        value: function setCoinNames(arr) {
            return arr.map(function (value) {
                value.name = /_(\w+)/.exec(value.name)[1]; // BTC_ZEC => ZEC

                return value;
            });
        }
    }, {
        key: "getCoinsFilter",
        value: function getCoinsFilter(arr) {
            var lastIndex = arr.length - 1,
                listCoins = "^(";

            arr.forEach(function (item, index) {
                listCoins += (item === 'BTC' ? "USDT_" + item : "BTC_" + item) + (index != lastIndex ? "|" : '');
            });

            listCoins += ')';

            return new RegExp(listCoins, 'im'); //^(BTC_ZEC|BTC_XMR|BTC_XMG|USDT_BTC)/im
        }
    }]);

    return PoloniexCoin;
}(Coin);

},{}],2:[function(require,module,exports){
"use strict";

var _coins = require("./coins");

(function ($) {
    "use strict";

    $.getJSON("./config.json", function (json) {
        initCryptopia(json);
        initPoloniex(json);
        setInterval(function () {
            initCryptopia(json);
            initPoloniex(json);
        }, 50000);
    }).fail(function () {
        alert('Error loading settings!');
    });

    function initPoloniex(config) {
        var poloniex = _coins.PoloniexCoin,
            tableId = 'poloniex';

        poloniex.filter = poloniex.getCoinsFilter(config['coins']);

        poloniex.getCoinsFromUrlPromise(config['urlPoloniex']).then(poloniex.parseJson).then(poloniex.coinsToArray).then(function (coinsArray) {
            return poloniex.printCoins(coinsArray, tableId);
        }).then(setTableColumnColor).catch(function (error) {
            return console.error(error);
        });
    }

    function initCryptopia(config) {
        var cryptopia = _coins.CryptopiaCoin,
            tableId = 'cryptopia';

        cryptopia.filter = cryptopia.getCoinsFilter(config['coins']);

        cryptopia.getCoinsFromUrlPromise(config['urlCryptopia']).then(cryptopia.parseJson).then(function (obj) {
            return cryptopia.coinsToArray(obj.Data);
        }).then(function (coinsArray) {
            return cryptopia.printCoins(coinsArray, tableId);
        }).then(setTableColumnColor).catch(function (error) {
            return console.error(error);
        });
    }

    function setTableColumnColor() {
        var tableId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        $("#" + tableId).find("tbody tr").each(function (index, element) {
            $(element).find('td').each(function (i, elem) {
                if (parseFloat(elem.innerHTML) < 0) {
                    $(this).parent().addClass('warning');
                } else {
                    $(this).parent().addClass('info');
                }
            });
        });
    }
})(jQuery);

},{"./coins":1}]},{},[2]);
