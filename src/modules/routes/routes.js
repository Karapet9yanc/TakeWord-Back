const express = require('express');
const router = express.Router();

const {
    handleStudiedWord,
    postAllWordsToDb,
    getRandomWord
} = require('../controllers/allWords.controller');

router.get('/getRandomWord', getRandomWord);
router.post('/postAllWordsToDb', postAllWordsToDb);
router.patch('/handleStudiedWord', handleStudiedWord);

module.exports = router;