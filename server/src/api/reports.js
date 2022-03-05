const { Router } = require('express');
const CatchReport = require('../models/CatchReport');
const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const entries = await CatchReport.find();
        entries.forEach(entry => console.log(entry._id));
        console.log(entries._id);
        res.json(entries);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const reportEntry = new CatchReport(req.body);
        const createdEntry = await reportEntry.save();
        console.log(createdEntry);
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






module.exports = router;
