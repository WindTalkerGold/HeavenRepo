class Stock:
    def __init__(self, symbol, code, name):
        self.symbol = symbol
        self.code = code
        self.name = name

    def __str__(self):
        return '{}\t{}\r\n'.format(self.symbol, self.code)