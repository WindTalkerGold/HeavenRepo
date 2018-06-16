from azure.cosmosdb.table.models import Entity


class Stock(Entity):
    def __init__(self, symbol, code, name):
        self.PartitionKey = symbol
        self.RowKey = code
        self.Name = name

    def __str__(self):
        return '{}\t{}\t{}'.format(self.PartitionKey, self.RowKey, self.Name)