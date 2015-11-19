describe("ModalFactory", function() {
  var ModalFactory, $httpBackend;

  beforeEach(module('stockPortfolioApp'));
  beforeEach(inject(function($injector) {
    ModalFactory = $injector.get('ModalFactory');
    $httpBackend = $injector.get('$httpBackend');
    var ticker = "XXX";
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
    $httpBackend
      .whenGET('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp?parameters=' + encodeURIComponent(JSON.stringify(searchObject)) + '&callback=JSON_CALLBACK') // dummy URL
      .respond(200, {
        "response": {
          "data": {
            "Name": ticker + " Company",
            "Symbol": ticker,
            "Change": 100.10,
            "LastPrice": 90.22,
            "Dates": [],
            "Elements": [
              {
                "DataSeries": {
                  "close": {
                    "values": []
                  }
                }
              }
            ]
          }
        }
      });
  }));

  it("closeModal() should return false so that the modal is not shown", function() {
    var modalShown = ModalFactory.closeModal(); // hello
    expect(modalShown).toEqual(false);
  });
  it("stockModal() should get stock information", function() {
    var stock = {};
    stock.stock = {};
    stock.stock.ticker = "XXX";

    ModalFactory.stockModal(stock)
      .then(function(responseModalObject) {
        var modalObject = {
          vmStockModalIsVisible: true
        };
        expect(responseModalObject).toEqual(modalObject);
      });
  });

});
