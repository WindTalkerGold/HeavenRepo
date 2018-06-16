import json
import urllib.request
from stock import Stock
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import EntityProperty
from azure.cosmosdb.table.models import EdmType

class SymbolCrawler:
    def __init__(self):
        self.total_symbols_to_crawl = 0
        self.total_symbols_to_crawled = 0
        self.current_page = 0
        self.LinkFormat = 'https://xueqiu.com/stock/cata/stocklist.json?page={}&size=30&order=desc&orderby=percent&type=11%2C12&_=1522591790670'
        self.stocks = []

    def has_next(self):
        if self.current_page == 0:
            return True
        if self.current_page >= 200:
            return False
        return self.total_symbols_to_crawl > self.total_symbols_to_crawled

    def crawl_next(self):
        self.current_page += 1
        url = self.LinkFormat.format(self.current_page)
        print(url)

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6',
            'Host':'xueqiu.com',
            'Cookie':'device_id=e4ba4977314e200234880bac6b3585af; s=f61bvmhzj7; _ga=GA1.2.1562254249.1522590556; _gid=GA1.2.447715148.1528814975; xq_a_token=019174f18bf425d22c8e965e48243d9fcfbd2cc0; xq_a_token.sig=_pB0kKy3fV9fvtvkOzxduQTrp7E; xq_r_token=2d465aa5d312fbe8d88b4e7de81e1e915de7989a; xq_r_token.sig=lOCElS5ycgbih9P-Ny3cohQ-FSA; Hm_lvt_1db88642e346389874251b5a1eded6e3=1528814975,1528897343; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1528897343; u=111528897342585; _gat_gtag_UA_16079156_4=1'}
        req = urllib.request.Request(url, headers=headers)
        response = urllib.request.urlopen(req)

        jdata = json.loads(response.read())
        if self.total_symbols_to_crawl == 0:
            self.total_symbols_to_crawl = int(jdata['count']['count'])

        for eachStock in jdata['stocks']:
            self.stocks.append(Stock(eachStock['symbol'], eachStock['code'], eachStock['name']))
            self.total_symbols_to_crawled += 1

        print('current parsed to page {}, {} symbols queried'.format(self.current_page, self.total_symbols_to_crawled))


if __name__ == '__main__':
    crawler = SymbolCrawler()
    while crawler.has_next():
        crawler.crawl_next()

    table_service = TableService(account_name='heaventextb06a', account_key='**fill your own key**')
    for each_stock in crawler.stocks:
        print(each_stock)
        body = EntityProperty(EdmType.STRING, str(each_stock))
        table_service.insert_or_replace_entity('heavenstock', each_stock)
