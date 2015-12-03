angular
  .module('stockPortfolioApp')
  .factory('ModalFactory', ModalFactory);

function ModalFactory($location, $http) {
  var factory = {};
  return factory = {
    showChart: function(ticker, values, dates) {
      /*$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (res) {
        console.log(res);
      });*/
      var data = [];
      for(var i = 0; i < values.length; ++i) {
        var date = new Date((dates[i] || "").replace(/-/g,"/").replace(/[TZ]/g," "));
        date = /(\w+\s\w+\s\d+\s\d+)/.exec(date);

        data.push([date[0], values[i]]);
      }

      $('#stockChart').highcharts('StockChart', {
        rangeSelector: {
          selected: 0
        },
        title: {
          text: ticker + ' Stock Price'
        },
        series: [{
          name: ticker,
          data: data,
          tooltip: {
            valueDecimals: 2
          }
        }]
      });
    },
    stockModal: function(stock) {
      console.log(stock);
      var ticker = stock.stock.ticker.toUpperCase();
      var searchObject = {
        "Normalized":false,
        "NumberOfDays":100,
        "DataPeriod":"Day",
        "Elements":[
          {
            "Symbol":ticker,
            "Type":"price",
            "Params":["c"]
          }
        ]
      };
      var url = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp?parameters=' + encodeURIComponent(JSON.stringify(searchObject)) + '&callback=JSON_CALLBACK';
      console.log(url);
      return $http.jsonp(url).then(function(response) {
        console.log(response);
        var vmStockModalIsVisible = true;
        setTimeout(function() {
          factory.showChart(ticker, response.data.Elements[0].DataSeries.close.values, response.data.Dates);
        }, 500);
        var vmModalStock = { // TODO: these are all undefined since query is different
          name: response.data.Name,
          ticker: response.data.Symbol,
          change: response.data.Change,
          price: response.data.LastPrice
        };
        var modalObject = {
          vmStockModalIsVisible: vmStockModalIsVisible
        };
        console.log(modalObject);
        return modalObject;
      });
    },
    closeModal: function() {
      return false;
    }
  }
}
