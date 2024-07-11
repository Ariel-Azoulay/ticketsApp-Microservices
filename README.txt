Tickets Application - A Microservices Project

This project utilizes modern technologies to build a ticketing system with a microservices architecture.
Frontend: React Backend: Node.js Containerization: Docker Orchestration: Kubernetes Messaging: NATS Streaming Database: MongoDB Payment Processing: Stripe

Prerequisites
Before you begin, ensure you have the following installed:
* Node.js and npm (Node Package Manager)
* Docker
* Kubernetes
* Skaffold
* MongoDB
* NATS Streaming Server
* Stripe (for payment processing)
Installation

1. Clone the Repository
Bash
git clone https://github.com/Ariel-Azoulay/ticketsApp.git
cd ticketsApp

2. Install Dependencies
Each microservice has its own directory. Navigate to each directory and run npm install to install dependencies. Refer to the specific microservice directory for instructions if needed.

3. Set Up Environment Variables
a. Create Kubernetes Secrets
Create a secret for Stripe public and secret keys:

Bash
kubectl create secret generic stripe-secret --from-literal=STRIPE_PUBLIC_KEY=your_stripe_public_key --from-literal=STRIPE_SECRET_KEY=your_stripe_secret_key

Verify the secret creation:
Bash
kubectl get secret stripe-secret -o yaml

Create similar secrets for other necessary environment variables like JWT keys and NATS configuration.
b. Reference Secrets in Deployment Files
Modify your Kubernetes deployment files to reference these secrets. Here's an example for the payments service deployment:

YAML
apiVersion: apps/v1
kind: Deployment
metadata:
 name: payments-depl
spec:
 replicas: 1
 selector:
   matchLabels:
     app: payments
 template:
   metadata:
     labels:
       app: payments
   spec:
     containers:
       - name: payments
         image: ImageName/payments
         env:
           - name: STRIPE_PUBLIC_KEY
             valueFrom:
               secretKeyRef:
                 name: stripe-secret
                 key: STRIPE_PUBLIC_KEY
           - name: STRIPE_SECRET_KEY
             valueFrom:
               secretKeyRef:
                 name: stripe-secret
                 key: STRIPE_SECRET_KEY
           # ... other environment variables

4. Running the Project
a. Start Kubernetes Cluster
Ensure your Kubernetes cluster is running. You can use Minikube or Docker Desktop.


Bash
minikube start
b. Deploy NATS Streaming Server and MongoDB
Apply the Kubernetes configuration files for NATS and MongoDB:


Bash
kubectl apply -f infra/k8s/nats-depl.yaml
kubectl apply -f infra/k8s/mongo-depl.yaml

c. Deploy Microservices
Use Skaffold to build and deploy the microservices:


Bash
skaffold dev

d. Set Up Ingress-NGINX
Apply the Ingress-NGINX configuration:
Bash
kubectl apply -f infra/k8s/ingress-srv.yaml

e. Update /etc/hosts file
Add the following entry to your /etc/hosts file:
127.0.0.1 ticketing.dev

5. Running Tests
Each microservice has its own tests. Navigate to the microservice directory and run the tests using npm:


Bash
cd auth
npm run test

Project Structure
The project consists of the following microservices:
* auth: Authentication microservice
* tickets: Ticket management microservice
* orders: Order management microservice
* payments: Payment processing microservice
* expiration: Expiration handling microservice