angular
  .module('stockPortfolioApp')
  .factory('SessionFactory', SessionFactory);

function SessionFactory($location) {
  return {
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
        rangeSelector : {
          selected : 0
        },
        title : {
          text : ticker + ' Stock Price'
        },
        series : [{
          name : ticker,
          data : data,
          tooltip: {
            valueDecimals: 2
          }
        }]
      });
    }
  }
}
