const model = require('../models/clothes');
const multer = require('multer');
const mongoose = require('mongoose');
// Configure multer for file uploads
const upload = multer({ dest: './public/images' }).single('img');

// GET /clothes: send all clothes to the client
exports.index = async (req, res, next) => {
    try {
        const clothes = await model.find();
        // Sort clothes by price
        clothes.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
        res.render('./clothes/items', { clothes, cssFile: 'browse' });
    } catch (err) {
        next(err);
    }
};

// GET /clothes/new: form for making new clothes
exports.new = (req, res) => {
    res.render('./clothes/newitem', { cssFile: 'sell' });
};

// POST /clothes: creating new clothes and adding to the database
exports.create = (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            let error = new Error("Error uploading file.");
            error.status = 400; 
            return next(error); 
        }

        try {
            let item = req.body;
            if (req.file) {
                item.img = `/images/${req.file.filename}`; 
            }

            
            await model.create({ ...item, createdAt: new Date() });
            res.redirect('/clothes');  
        } catch (error) {
            // Check if the error is a Mongoose validation error
            if (error instanceof mongoose.Error.ValidationError) {
                error.status = 400; // Set status to 400 for validation errors
            }
            next(error);
        }
    });
};
// GET /clothes/:id: get clothes on URL param id

exports.show = async (req, res, next) => {
    const id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid Story id');
        err.status = 400;
        return next(err)
    }
    try {
        
        const item = await model.findById(id);
        if (item) {
            res.render('./clothes/item', { item, cssFile: 'item' });
        } else {
            let err = new Error('Cannot find a clothing item with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        next(error);
    }
};

// GET /clothes/search: search for items by title or details
exports.search = async (req, res, next) => {
    const find = req.query.query.toLowerCase(); 
    try {
        const clothes = await model.find();
        const filteredClothes = clothes.filter(item => 
            item.name.toLowerCase().includes(find) || 
            item.description.toLowerCase().includes(find)
        );
        if (filteredClothes.length > 0) {
            res.render('./clothes/items', { clothes: filteredClothes, cssFile: 'browse' });
        } else {
            let err = new Error('No item found');
            err.status = 404;
            next(err);
        }
    } catch (error) {
        next(error);
    }
};

// GET /clothes/:id/edit: send HTML form for editing an existing item
exports.edit = async (req, res, next) => {
    const id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid Story id');
        err.status = 400;
        return next(err)
    }
    try {
        const item = await model.findById(id);
        if (item) {
            res.render('./clothes/edit', { item, cssFile: 'sell' });
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        next(error);
    }
};

// PUT /clothes/:id: update a clothing item
exports.update = (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(404).send("Error uploading file.");
        }
        
        const id = req.params.id; 
        let item = req.body; 

        if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid Story id');
        err.status = 400;
        return next(err)
        }

        if (req.file) {
            item.img = `/images/${req.file.filename}`; 
        }

        try {
            await model.findByIdAndUpdate(id, item);
            res.redirect('/clothes/' + id); 
        } catch (error) {
            next(error);
        }
    });
};

// DELETE /clothes/:id: delete clothes identified by id
exports.delete = async (req, res, next) => {
    const id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid Story id');
        err.status = 400;
        return next(err)
    }
    try {
        const deletedItem = await model.findByIdAndDelete(id);
        if (deletedItem) {
            res.redirect('/clothes');
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        next(error);
    }
};
