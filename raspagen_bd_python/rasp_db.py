import requests
from bs4 import BeautifulSoup
import sqlite3
conn = sqlite3.connect('cont.db')
cursor = conn.cursor()

a =['/docs/pt-br/awk-pt/', '/docs/pt-br/bf-pt/', '/docs/pt-br/c-pt/', '/docs/pt-br/csharp-pt/', '/docs/pt-br/c++-pt/', '/docs/pt-br/clojure-pt/', '/docs/pt-br/coffee-pt/', '/docs/pt-br/common-lisp-pt/', '/docs/pt-br/css-pt/', '/docs/pt-br/dart-pt/', '/docs/pt-br/elisp-pt/', '/docs/pt-br/elixir-pt/', '/docs/pt-br/elm-pt/', '/docs/pt-br/erlang-pt/', '/docs/pt-br/go-pt/', '/docs/pt-br/groovy-pt/', '/docs/pt-br/hack-pt/', '/docs/pt-br/haskell-pt/', '/docs/pt-br/hy-pt/', '/docs/pt-br/java-pt/', '/docs/pt-br/json-pt/', '/docs/pt-br/julia-pt/', '/docs/pt-br/kotlin-pt/', '/docs/pt-br/latex-pt/', '/docs/pt-br/markdown-pt/', '/docs/pt-br/matlab-pt/', '/docs/pt-br/paren-pt/', '/docs/pt-br/perl-pt/', '/docs/pt-br/php-pt/', '/docs/pt-br/python-pt/', '/docs/pt-br/python3-pt/', '/docs/pt-br/ruby-pt/', '/docs/pt-br/rust-pt/', '/docs/pt-br/sass-pt/', '/docs/pt-br/scala-pt/',  '/docs/pt-br/solidity-pt/', '/docs/pt-br/swift-pt/', '/docs/pt-br/type-pt/', '/docs/pt-br/visualbasic-pt/', '/docs/pt-br/whip-pt/', '/docs/pt-br/xml-pt/', '/docs/pt-br/yaml-pt/', '/docs/pt-br/amd-pt/', '/docs/pt-br/bash-pt/', '/docs/pt-br/php-composer-pt/', '/docs/pt-br/git-pt/', '/docs/pt-br/jquery-pt/', '/docs/pt-br/pyqt-pt/', '/docs/pt-br/qt-pt/', '/docs/pt-br/ruby-ecosystem-pt/', '/docs/pt-br/tmux-pt/', '/docs/pt-br/vim-pt/']
tit = []
cont = []
s_mais = []
for x in a:
    url = requests.get("https://learnxinyminutes.com"+x)
    soup = BeautifulSoup(url.content,"html.parser")
    disp = soup.find("title")
    if(disp.getText()=='404 Not Found'):
        continue
    h2 = soup.find('h2')
    p =  soup.select('p')
    tit.append(h2.getText()[7:])
    c = soup.select('div pre')
    p = p[2:]
    st = ''
    s = ''
    for x in c:
        st += x.getText()
    for x in p:
        s += x.getText()
    s_mais.append(s)
    cont.append(st)
    

cursor.execute('''Create table conteudo(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
,titulo text not null,cont text not null,s_mais text not null);''')

i = 0
while i < len(tit):
    cursor.execute('''Insert into conteudo(titulo,cont,s_mais) values(?,?,?)''',(tit[i],cont[i],s_mais[i]))
    conn.commit()
    i+=1
conn.close()
