let mongoose = ('mongoose')
let BookModel = ('../models/BookModel')
let ReviewModel = ('../models/ReviewModel')

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};


const bookreview = async function (req, res) {
    try {

        const requestBody = req.body
        const bookId = req.params.bookId

        const book = await BookModel.findById({ _id: bookId, isDeleted: false })

        if (!book) {
            res.status(404).send({ status: false, message: 'book not found' })
            return
        }

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'request body is not found' })
        }

        //extract params
        const { reviewedBy, reviews, rating, isDeleted } = requestBody

        if (!isValid(rating)) {
            res.status(400).send({ status: false, message: 'rating required' })
            return
        }

        if (!((rating > 0) && (rating < 6))) {
            res.status(400).send({ status: false, message: 'rating is required' })
            return
        }
        //validation end

        const ReviewData = { reviewedBy, reviews, rating, isDeleted, bookId }

        let savedReview = await ReviewModel.create(ReviewData)
        await BookModel.findOneAndUpdate({ _id: bookId }, { $inc: { "reviews": 1 } }, { new: true })
        res.status(200).send({ status: true, message: 'Review created succesfully', data: savedReview })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}

//*update reviews---------->
const updateReviews = async function (req, res) {
    try {
        let reqBody = req.body;
        let reqParam = req.params;
        let reviewId = reqParam.reviewId;
        let bookId = reqParam.bookId;

        if (!isValidObjectId(bookId)) {
            res
                .status(400)
                .send({ status: false, message: `${blogId} is not a valid book id` });
            return;
        }

        if (!isValidObjectId(reviewId)) {
            res
                .status(400)
                .send({
                    status: false,
                    message: `${reviewId} is not a valid review id`,
                });
            return;
        }

        const findBooks = await BookModel.findOne({
            _id: bookId,
            isdeleted: false,
            deletedAt: null,
        });
        const findReviews = await reviewModel.findOne({
            _id: reviewId,
            isDeleted: false,
        });

        if (!findBooks) {
            res.status(404).send({ status: false, message: "no books found" });
            return;
        }

        if (!findReviews) {
            res.status(404).send({ status: false, message: "no reviews found" });
            return;
        }

        const { reviews, rating, reviewedBy } = reqBody;

        if (!isValid(reviews)) {
            res
                .status(400)
                .send({ status: false, message: "please! enter valid reviews" });
            return;
        }

        if (!isValid(rating)) {
            res
                .status(400)
                .send({ status: false, message: "please! enter valid rating" });
            return;
        }

        if (!(rating > 0 && rating < 6)) {
            res.status(400).send({ status: false, message: "rating must be 1 to 5" });
            return;
        }

        if (!isValid(reviewedBy)) {
            res
                .status(400)
                .send({ status: false, message: "please enter valid user name" });
            return;
        }

        if (!isValidRequestBody(reqBody)) {
            res
                .status(200)
                .send({
                    status: true,
                    message: "No paramateres passed. Blog unmodified",
                    data: blog,
                });
            return;
        }

        let updateData = {
            reviews,
            rating,
            reviewedBy,
        };

        let getUpdateReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId },
            { reviews: reviews, rating: rating, reviewedBy: reviewedBy },
            { new: true }
        );
        res
            .status(200)
            .send({
                status: true,
                message: "review successfully Updated",
                data: getUpdateReview,
            });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};
// ---------------------------------------------DELETE /books/:bookId/review/:reviewId---------------------------
const DeleteReview = async function (req, res) {
    try {
        if (req.userId._id == uid)
            var bookparam = req.params.bookId
        let reviewparam = req.params.reviewId
        let FindReview = await ReviewModel.findOne({ _id: reviewparam })
        let FindBook = await BookModel.findOne({ _id: bookparam })
        if (!FindBook) {
            res.status(404).send({ status: false, msg: "No book found with this Id" })
        }
        if (!FindReview) {
            res.status(404).send({ status: false, msg: "No review found with this Id" })
        }
        let DelReview = await ReviewModel.findOneAndUpdate({ _id: reviewparam }, { isDeleted: true }, { new: true })
        console.log(DelReview)
        // let DeductReviews = await BookModel.findOneAndUpdate({_id: bookparam}, {reviews: reviews -1}, {new: true})
        // console.log(DeductReviews)
        res.status(200).send({ status: true, msg: "success", data: DelReview })



    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

module.exports = { DeleteReview, updateReviews, bookreview }
