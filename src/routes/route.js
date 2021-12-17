const express = require('express');
const router = express.Router();

const urlController = require("../controllers/urlController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const midware = require("../Middleware/midware")

router.get('/test-me', function (req, res) {
    res.send('Testing - My first ever api!')
});
// -----------------------------------PROJECT4 ROUTES------------------------------------------------------------
router.post('/register',urlController.createUser);
router.post('/login', urlController.login)

//*book apis-->
router.post('/books', bookController.createBook)
router.get('/books', bookController.getbooks)
// router.get('/books/:bookId', bookController.getBookWithReview)
// router.get('/books/:bookId', bookController.deletebookbyID)
// router.get('/books/:bookId', bookController.update)

// //*review--->
// router.post('/books/:bookId/review', midware.Auth, bookController.bookreview)
// router.delete('/books/:bookId/review/:reviewId',midware.Auth, reviewController.updateReviews)
// router.delete('/books/:bookId/review/:reviewId',midware.Auth, reviewController.DeleteReview)



module.exports = router;
