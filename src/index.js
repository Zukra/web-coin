import {PoloniexCoin, CryptopiaCoin} from "./coins";

(function ($) {
    "use strict";

    run(SETTINGS);

    if (SETTINGS.refresh.status) {
        setInterval(() => run(SETTINGS), SETTINGS.refresh.time);
    }

    function run(config) {
        initCryptopia(config);
        initPoloniex(config);
    }

    function initPoloniex(config) {
        if (config === undefined) {
            return false;
        }
        let poloniex = PoloniexCoin;

        poloniex.filter = poloniex.getCoinsFilter(config.coins);

        poloniex.getCoinsFromUrlPromise(config.poloniex.url)
            .then(poloniex.parseJson)
            .then(poloniex.coinsToArray)
            .then(coinsArray => poloniex.printCoins(coinsArray, config.poloniex.tableId))
            .then(setTableColumnColor)
            .catch(error => console.error(error));
    }

    function initCryptopia(config) {
        if (config === undefined) {
            return false;
        }

        let cryptopia = CryptopiaCoin;

        cryptopia.filter = cryptopia.getCoinsFilter(config.coins);
        cryptopia.getCoinsFromUrlPromise(config.cryptopia.url)
            .then(cryptopia.parseJson)
            .then(obj => cryptopia.coinsToArray(obj.Data))
            .then(coinsArray => cryptopia.printCoins(coinsArray, config.cryptopia.tableId))
            .then(setTableColumnColor)
            .catch(error => console.error(error));
    }

    function setTableColumnColor(tableId) {
        if (tableId === undefined || !tableId) {
            return false;
        }

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