const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { Candidate, Admin } = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post("/", async (req, res, next) => {
    /**
     * This controller stores the data when a new 
     * candidate registers. 
     */
    try {
        // make sure the does not exist already
        const candidate = await Candidate.findOne({ email: req.body.email });
        // check if user exists
        if (candidate) {
            return res.json({
                message: 'Email address already in use by another candidate',
                error: true
            })
        }

        // create a candidate object
        await Candidate.create({
            candidatesName: req.body.candidatesName,
            email: req.body.email,
            phone: req.body.phone,
            levelOfEducation: req.body.levelOfEducation,
            institution: req.body.institution,
            courseOfStudy: req.body.courseOfStudy,
            stateOfResident: req.body.stateOfResidence,
            locationType: req.body.locationType.toString(),
            gender: req.body.gender,
            higherDegreeType: req.body.higherDegreeType,
            country: req.body.country,
            paymentMethod: req.body.paymentMethod,
            paymentStatus: req.body.paymentStatus,
            payAmount: req.body.payAmount
        });

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.userEmail,
                clientId: process.env.clientId,
                clientSecret: process.env.clientSecret,
                refreshToken: process.env.refreshToken,
                accessToken: process.env.accessToken
            }
        });

        var mailOptions = {
            from: `Oriental CyberSecurity <${req.body.email}>`,
            to: ['info@foretrustgroup.com', 'ptc0x0@gmail.com'],
            subject: `New Candidate Registered`,
            html: `
                <b>Full Name: </b>${req.body.candidatesName}<br />
                <b>Email Address: </b>${req.body.email}<br />
                <b>Phone Number: </b>${req.body.phone}<br />
                <b>Level of Education: </b>${req.body.levelOfEducation}<br />
                <b>Higher Degree Level: </b>${req.body.higherDegreeType || " "}<br />
                <b>Institution: </b>${req.body.institution || " "}<br />
                <b>Course of Study: </b>${req.body.courseOfStudy || " "}<br />
                <b>Country: </b>${req.body.country}<br />
                <b>State of Residence: </b>${req.body.stateOfResidence || " "}<br />
                <b>Preferred Method of Attendance: </b>${req.body.locationType} <br />
                <b>Payment Method: </b>${req.body.paymentMethod}<br />
                <b>Payment Status: </b>${req.body.paymentStatus}<br />
                <b>Pay Amount: </b>${req.body.payAmount}<br />
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({
            message: 'Candidate added successflly',
            error: false
        })

    } catch (err) {
        console.log(err);
        return res.json({
            message: 'An error occured',
            error: true
        })
    }
});

router.get("/", async (req, res, next) => {
    /**
     * This controller gets all the candidates from the database
     */
    try {
        let candidates = await Candidate.find({}).sort([['createdAt', -1]]);
        res.json({
            data: candidates,
            error: false
        })
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'An error occured',
            error: true
        })
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password;

        // find admin
        const admin = await Admin.findOne({ email: email });
        // check if admin exists
        if (!admin) {
            return res.status(401).json({
                message: 'Authentication error: invalid email/password',
                error: true
            })
        }
        // check if admin password is correct
        const matched = await bcrypt.compare(password, admin.password);
        if (!matched) {
            return res.status(401).json({
                message: 'Authentication error: invalid adminname/password',
                error: true
            })
        }
        // return JWT
        const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // send the token through cookie in the response
        res.cookie('token', token, { httpOnly: true });
        res.json({
            message: 'Loggedin successflly',
            error: false,
            token: token
        })

    } catch (err) {
        console.log(err);
        return res.json({
            message: 'An error occured',
            error: true
        })
    }
});

module.exports = router;