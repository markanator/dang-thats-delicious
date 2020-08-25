const express = require('express');
const router = express.Router();
// custom controllers
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');

// STORES STUFF
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

router.get('/add', authController.isLoggedin, storeController.addStore);

router.post(
    '/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.post(
    '/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));
// Stores - Tags
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

// USER STUFF
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post(
    '/register',
    userController.validateRegister,
    userController.register,
    authController.login
);
// logout
router.get('/logout', authController.logout);
// account stuff
router.get('/account', authController.isLoggedin, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post(
    '/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
);
router.get('/hearts', catchErrors(storeController.getHearts));

// REVIEWS
router.post(
    '/reviews/:id',
    authController.isLoggedin,
    catchErrors(reviewController.addReview)
);

// MAP
router.get('/map', storeController.mapPage);

// API
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post(
    '/api/stores/:id/heart',
    authController.isLoggedin,
    catchErrors(storeController.heartStore)
);

module.exports = router;
