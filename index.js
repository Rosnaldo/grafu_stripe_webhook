require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')('')
const axios = require('axios')

const secret = process.env.SECRET

const port = 3001

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))

app.use(cors())

app.post('/webhooks', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature']

    const event = stripe.webhooks.constructEvent(req.rawBody, signature, secret)
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const email = event.data.object.charges.data[0].billing_details.email

        await axios.put(
          'https://grafu-back.herokuapp.com/v1/participant/confirmed',
          {
            playdayId: '6618fa37-5de2-49cb-9d72-e828da3eab1e',
            email,
          }
        )
        
        console.log(`PaymentIntent was successful for ${email}!`)
        break
      }
      default:
        return res.status(400).end()
      }
      
      return res.status(200).json({received: true})
  }
  catch (err) {
    console.log(err.message)
    return res.status(500).send(`Webhook Error: ${err.message}`)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
