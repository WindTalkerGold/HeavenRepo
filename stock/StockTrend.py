from azure.cosmosdb.table.models import Entity
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.tablebatch import TableBatch
import urllib.request
import json


class StockTrend(Entity):
    def __init__(self, symbol, jinstance):
        self.PartitionKey = symbol
        self.RowKey = jinstance['timestamp']
        self.Time = jinstance['time']
        self.Percent = jinstance['percent']
        self.Volume = jinstance['volume']
        self.Open = jinstance['open']
        self.High = jinstance['high']
        self.Close = jinstance['close']
        self.Low = jinstance['low']


def fetch(symbol):
    query = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol={}&period=1day&type=normal&begin=1491135898609'.format(
        symbol)
    print(query)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6',
        'Host': 'xueqiu.com',
        'Cookie': 'device_id=e4ba4977314e200234880bac6b3585af; s=f61bvmhzj7; __utmz=1.1523804163.4.3.utmcsr=link.zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _ga=GA1.2.1562254249.1522590556; _gid=GA1.2.447715148.1528814975; __utma=1.1562254249.1522590556.1525183132.1528899212.6; aliyungf_tc=AQAAALJ89zbY6QgAGPJ1tB0byAfU9AOA; xq_a_token=019174f18bf425d22c8e965e48243d9fcfbd2cc0; xq_a_token.sig=_pB0kKy3fV9fvtvkOzxduQTrp7E; xq_r_token=2d465aa5d312fbe8d88b4e7de81e1e915de7989a; xq_r_token.sig=lOCElS5ycgbih9P-Ny3cohQ-FSA; Hm_lvt_1db88642e346389874251b5a1eded6e3=1528814975,1528897343,1528980734; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1528980734; u=771528980734010; _gat_gtag_UA_16079156_4=1'}
    req = urllib.request.Request(query, headers=headers)
    response = urllib.request.urlopen(req)

    jdata = json.loads(response.read())
    for info in jdata['chartlist']:
        yield StockTrend(symbol, info)


def crawl_and_store(table_service, symbol):
    batch = TableBatch()

    batch_size = 0
    for each_trend in fetch(symbol):
        batch.insert_or_replace_entity(each_trend)
        batch_size = batch_size + 1

        if batch_size >= 75:
            table_service.commit_batch('stocktrend', batch)
            batch = TableBatch()
            print("stored a batch, size:", batch_size)
            batch_size = 0


    if batch_size > 0:
        table_service.commit_batch('stocktrend', batch)
        print("stored a batch, size:", batch_size)


if __name__ == "__main__":
    table_service = TableService(account_name='heaventextb06a',
                                 account_key='** fill in your own key**')

    symbols = table_service.query_entities('heavenstock', filter="PartitionKey ge 'S'")
    for stock in symbols:
        print(stock.PartitionKey)
        crawl_and_store(table_service, stock.PartitionKey)