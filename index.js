let express = require("express");
let speakeasy = require("speakeasy")
let bodyParser = require('body-parser')
let QRCode = require('qrcode')
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



let user =  {
        email: 'email@email.com',
        password: '12345',
        secret_key: 'JQ3WGM3LN5XCK42PEFNGYOT2JM',
        two_factor: true
    }

let generateKey = (req, res) => {
    let secret = speakeasy.generateSecret({ length: 16 });
    QRCode.toDataURL(secret.otpauth_url, (err, data_url)=>{
        console.log(data_url)
        res.send("<img src='"+data_url+"'>" + secret.base32);

    }) 
}

app.get("/", (req, res)=>{ 
    res.send("")    
})

app.get("/key", generateKey)

app.get("/login", (req, res) => {
    res.send("<html><body><form action='/logar' method='post'> <label>email:</label><input type='email' name='email'><label>senha</label><input type='password' name='password'><input type='submit' value='Login'></form></body></html>"
        
    )
} )

app.post('/logar', (req, res)=>{
    let data = req.body
    if(data.email == user.email && data.password == user.password) {
        if(user.two_factor) {
            res.send("<html><body><form action='/access' method='post'> <label>key:</label><input type='text' name='key'><input type='submit' value='Login'></form></body></html>")
        }
        
        res.send('login succeed')
    } else { 
        res.send("falhou")
    }
})


app.post('/access', (req, res)=>{
    let data = req.body
    let verified = speakeasy.totp.verify({secret: user.secret_key, encoding
    : 'base32', token: data.key})
    if(verified){
        res.send('login sucesso')
    } else {
        res.send("login failed")
    }
})


app.listen(3000, ()=>{
    console.log("running...")
})