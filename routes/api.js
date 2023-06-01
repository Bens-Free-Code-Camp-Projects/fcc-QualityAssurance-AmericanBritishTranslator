'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      if(req.body.locale === undefined || req.body.text === undefined){
        res.json({ error: 'Required field(s) missing' })
        return
      }
      if(req.body.text === ''){
        res.json({ error: 'No text to translate' })
        return
      }
      if(req.body.locale !== 'american-to-british' && req.body.locale !== 'british-to-american'){
        res.json({ error: 'Invalid value for locale field' })
        return
      }

      if(req.body.locale === 'american-to-british'){
        let translation = translator.americanToBritish(req.body.text)
        res.send({ text: req.body.text, translation: translation})
      }
      if(req.body.locale === 'british-to-american'){
        let translation = translator.britishToAmerican(req.body.text)
        res.send({ text: req.body.text, translation: translation})
      }
    });
};
