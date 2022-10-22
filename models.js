const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

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
        },
        gender: {
            type: String
        },
        higherDegreeType: {
            type: String
        },
        country: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Admin = mongoose.model('Admin', adminSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = { Admin, Candidate };