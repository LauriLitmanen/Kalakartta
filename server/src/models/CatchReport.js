const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true
};

const requiredNumber = {
    type: Number,
    required: true
};

const catchReportSchema = new Schema ({
    title: requiredString,
    species: requiredString,
    length: {
        type: Number,
        min: [0, 'A bit small eh?'],
        max: [1000, 'a whale?']
    },
    weight: {
        type: Number,
        min: [0, 'A bit small eh?'],
        max: [300, 'Thats a pig!']
    },
    fishingMethod: requiredString,
    lure: String,
    date: {
        type: Date,
        default: Date.now,
    },
    catchPhoto: String,
    latitude: {
    ...requiredNumber,
    min: -90,
    max: 90,
    },
    longitude: {
    ...requiredNumber,
    min: -180,
    max: 180,
    } ,
}, {
    timestamps: true,
});

const CatchReport = mongoose.model('CatchReport', catchReportSchema);

module.exports = CatchReport;