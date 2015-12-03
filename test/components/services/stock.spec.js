describe("StockFactory", function() {
  var StockFactory;

  beforeEach(module('stockPortfolioApp'));
  beforeEach(inject(function($injector) {
    StockFactory = $injector.get('StockFactory');
  }));

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
    var portfolio = StockFactory.constructPortfolioObject(objectId, title, createdAt, stocks);
    expect(portfolio).toEqual(newPortfolio);
  });
  it("constructStockObject() should return a stock object", function() {
    var objectId, ticker, price, change;
    objectId = "xxx";
    ticker = "DDD";
    price = "11.24";
    change = "-0.34";
    var newStock = {
      objectId: objectId,
      ticker: ticker,
      price: price,
      change: change
    };
    var stock = StockFactory.constructStockObject(objectId, ticker, price, change);
    expect(stock).toEqual(newStock);
  });
  it("stockExists() should return a true if stock exists inside portfolio", function() {
    var ticker = "DDD";
    var portfolio = {};
    portfolio.stocks = [];
    portfolio.stocks.push(StockFactory.constructStockObject("xxx", "DDD", "xxx.xx", "x.xx"));
    portfolio.stocks.push(StockFactory.constructStockObject("yyy", "SSYS", "yyy.yy", "y.yy"));
    var stockExists = StockFactory.stockExists(ticker, portfolio);
    expect(stockExists).toEqual(true);
  });
  it("stockExists() should return a false if stock does not exists inside portfolio", function() {
    var ticker = "AAPL";
    var portfolio = {};
    portfolio.stocks = [];
    portfolio.stocks.push(StockFactory.constructStockObject("xxx", "DDD", "xxx.xx", "x.xx"));
    portfolio.stocks.push(StockFactory.constructStockObject("yyy", "SSYS", "yyy.yy", "y.yy"));
    var stockExists = StockFactory.stockExists(ticker, portfolio);
    expect(stockExists).toEqual(false);
  });
});
