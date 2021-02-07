const { Router } = require('express');

const ReportEntry = require('../models/CatchReport')

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const entries = await ReportEntry.find();
        res.json(entries);
    } catch (error) {
        next(error);
    }
  
});

router.post('/', async (req, res, next) => {
    try {
        const reportEntry = new ReportEntry(req.body);
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



module.exports = router;
