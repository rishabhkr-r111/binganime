const express = require('express')
const app = express()
const fetch = require('node-fetch')
require('dotenv').config()

const api_host = process.env.API_HOST

app.use(express.static(__dirname + '/public'))

app.set('view engine','ejs')

app.get('/', async (req, res) => {
  const r = await fetch(`${api_host}/subbed/1`)
  const json = await r.json()
  const [pev_page, next_page] = pagination(1)

  res.render('index', {
    data : json.data,
    type : 1,
    pev_page : pev_page,
    next_page : next_page
  })
})

app.get('/subbed/:page', async (req, res) => {
  const page = parseInt(req.params.page)

  if( page <= 1){
    res.redirect('/')
    return
  }

  const r = await fetch(`${api_host}/subbed/${page}`)
  const json = await r.json()
  const [pev_page, next_page] = pagination(page)

  res.render('index', {
    data : json.data,
    type : 1,
    pev_page : pev_page,
    next_page : next_page
  })

})

app.get('/subbed', (req, res) => {
  res.redirect('/')
})

app.get('/dubbed', async (req, res) => {
  const r = await fetch(`${api_host}/dubbed/1`)
  const json = await r.json()
  const [pev_page, next_page] = pagination(1)

  res.render('index', {
    data : json.data,
    type : 2,
    pev_page : pev_page,
    next_page : next_page
  })
})

app.get('/dubbed/:page', async (req, res) => {
  const page = parseInt(req.params.page)

  if( page <= 1){
    res.redirect('/')
    return
  }

  const r = await fetch(`${api_host}/dubbed/${page}`)
  const json = await r.json()
  const [pev_page, next_page] = pagination(page)

  res.render('index', {
    data : json.data,
    type : 2,
    pev_page : pev_page,
    next_page : next_page
  })

})

app.get('/search/:keyword', async (req, res) => {
  const keyword = req.params.keyword

  const r = await fetch(`${api_host}/search/${keyword}`)
  const json = await r.json()

  res.render('search', {data : json.data})
})

app.get('/watch/:slug', async (req, res) => {
  const slug = req.params.slug

  const r = await fetch(`${api_host}/watch/${slug}`)
  const json = await r.json()

  res.render('watch',json)
})

app.get('/details/:slug', async (req, res) => {
  const slug = req.params.slug

  const r = await fetch(`${api_host}/details/${slug}`)
  const json = await r.json()

  res.render('details', json)
})

app.get('/*', async (req, res) => {
  res.send('404')
})

function pagination(page = 1) {
  current_page = parseInt(page) 
  if(current_page == 1){
    return [null, current_page + 1]
  }
  else if(current_page > 1){
    return [current_page-1, current_page+1]
  }
}

app.listen(process.env.PORT || 8080 , () => console.log('server started'))
