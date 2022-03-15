const express = require('express');
const router = express.Router();
const {verifyAccessToken} = require('../middlewares/verifyAccessToken.middleware')
const {
    handleStudiedWord,
    postAllWordsToDb,
    getRandomWord,
    addNewWord
} = require('../controllers/allWords.controller');

const {
    createNewUser,
    login,
    auth
} = require('../controllers/user.controller')

// words routes

router.get('/getRandomWord', getRandomWord);
router.post('/postAllWordsToDb', postAllWordsToDb);
router.patch('/handleStudiedWord', handleStudiedWord);
router.post('/addNewWord', addNewWord)

// users routes

router.post('/register', createNewUser);

router.post('/login', login)

router.post('/auth', verifyAccessToken, auth)


module.exports = router;