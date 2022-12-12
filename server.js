require('dotenv').config()
const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
    console.log("server started")
});

const users = [
    {
        username: 'John',
        dob: '27-04-1998',
        userId: 1
    },
    {
        username: 'Kate',
        dob: '27-01-1994',
        userId: 2
    }
]




app.use(express.json());

// Handling post request
app.post("/login", async (req, res, next) => {
    let { username } = req.body;
    const user = { username: username };
    let token;
    try {
        //Creating jwt token
        token = jwt.sign(
            user,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }

    res
        .status(200)
        .json({
            success: true,
            data: {
                username: username,
                token: token,
            },
        });
});

app.get('/profile', authenticateToken, (req, res) => {
    res
        .status(200)
        .json(users.filter(user => user.username === req.user.username))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}