const AllWordsSchema = require('../../db/models/allWords-schema/index');
const ShownWordsSchema = require('../../db/models/shownWords-schema')
const {
    allTranslationsArray,
    allWordsArray
} = require('../../services/allWords.services');

module.exports.postAllWordsToDb = async (req, res) => {
    try {
        const saveAllWords = (words, translates) => {
            return Promise.all(words.map(async (word, index) => {
                const newWord = new AllWordsSchema({
                    word,
                    translation: translates[index]
                })

                await newWord.save()
            }))
        }

        await saveAllWords(allWordsArray, allTranslationsArray)
            .then(() => {
                res.status(200).json({ message: 'all words are succesfully added to DB' })
            });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports.getRandomWord = async (req, res) => {
    try {
        const result = await AllWordsSchema.find();
        const index = Math.floor(Math.random() * result.length);

        res.status(200).send({
            word: result[index].word,
            translation: result[index].translation,
        });
    } catch (e) {
        res.status(500).send({ message: '22' });
    }
}

module.exports.handleStudiedWord = async (req, res) => {
    try {
        const { reqWord, reqTransl } = req.body;

        if (!reqWord || !reqTransl) {
            return res.status(400).send('Data is incorrect!');
        }

        const result = await AllWordsSchema.find();
        const allWords = result[0];

        const words = allWords.words.filter(w => w !== reqWord);
        const translations = allWords.translations.filter(t => t !== reqTransl);

        if ((words.length === allWords.words.length)
            || translations.length === allWords.translations.length) {
            return res.status(500).send({ message: 'the word or the translation is not found' });
        }

        await AllWordsSchema.findOneAndUpdate({ result }, {
            words,
            translations
        }, {
            new: true
        }).catch((e) => {
            res.status(500).send({ message: e.message });
        })

        const shownWords = new ShownWordsSchema({
            word: reqWord,
            translation: reqTransl,
        });

        shownWords.save()
            .then(() => {
                res.status(400).send('Success');
            })
    } catch (e) {
        res.status(500).send({ message: 'internal server error' });
    }
}