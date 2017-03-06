(function () {
    "use strict";

    $.getScript('src/coins.js', function () {   // load classes
        "use strict";

        $.getJSON("config.json")
            .done(function (json) {
                initPoloniex(json); // init Poloniex
            })
            .fail(function (jqxhr, textStatus, error) {
                console.log("Request Failed: " + textStatus + ", " + error);
                alert("Request Failed: " + textStatus + ", " + error);
            });
    });

    function initPoloniex(config) {
        let poloniex = PoloniexCoin;

        poloniex.filter = poloniex.getCoinsFilter(config['coins']);

        poloniex.getCoinsFromUrlPromise(config.urlPoloniex)
            .then(poloniex.parseJson)
            .then(poloniex.coinsToArray)
            .then(poloniex.printCoins)
            .catch(error => console.error(error));
    }

})();