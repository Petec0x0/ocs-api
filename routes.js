const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { Candidate } = require('./models');

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
                message: 'Email address already in use',
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
            stateOfResident: req.body.stateOfResident,
            locationType: req.body.locationType
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
            from: `Petec0x0 <${req.body.email}>`,
            to: 'udehonyedikachi01@gmail.com',
            subject: `OCS : New Candidate Registered`,
            html: `
                ${req.body.candidatesName}<br />
                ${req.body.email}<br />
                ${req.body.phone}<br />
                ${req.body.levelOfEducation}<br />
                ${req.body.institution}<br />
                ${req.body.courseOfStudy}<br />
                ${req.body.stateOfResident}<br />
                ${req.body.locationType}
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
        let candidates = await Candidate.find({});
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

module.exports = router;