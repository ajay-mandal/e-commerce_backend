"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.get('/', productController_1.getAllProducts);
router.get('/:id', productController_1.getProductById);
// Super admin routes
router.post('/', auth_1.auth, role_1.isSuperAdmin, productController_1.createProduct);
router.put('/:id', auth_1.auth, role_1.isSuperAdmin, productController_1.updateProduct);
router.delete('/:id', auth_1.auth, role_1.isSuperAdmin, productController_1.deleteProduct);
exports.default = router;
