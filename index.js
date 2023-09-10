const PORT = 8000
const cheerio = require('cheerio')
const axios = require('axios')
const express = require('express')

const app = express()
const articles = []
const newspapers = [
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/uk/business',
        base: 'https://www.theguardian.com'
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/business',
        base: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/business',
        base: 'https://www.bbc.co.uk'
    }
]

newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
    .then(function(response) {
        //handle success
        const post = response.data
        const $ = cheerio.load(post)

        $('a:contains("business")', post).each(function() {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
             })
        })
        res.send(articles)
    }).catch((err) => console.log(err))
})

app.get('/news/:newsPaperId', async(req, res) => {

    const newsPaperId = req.params.newsPaperId
    const newsPaperAddress = newspapers.filter(newspaper => newspaper.name === newsPaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newsPaperId)[0].base

    axios.get(newsPaperAddress)
    .then(function (response) {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("business")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newsPaperId
            })
        })
        res.json(specificArticles)
    }).catch((err) => console.log(err))

})

app.get('/', function (req, res) {
    res.send("Welcome to my business api.")
})
app.get('/news', function(req, res) {
    res.json(articles)
})

//what port server is on
app.listen(PORT, () => console.log('server running on port ' + PORT))