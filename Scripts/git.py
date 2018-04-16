import fire
import subprocess
from subprocess import call

def runProcess(self, command):
    p = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    while(True):
        retcode = p.poll() #returns None while subprocess is running
        line = p.stdout.readline().decode('utf-8').rstrip()
        yield line
        if retcode is not None:
            break

class Git(object):
    def mergeMaster(self):
        commands = [
            ['git', 'branch'],
            ['git', 'checkout', 'master'],
            ['git', 'pull'],
            ['git', 'checkout'],
            ['git', 'merge', 'master']
        ]
        currentBranch = ''
        for line in runProcess(self, commands[0]):
            if line.startswith('* '):
                currentBranch = line[2:]

        print("current branch:\t"+currentBranch)
        
        call(commands[1])
        call(commands[2])
        
        commands[3].append(currentBranch)
        call(commands[3])
        call(commands[4])
        print("Merge command execution done")

if __name__ == '__main__':
    fire.Fire(Git)