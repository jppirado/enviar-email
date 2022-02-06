const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const SMTP_CONFIG  = require('./config/smtpConfig')


const Transporter = nodemailer.createTransport({
  host:SMTP_CONFIG.host, 
  port:SMTP_CONFIG.port,
  secure:false,
  auth:{
    user:SMTP_CONFIG.user,
    pass:SMTP_CONFIG.pass
  }, 
  tls: {
    rejectUnauthorized: false
  }
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public' )))
app.set('views', path.join(__dirname,'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine' , 'html')


app.get('/' , (request , response)=>{
response.render("index.html")
})

app.post('/' , async (request , response)=>{
  if(!request.body.email.trim() || !request.body.conteudo.trim() ){
    response.redirect('/')
  }else{
    const mailSend = await Transporter.sendMail({
      text: request.body.conteudo,
      subject: request.body.title,
      from: SMTP_CONFIG.user,
      to:  request.body.email
    })
    if(mailSend){
      response.redirect("/successSend")
    }else{
      response.redirect('/errorSend')
    }
  }
})

app.get('/successSend',  (request, response)=>{
  response.send('Email Enviado com sucesso')
})

app.get('/errorSend',  (request, response)=>{
  response.send('Falha ao enviar email confira as suas credencias')
})

app.listen(3333,()=>{
  console.log('Servidor rodando na porta 3333');
})


