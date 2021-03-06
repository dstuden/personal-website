const express = require("express")

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('./dist'))

app.get('*', (req, res) => {
    res.status(404).send("404 - Not Found!")
})

app.get('/', (req, res ) => {
    res.sendFile('./dist/index.html')
})

app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
})