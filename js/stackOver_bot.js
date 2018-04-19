const env = require('../.env')
const telegraf = require('telegraf')
const extra = require('telegraf/extra')
const sqlite3 = require('sqlite3').verbose()
const session = require('telegraf/session')
const Markup = require('telegraf/markup')
const bot = new telegraf(env.token)
let db = new sqlite3.Database('./cont.db')
  
let sql = `Select titulo  tit,
        cont con,
        s_mais s
from conteudo;`

ops = []
cont = []
s_mais = []
db.each(sql,(err,row)=>{
    if(err){
        console.log(err)
    }
    ops.push(`${row.tit}`) 
    cont.push(`${row.con}`)
    s_mais.push(`${row.s}`)
})
const botoes = () => extra.markup(Markup.inlineKeyboard(
    ops.map(item=> Markup.callbackButton(item,`chama ${item}`)),
    {columns:3}
))
bot.start(async c =>{
    c.reply(`Bem vindo ${c.update.message.from.first_name} \n Escolha uma linguagem:`,botoes())
})
bot.action(/chama (.+)/,c =>{
    const ob  = ops.findIndex(k =>k==c.match[1])
    var i = 0
    var ate =4000
    var tam = cont[ob].length
    while(ate <= tam){
        c.reply(`${cont[ob].slice(i,ate)}`)
        i+=4000
        ate+=4000
        if(ate > tam){
            c .reply(`${cont[ob].slice(i,tam)}`)  
         }
  }
    c.reply(`Quer Saber Mais?`,  Markup.keyboard([`Sim, quero saber mais sobre ${c.match[1]}`,'Não']).resize().oneTime().extra())
    
})
bot.hears(/Sim, quero saber mais sobre (.+)/,c=>{
    const ob  = ops.findIndex(k =>k==c.update.message.text.slice(28))
    c.reply(`${s_mais[ob]}`,Markup.keyboard([`Continuar`]).resize().oneTime().extra())
})
bot.on('text',c=>{
    c.reply(`Escolha uma linguagem:`,botoes())

})
bot.startPolling()
