import {PoloniexCoin, CryptopiaCoin} from "./coins";

(function ($) {
    "use strict";

    $.getJSON("./config.json", function (json) {
        initCryptopia(json);
        initPoloniex(json);
        setInterval(function () {
            initCryptopia(json);
            initPoloniex(json);
        }, 50000);
    })
        .fail(function () {
            alert('Error loading settings!');
        });

    function initPoloniex(config) {
        let poloniex = PoloniexCoin,
            tableId  = 'poloniex';

        poloniex.filter = poloniex.getCoinsFilter(config['coins']);

        poloniex.getCoinsFromUrlPromise(config['urlPoloniex'])
            .then(poloniex.parseJson)
            .then(poloniex.coinsToArray)
            .then(coinsArray => poloniex.printCoins(coinsArray, tableId))
            .then(setTableColumnColor)
            .catch(error => console.error(error));
    }

    function initCryptopia(config) {
        let cryptopia = CryptopiaCoin,
            tableId   = 'cryptopia';

        cryptopia.filter = cryptopia.getCoinsFilter(config['coins']);

        cryptopia.getCoinsFromUrlPromise(config['urlCryptopia'])
            .then(cryptopia.parseJson)
            .then(obj => cryptopia.coinsToArray(obj.Data))
            .then(coinsArray => cryptopia.printCoins(coinsArray, tableId))
            .then(setTableColumnColor)
            .catch(error => console.error(error));
    }

    function setTableColumnColor(tableId = '') {
        $(`#${tableId}`).find("tbody tr").each(function (index, element) {
            $(element).find('td').each(function (i, elem) {
                if (parseFloat(elem.innerHTML) < 0) {
                    $(this).parent().addClass('warning');
                } else {
                    $(this).parent().addClass('info');
                }
            })
        });
    }
})(jQuery);