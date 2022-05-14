const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
    {
        candidatesName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        levelOfEducation: {
            type: String
        },
        institution: {
            type: String
        },
        courseOfStudy: {
            type: String
        },
        stateOfResident: {
            type: String
        },
        locationType: {
            type: String
        }
    },
    {
        timestamps: true
    }    
);

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = { Candidate };