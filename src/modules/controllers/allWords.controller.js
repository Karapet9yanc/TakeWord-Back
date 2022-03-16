const allWordsSchema = require('../../db/models/allWords-schema/index');
const AllWordsSchema = require('../../db/models/allWords-schema/index');
const ShownWordsSchema = require('../../db/models/shownWords-schema');
const UserSchema = require('../../db/models/user-schema')

const {
    allTranslationsArray,
    allWordsArray
} = require('../../services/allWords.services');
const jwt = require('jsonwebtoken')


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
        const token  = req.headers.authorization;
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');

        let payload;

        payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
            if(!err) {
                const currentUser = await UserSchema.findById(decoded.userId)

                const lastShowedWords = currentUser.showedWords.concat([{
                    word: result[index].word,
                    translation: result[index].translation,
                    showedAt: new Date()
                }])

                // Временно поставил 10 секунд, в проде число надо будет заменить на 1000 * 60 * 60
                if(lastShowedWords[lastShowedWords.length - 1].showedAt - lastShowedWords[lastShowedWords.length - 2].showedAt > 1000 * 30){
                    UserSchema.findByIdAndUpdate(decoded.userId, {showedWords: lastShowedWords}).then(r => {

                        res.status(200).send({
                            word: result[index].word,
                            translation: result[index].translation,
                            tokenRes: decoded
                            })
                    }).catch(e => {
                        res.status(404)
                    })
                } else {
                    // res.status(200).send({
                    //     word: lastShowedWords[lastShowedWords.length - 2].word,
                    //     translation: lastShowedWords[lastShowedWords.length - 2].translation,
                    //     tokenRes: decoded
                    //     })
                    if(lastShowedWords[lastShowedWords.length - 1].showedAt - lastShowedWords[lastShowedWords.length - 2].showedAt < 1000 * 10){
                        res.status(400).json({message: '1 hour has not yet expired', delay: lastShowedWords[lastShowedWords.length - 1].showedAt - lastShowedWords[lastShowedWords.length - 2].showedAt})
                    } else {
                        res.status(400).json({message: '1 hour has not yet expired'})
                    }
                }

                    
            } else {
                res.status(500).send(err)
            }     
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


module.exports.addNewWord = async (req, res) => {
    try {
        const { word, translation } = req.body;

        const checkWord = await allWordsSchema.find({word: word})

        if(checkWord.length > 0){
            res.status(403).json({message: 'This word already exists'})
        } else {
            const newWord = new AllWordsSchema({
                word: word,
                translation: translation
            })

            await newWord.save().then(result => {
                res.status(200).json(result)
            })
        }
    } catch (e) {
        res.status(500).send({ message: 'internal server error' });
    }
}