# Grafu-Stripe-Webhook

Grafu webhook to capture and handle Stripe payment events. 

## Stripe test webhook localhost

```
firebase emulators:start

stripe listen --forward-to http://localhost:5001/grafu-357616/us-central1/webhooks

stripe trigger payment_intent.succeeded
```

## Expose localhost to cloud url
```
ngrok http 5001
```

## Deploy
```
firebase deploy --only functions
```
