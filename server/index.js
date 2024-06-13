const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3001;


const {encrypt, decrypt} = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "passwordmanager",
});

app.post("/addpassword", (req,res) => {
    const { password, title } = req.body;

    const hashedPassword = encrypt(password);

    db.query("INSERT INTO passwords (passwords, title, iv) VALUES (?,?,?)",
        [hashedPassword.password, title, hashedPassword.iv]
    , (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send("success");
        }
    }
);
});

app.get("/showpasswords", (req,res) => {
    db.query("SELECT * FROM passwords;",(err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});

// app.post("/decryptpassword", (req, res) => {
//     res.send(decrypt(req.body));
//   });


  app.post('/decryptpassword', (req, res) => {
    try {
      const { encryptedText } = req.body;
  
      if (!encryptedText) {
        throw new Error('encryptedText is required');
      }
  
      const decryptedText = decrypt(encryptedText);
      res.status(200).send({ decryptedText });
    } catch (error) {
      console.error('Error during decryption:', error.message);
      res.status(500).send({ error: error.message });
    }
  });

app.listen(PORT, () => {
    console.log("server connected, currently running");
});