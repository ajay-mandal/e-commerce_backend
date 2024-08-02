"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    }
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);
exports.default = Order;
