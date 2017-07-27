const express = require('express')
const app = express()

// create the logic that will run in our middleware
const logger = (req, res, next) => {
  console.log("Page was hit at "  + new Date())
  next()
}

// modify the request object during the pipeline
const requestTime = (req, res, next) => {
  req.timeRequested = new Date()
  next()
}

// This middleware checks to see if the user
// provided the secret. If they did, proceed with
// the rest of processing, otherwise, just send them
// a warning
const authenticate = (req, res, next) => {
  // Works but is *bad* practice
  // (req.query.secret === "fooberries") ? next() : res.send('Sorry, you do not know the secret')

  //                 id will show up in req.params.id
  //     /info/:id

  //                  secret will show up in req.query.secret
  //     /info?password="fooberries"

  if (req.query.password === "fooberries") {
    next()
  } else {
    res.send('Sorry, you do not know the secret')
  }
}

// register (not run) the middlware to the pipeline
app.use(logger)
app.use(requestTime)

// define a home page
app.get("/", (req, res) => {
  console.log("home page was here!")
  res.send("Hello world, you are here at " + req.timeRequested)
});

// Everything below here will need the secret
app.use(authenticate)
app.get("/foo", (req, res) => {
  console.log("hitting the food page")
  res.send("Lets get some foo(d)")
})

app.get("/bar", (req, res) => {
  console.log("hitting the drinks page")
  res.send("Lets get some drinks")
})


app.listen(3000, () => {
  console.log("Magic is happening on port 3000")
});
