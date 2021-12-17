let BookModel = require('../models/BookModel')
let UserModel = require('../models/userModel')
let mongoose = require('mongoose')

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

const createBook = async function (req, res) {
    try {
        let requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            res
                .status(400)
                .send({ status: false, message: "Requested body is empty!" });
                return
        }

        let { title, excerpt, userId, ISBN, category, subcategory, reviews } =
            requestBody;

        if (!isValid(title)) {
            res
                .status(400)
                .send({ status: false, message: "Please! enter valid title" });
                return
        }

        if (!isValid(excerpt)) {
            res
                .status(400)
                .send({ status: false, message: "Please! enter valid excerpt" });
                return
        }

        if (!isValid(userId)) {
            res
                .status(400)
                .send({ status: false, message: "Please! enter valid user ID" });
        }

        if (!isValidObjectId(userId)) {
            res
                .status(400)
                .send({ status: false, message: "userId type is not correct" });
        }
        

        if (!isValid(ISBN)) {
            res
                .status(400)
                .send({ status: false, message: "Please! enter valid ISBN" });
        }

        if (!isValid(category)) {
            res
                .status(400)
                .send({ status: false, message: "Please! enter valid category" });
        }

        if (!isValid(subcategory)) {
            res
                .status(400)
                .send({ status: false, message: "Please! enter valid subcategory" });
        }

        let findISBN = await BookModel.findOne({ ISBN });
        if (findISBN) {
            res.status(403).send({
                status: false,
                message: ` book with this ${ISBN} ISBN already exist`,
            });
        }
        let findTitle = await BookModel.findOne({ title });
        if (findTitle) {
            res
                .status(403)
                .send({ status: false, message: `${title} already exist` });
        }
        let findUser = await UserModel.findOne({ _id: userId });

        if (!findUser) {
            res
                .status(404)
                .send({ status: false, message: "user not found. check userID!" });
                return
        }

        const bookData = {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            reviews,
        };
        let newBook = await BookModel.create(bookData);
        res.status(200).send({
            status: false,
            message: "book create successfully",
            data: newBook,
        });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
// --------------------------------------------------4th API (GET/books)----------------------------------------

const getbooks = async function (req, res) {
    try {
        
        let filterDel = { isDeleted: false, deletedAt: null };
        let queryPara = req.query;


        if (isValidRequestBody(queryPara)) {
            const { userId, excerpt, category, subcategory, releasedAt } = queryPara;

            if (isValid(userId) && isValidObjectId(userId)) {
                filterDel["userId"] = userId;
            }

            if (isValid(category)) {
                filterDel["category"] = category.trim();
            }

            if (isValid(subcategory)) {
                filterDel["subcategory"] = subcategory.trim();
            }

            
            let findBooks = await BookModel.find(filterDel).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, releasedAt: 1, reviews: 1 });
            // console.log(findBooks)
            console.log(filterDel)
            if (Array.isArray(findBooks) && findBooks.length === 0) {
                res.status(400).send({ status: false, message: "No Books Found" });
                return
            }

            let sortedByBookName = findBooks.sort((a, b) => a.title > b.title && 1 || -1)

            res
                .status(200)
                .send({
                    status: true,
                    message: "is this the book your looking for?",
                    data: sortedByBookName,
                });
                return
        }

        let findNotDel = await BookModel.find({isDeleted: false, deletedAt: null})

        if(findNotDel){
            res.status(200).send({status: true, data: findNotDel})
            return
        }

    } catch (err) {

        return res.status(500).send({ msg: err.message })
    }
}
// ---------------------------------------------get/books/:bookId/------------------------------------------------------

const getBookWithReview = async function (req, res) {
    try {

        const bookId = req.params.bookId

        if (!isValid(bookId)) {
            res.status(400).send({ status: false, msg: `Invalid request. No request passed in the query` })
            return
        }

        let bookDetail = await BookModel.findOne({ _id: bookId })
        //console.log( bookDetail )

        let reviewsData = await ReviewModel.find({ bookId: bookDetail }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, reviews: 1 })
        console.log(reviewsData)
        if (reviewsData.length == 0) {
            res.status(204).send({ status: true, message: ` reviewsData not find` })
            return
        }

        let data = {
            bookDetail: bookDetail,
            reviewsData: reviewsData

        }

        res.status(200).send({ status: true, message: `bookList`, data: data })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}



const update = async function (req, res) {
    try {
        // const params = req.params

        let bookUser = await BookModel.findOne({ _id: req.params.bookId })
        //console.log(bookUser)
        if (bookUser.isDeleted === false) {

            let newdata = await BookModel.findOneAndUpdate({ _id: bookUser._id }, {
                "title": req.body.title, "excerpt": req.body.excerpt,
                "ISBN": req.body.ISBN, "releasedAt": Date.now()
            }, { new: true })

            console.log(newdata)

            res.status(200).send({ status: true, data: newdata })
        } else {
            res.status(404).send({ err: "the data is already deleted " })
        }

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




const deletebookbyID = async function (req, res) {
    try {
        const params = req.params
        const bookId = params.bookId

        if (!isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid bookId` })
            return
        }


        const blog = await BookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null })

        if (!blog) {
            res.status(404).send({ status: false, message: `Blog not found` })
            return
        }


        await BookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })
        res.status(200).send({ status: true, message: `bookId deleted successfully` })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = { createBook, getbooks, getBookWithReview, deletebookbyID, update }