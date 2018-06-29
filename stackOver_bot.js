const env = require('../.env')
const telegraf = require('telegraf')
const extra = require('telegraf/extra')
const sqlite3 = require('sqlite3').verbose()
const docx = require("docx")
const fs = require("fs")
const Markup = require('telegraf/markup')
const bot = new telegraf(env.token)
let db = new sqlite3.Database('../cont.db')
  
let sql = `Select DISTINCT titulo  tit
from conteudo;`

ops = []
db.each(sql,(err,row)=>{
    if(err){
        console.log(err)
    }
    ops.push(row.tit) 
    
})
const botoes = () => extra.markup(Markup.inlineKeyboard(
    ops.map(item=> Markup.callbackButton(item,`chama ${item}`)),
    {columns:4}
))
bot.start(async c =>{
    c.reply(`Bem vindo ${c.update.message.from.first_name} \n Escolha uma linguagem:`,botoes(),`Em caso de duvidas 'help' para ajuda`)

})
bot.action(/chama (.+)/, c =>{
    let  sql = `Select cont con from conteudo where titulo = ? `
    let param = c.match[1]
    db.get(sql,param,(err,row)=>{
        if(err){
            console.log(err)
        }

        var cont = row.con
        var i = 0
    var ate =4000
    var tam = cont.length
    while(ate <= tam){
        c.reply(`${cont.slice(i,ate)}`)
        i+=4000
        ate+=4000
        if(ate > tam){
            c.reply(`${cont.slice(i,tam)}`)  
         }
      }
})
   c.reply(`Quer Saber Mais, ou conteudo em docx?`,  Markup.keyboard([`Sim, quero saber mais sobre ${c.match[1]}`,`Sim, quero o doc de ${c.match[1]}`,`Não`]).resize().oneTime().extra())  
})
bot.hears(/Sim, quero o doc de (.+)/,c=>{
    let  sql = `Select cont con from conteudo where titulo = ? `
    let param = c.update.message.text.slice(20)
    db.get(sql,param,(err,row)=>{
        if(err){
            console.log(err)
        }
        var cont = row.con

        var doc = new docx.Document()
        var parag = new docx.Paragraph(`${cont}`);
        doc.addParagraph(parag)
        var exporter = new docx.LocalPacker(doc);
        exporter.pack(`${c.update.message.text.slice(20)}`)

    })
    c.replyWithDocument({source:`${c.update.message.text.slice(20)}.docx`})
    c.reply(`Quer Saber Mais? (estamos fazendo seu docx) :)`,  Markup.keyboard([`Sim, quero saber mais sobre ${c.match[1]}`,'não']).resize().oneTime().extra())  
})
bot.hears(/Sim, quero saber mais sobre (.+)/,c=>{
    let  sql = `Select s_mais mais from conteudo where titulo = ? `
    let param = c.update.message.text.slice(28)
    db.get(sql,param,(err,row)=>{
        var s = `${row.mais}`
        c.reply(`${s}`,Markup.keyboard([`Continuar`]).resize().oneTime().extra())
    })
})


bot.hears(/help/,async c =>{
    c.reply(`O objetivo deste chat bot é auxiliar desenvolvedores fornecendo exemplos de código e de sintaxe de diversas linguagens. Além da interação online, também é possível realizar o download dos materiais para consultas offline.\n\n
    Desenvolvido por Brendon Prado e Matheus Rocha 2018.`,Markup.keyboard([`Continuar`]).resize().oneTime().extra())  
})
bot.on('text',c=>{
    c.reply(`Escolha uma linguagem:`,botoes())
})
bot.startPolling()
