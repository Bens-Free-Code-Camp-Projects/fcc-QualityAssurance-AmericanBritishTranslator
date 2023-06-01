const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    setup(string) {
        const symbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g
        let wordList = string.split(' ')
        for (let i = 0; i<wordList.length; i++){
            if(symbols.test(wordList[i][0])){
                let specialChar = ' ' + wordList[i][0]
                console.log(specialChar)
                wordList[i] = wordList[i].slice(1)
                wordList.splice(i, 0, specialChar)
                i++
            }
            if(symbols.test(wordList[i][wordList[i].length-1])){
                let specialChar = wordList[i][wordList[i].length-1]
                if(specialChar === '.' && americanToBritishTitles[wordList[i].toLowerCase()] !== undefined){
                    continue
                }
                specialChar = specialChar + ' '
                wordList[i] = wordList[i].slice(0, wordList[i].length-1)
                wordList.splice(i+1, 0, specialChar)
                i++
            }
        }
        return wordList
    }

    end(words, inputString) {
        let returnString = words.reduce(
            (finalStr, word) => {
                if(/\s$/.test(word)){
                    return finalStr.slice(0, finalStr.length - 1) + word
                }else {
                    return `${finalStr + word} `
                }
            }, ''
        )
        returnString = returnString.slice(0, 1).toUpperCase() + returnString.slice(1, returnString.length - 1)

        if(returnString === inputString){
            return 'Everything looks good to me!'
        } else {
            return returnString
        }
    }

    format(word) {
        return `<span class="highlight">${word}</span>`
    }

    testAmerican(word) {
        if(/^\d?\d:\d\d$/.test(word)){
            return this.format(word.slice(0, word.indexOf(':')) + '.' + word.slice(word.indexOf(':') + 1))
        }
        if(americanOnly[word.toLowerCase()] !== undefined){
            return this.format(americanOnly[word.toLowerCase()])
        }
        if(americanToBritishSpelling[word.toLowerCase()] !== undefined){
            return this.format(americanToBritishSpelling[word.toLowerCase()])
        }
        if(americanToBritishTitles[word.toLowerCase()] !== undefined){
            let title = americanToBritishTitles[word.toLowerCase()]
            return this.format(title.slice(0, 1).toUpperCase() + title.slice(1))
        }
        return false
    }

    testBritish(word){
        if(/^\d?\d.\d\d$/.test(word)){
            return this.format(word.slice(0, word.indexOf('.')) + ':' + word.slice(word.indexOf('.') + 1))
        }
        if(britishOnly[word.toLowerCase()] !== undefined){
            return this.format(britishOnly[word.toLowerCase()])
        }
        for (let prop in americanToBritishSpelling) {
            if(americanToBritishSpelling[prop] === word.toLowerCase()){
                return this.format(prop)
            }
        }
        for (let prop in americanToBritishTitles) {
            if(americanToBritishTitles[prop] === word.toLowerCase()){
                return this.format(prop.slice(0, 1).toUpperCase() + prop.slice(1))
            }
        }
        return false
    }

    americanToBritish(inputString){
        let words = this.setup(inputString)
        for(let i = 0; i<words.length; i++){
            if(this.testAmerican(`${words[i]} ${words[i+1]} ${words[i+2]}`) !== false){
                words[i] = this.testAmerican(`${words[i]} ${words[i+1]} ${words[i+2]}`)
                delete words[i+1]
                delete words[i+2]
                i += 2
                continue
            }
            if(this.testAmerican(`${words[i]} ${words[i+1]}`) !== false){
                words[i] = this.testAmerican(`${words[i]} ${words[i+1]}`)
                delete words[i+1]
                i++
                continue
            }
            if (this.testAmerican(words[i]) !== false){
                words[i] = this.testAmerican(words[i])
            }
        }
        return this.end(words, inputString)
    }

    britishToAmerican(inputString){
        let words = this.setup(inputString)
        for(let i = 0; i<words.length; i++){
            if(this.testBritish(`${words[i]} ${words[i+1]} ${words[i+2]}`) !== false){
                words[i] = this.testBritish(`${words[i]} ${words[i+1]} ${words[i+2]}`)
                delete words[i+1]
                delete words[i+2]
                i += 2
                continue
            }
            if(this.testBritish(`${words[i]} ${words[i+1]}`) !== false){
                words[i] = this.testBritish(`${words[i]} ${words[i+1]}`)
                delete words[i+1]
                i++
                continue
            }
            if (this.testBritish(words[i]) !== false){
                words[i] = this.testBritish(words[i])
            }
        }
        return this.end(words, inputString)
    }
}

module.exports = Translator;