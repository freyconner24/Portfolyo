describe("PortfolioFactory", function() {
  var PortfolioFactory;

  beforeEach(module('stockPortfolioApp'));
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    PortfolioFactory = $injector.get('PortfolioFactory');
    Parse.initialize("ad6mbEM5hhlV5d5mZ11f7FYpcKXN88UY8ih3ddwF", "Q84dZOCYQyf0bUahMhQ5hHaklQyORhUPHTDIgcHz");
  }));

  it("portfolioExists() should return true if there is a portfolio of the same name", function() {
    var vmNewPortfolioTitle = "tech stocks";
    var vmPortfolios = [];
    var newPortfolio = {
      title: vmNewPortfolioTitle
    };
    vmPortfolios.push(newPortfolio);

    var result = PortfolioFactory.portfolioExists(vmPortfolios, vmNewPortfolioTitle);
    expect(result).toEqual(true);
  });
  it("portfolioExists() should return false if no portfolio names match", function() {
    var vmNewPortfolioTitle = "tech stocks";
    var vmPortfolios = [];
    var newPortfolio = {
      title: "other stocks"
    };
    vmPortfolios.push(newPortfolio);

    var result = PortfolioFactory.portfolioExists(vmPortfolios, vmNewPortfolioTitle);
    expect(result).toEqual(false);
  });
  // it("addPortfolio() should return the new portfolio", function() {
  //   var newPortfolioTitle = "tech stocks";
  //   var vm = {
  //     portfolios: [
  //       {
  //         objectId: "xxx",
  //         title: "other stocks",
  //         createdAt: "a date",
  //         stocks: []
  //       }
  //     ],
  //     newPortfolioTitle: newPortfolioTitle
  //   };
  //
  //   var newPortfolio = PortfolioFactory.constructPortfolioObject("yyy", newPortfolioTitle, "created at", []);
  //
  //   PortfolioFactory.addPortfolio(vm)
  //     .then(function(result) {
  //       expect(result).toEqual(newPortfolio);
  //     });
  // });
  it("addPortfolio() should return false if it can't add a portfolio", function() {
    var newPortfolioTitle = "other stocks";
    var vm = {
      portfolios: [
        {
          objectId: "xxx",
          title: "other stocks",
          createdAt: "a date",
          stocks: []
        }
      ],
      newPortfolioTitle: newPortfolioTitle
    };

    var newPortfolio = PortfolioFactory.constructPortfolioObject("yyy", newPortfolioTitle, "created at", []);

    var didMakePortfolio = PortfolioFactory.addPortfolio(vm);
    expect(didMakePortfolio).toEqual(false);
  });
  it("constructPortfolioObject() should return a portfolio object", function() {
    var objectId, title, createdAt, stocks;
    objectId = "xxx";
    title = "tech stocks";
    createdAt = "created at";
    stocks = [];
    var newPortfolio = {
      objectId: objectId,
      title: title,
      createdAt: createdAt,
      stocks: stocks
    };
    var portfolio = PortfolioFactory.constructPortfolioObject(objectId, title, createdAt, stocks);
    expect(portfolio).toEqual(newPortfolio);
  });
  it("deleteStocks() should delete stocks", function() {
    var stocks = [];
    stocks.push({
      objectId: "xxx",
      ticker: "NFLX",
      price: 117.34,
      change: -0.34
    });
    stocks.push({
      objectId: "yyy",
      ticker: "AAPL",
      price: 193.02,
      change: 0.46
    });

    var deletedStocks = PortfolioFactory.deleteStocks(stocks);
    expect(deletedStocks).toEqual([]);
  });
  it("addPortfolio() should return the new portfolio", function() {
    PortfolioFactory.getPortfolios()
      .then(function(portfolios) {
        expect(portfolios).toEqual({});
      });
  });
});

/*describe('PortfolioFactory', function () {

  it('should load some data from parse', function () {
    var stub = Parse.Mock.stubQueryFind(function (options) {
      return [new Parse.Object('User', {name: 'Antony'})]
    });

    expect(getUser()).toBeUndefined();

    loadUser(); //function that invokes Query.find

    expect(getUser()).toBeDefined();
    expect(stub.callCount).toEqual(1); //do assertions on stub object if necessary
  }));

  afterEach(inject(function () {
    Parse.Mock.clearStubs(); //manually dispose of stubs
  }));
});
*/
