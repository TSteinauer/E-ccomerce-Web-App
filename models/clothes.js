const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clothesSchema = new Schema({
    img: {type: String, required:[true, "image is required"]},
    name: {type: String, required: [true, "name is required"]},
    price: {type: String, required:[true, "price is required"]},
    description:{type: String, required:[true, "Description is required"], 
                minLength: [10,'the description should have at least 10 chars']},
    condition: {type: String, required:[true, "condition is required"]},
    stock: {type: String, required:[true, "stock is required"]},//active
    seller: {type: String, required:[true, "seller is required"]},
    

},
{timestamps:true}
);

module.exports = mongoose.model('Clothe', clothesSchema);



