const moment = require('moment');

const Property = require('../models/property');

exports.getProperties = async (req, res) => {
    const days30 = moment().subtract(1, 'month');
    const query = {
        dtRegister: { $gte: days30 }
    };
    await Property.find(query)
    .then(docs => {
        return res.status(200).json(docs);
    })
    .catch(err => {
        return res.status(500).json({
            msg: "Error",
            err: err
        });
    });
}