require("dotenv").config();

const envConfig = process.env;

const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const uri = `mongodb+srv://${envConfig.DB_USER}:${envConfig.DB_PASSWORD}@cluster0.fwlbewv.mongodb.net/?retryWrites=true&w=majority`;

const User = require("./models_db/userModel");

const app = express();

app.use(express.json());

// TODO: encrypt user mdp with bcrypt

app.post("/register", async (req, res) => {
    const params = req.body;
    console.log(params);
    const password = params.password;

    console.log(`Let's register ${params.username}!`);

    let bcryptSalt;
    let error = undefined;

    let encryptPwd;
    await bcrypt
        .genSalt(parseInt(envConfig.SALT_ROUND))
        .then(salt => {
            console.log('Salt: ', salt)
            bcryptSalt = salt;
            return bcrypt.hash(password, salt)
        })
        .then(hash => {
            console.log('Hash: ', hash)
            encryptPwd = hash
            isFine = true;
        })
        .catch(err => {
            console.error(err.message);
            error = "Error during the encryption of the password";
        });

    if(!error) {
        try {
            params.salt = bcryptSalt;
            params.password = encryptPwd;
            console.log(params);
            await User.create(params);
            res.status(418).json({
                message: "Your password has been encrypted successfully"
            });
        } catch(error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(500).json({
            message: "Error during the encryption of the password"
        })
    }
});

app.post("/login", async (req, res) => {
    const params = req.body;
    console.log(params);
    const password = params.password;

    let user = await User.findOne({
        email: params.email
    })

    console.log(`Let's login: ${params.username}`);
    console.log(user);

    let bcryptSalt;
    let error = undefined;

    await bcrypt
        .genSalt(parseInt(envConfig.SALT_ROUND))
        .then(salt => {
            console.log('Salt: ', salt)
            bcryptSalt = salt;
            return bcrypt.hash(password, user.salt)
        })
        .then(hash => {
            console.log('Hash: ', hash)
            encryptPwd = hash
            isFine = true;
        })
        .catch(err => {
            console.error(err.message);
            error = "Error during the encryption of the password";
        });

    if(!error) {
        try {
            params.salt = bcryptSalt;
            params.password = encryptPwd;
            console.log(params);
            console.log(`Does the user exists? ${user.password === encryptPwd}`);
            res.status(418).json({
                message: "Your password has been encrypted successfully"
            });
        } catch(error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(500).json({
            message: "Error during the encryption of the password"
        })
    }
});

mongoose.connect(uri)
    .then(() => {
        console.log(`Connected to db`);
        app.listen(envConfig.PORT, () => {
            console.log(`Server is listening on port: ${envConfig.PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })