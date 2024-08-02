"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.removeFromCart = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const User_1 = __importDefault(require("../models/User"));
const Order_1 = __importDefault(require("../models/Order"));
const resend_1 = require("../utils/resend");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { productId, quantity } = req.body;
        let cart = yield Cart_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new Cart_1.default({ user: userId, items: [] });
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity });
        }
        yield cart.calculateTotal();
        yield cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to add item to cart', error: error.message });
    }
});
exports.addToCart = addToCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const cart = yield Cart_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
    }
});
exports.getCart = getCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { productId, quantity } = req.body;
        const cart = yield Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart' });
            return;
        }
        item.quantity = quantity;
        yield cart.calculateTotal();
        yield cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update cart item', error: error.message });
    }
});
exports.updateCartItem = updateCartItem;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { productId } = req.body;
        const cart = yield Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        yield cart.calculateTotal();
        yield cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
    }
});
exports.removeFromCart = removeFromCart;
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const shippingAddress = req.body.shippingAddress;
        if (!shippingAddress) {
            res.status(400).json({ message: 'Shipping address is required' });
            return;
        }
        const cart = yield Cart_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: 'Cart is empty' });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const order = new Order_1.default({
            user: userId,
            shippingAddress,
            products: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
        });
        yield order.save();
        yield (0, resend_1.sendCheckoutEmail)(user.email);
        // Clear the cart
        cart.items = [];
        yield cart.calculateTotal();
        yield cart.save();
        res.status(200).json({ message: 'Checkout successful', order });
    }
    catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ message: 'Checkout failed', error: error.message });
    }
});
exports.checkout = checkout;
