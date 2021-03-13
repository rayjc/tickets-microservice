# [TicketPro](www.ticketpro-app.com/)

### Overview
TicketPro is a full stack web application for selling and purchasing tickets. It is meant to be a clone of Ticketmaster to practice and showcase my skills in event-driven mircroservice architecture. ~~It is deployed as a Kubernetes cluster via Digital Ocean and it lives [here](www.ticketpro-app.com/)!~~

### Features
- Event-driver microservice with optimistic concurrency control
- Buy/sell tickets
- Reserve and lock tickets before payment via a worker service
- Order history

### Typical Use
- Log in/register from Home page
- Buy/sell tickets
- Try out a test purchase
- Browse order history

### Technology
- Language - TypeScript, JavaScript  
- Backend - Node, Express, MongoDB, NATS streaming
- Frontend - React, Next
- Development/Deployment - Docker, Kubernetes

### Testing
I have included tests in every service and can be executed with `npm test` from each top-level directory.

### Deployment
Any pull requests to the main branch will trigger automated tests and deployment to production cluster via Github workflow.

### Development Notes
- Requires [Docker](https://www.docker.com/products/docker-desktop) and [Skaffold](https://skaffold.dev/)
- Set up secrets in Kubernetes
    - stripe-secret: test API key from stripe
    - jwt-secret: a private key for JSON web token
- Set up NEXT_PUBLIC_STRIPE_PUBLISH_KEY environment varialbe to hold stripe publish key
- With correct Docker and Kubernetes settings, you should be able to run `skaffold dev` to boot up every services

### Third Party API
- [Stripe](https://stripe.com)
