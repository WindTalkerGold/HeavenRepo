import fire
import os
import datetime

class DirectoryWalker:

    def __init__(self, root, ext='', to=''):
        self.data = {}
        self.root = root
        self.ext = ext
        self.to = to
        self.copyCount = 0
          
    def walk(self, directory):
        for file in os.listdir(directory):
            path = os.path.join(directory, file)
            if not os.path.isdir(path):
                ext = os.path.splitext(path)[1]
                if ext in self.data:
                    self.data[ext] = self.data[ext]+1
                else:
                    self.data[ext] = 1
            else:
                self.walk(path)

    def walkAndCopy(self, directory):
        for file in os.listdir(directory):
            path = os.path.join(directory, file)
            if not os.path.isdir(path):
                ext = os.path.splitext(path)[1]
                if ext == self.ext:
                    destFile = str(self.copyCount)+self.ext
                    dest = os.path.join(self.to, destFile)
                    self.copyCount = self.copyCount+1
                    command = 'copy '+path+' '+dest
                    os.system(command)
            else:
                self.walkAndCopy(path)

    def orgByDate(self, directory):
        for file in os.listdir(directory):
            path = os.path.join(directory, file)
            if not os.path.isdir(path):
                timestamp = os.path.getmtime(path)
                date = datetime.datetime.fromtimestamp(timestamp)
                folder = str(date.year)+'_'+str(date.month)+'_'+str(date.day)
                folderPath = os.path.join(self.root, folder)
                try:
                    os.stat(folderPath)
                except:
                    os.mkdir(folderPath)
                dest = os.path.join(folderPath, file)
                command = 'copy '+path+' '+dest
                os.system(command)

class Files(object):
    def stat(self, root):
        walker = DirectoryWalker(root)
        walker.walk(root)
        print(walker.data)  

    def orgByDate(self, root):
        walker = DirectoryWalker(root)
        walker.orgByDate(root)

    def copy(self, root, ext, to):
        if ext == '' or to == '':
            print('invalid input')
            return
        walker = DirectoryWalker(root, ext, to)
        walker.walkAndCopy(root)
        print(walker.copyCount)

if __name__ == '__main__':
    fire.Fire(Files)