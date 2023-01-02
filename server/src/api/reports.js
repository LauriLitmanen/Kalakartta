const { Router } = require('express');
const CatchReport = require('../models/CatchReport');
const router = Router();
const aws = require('../aws-s3');

router.get('/s3Url', async (req, res, next) => {
    try {
        const url = await aws.generateUploadURL();
        res.send({url});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const entries = await CatchReport.find();
        entries.forEach(entry => console.log(entry._id));
        res.json(entries);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const reportEntry = new CatchReport(req.body);
        const createdEntry = await reportEntry.save();
        res.json(createdEntry);
    } catch (error) {
        console.log(error.constructor.name);
        if (error.name === 'ValidationError'){
            res.status(422);
        }
        next(error);
    }
});

// Deletes report entry and returns list of remaining report entries
router.delete('/', async (req, res, next) => {
    try {
        const id = req.body.id;
        await CatchReport.deleteOne({ _id: id });
        const entries = await CatchReport.find();
        res.json(entries);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/report/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const entry = await CatchReport.findById(id);
        res.json(entry);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.put('/updateReport/:id', async (req, res, next) => {
    try {
        const filter = { _id: req.params.id };
        const updatedEntry = await CatchReport.update(filter, req.body);
        res.json(updatedEntry);
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError'){
            res.status(422);
        }
        next(error);
    }
});






module.exports = router;
