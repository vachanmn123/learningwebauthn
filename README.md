# LearningWebAuthn

This repository has the code to implement a basic webauthn (Passkeys) authentication system using nextjs and mongoDB. 

## Running the project

### Install dependencies

```bash
npm install
```

### Create a .env file

```bash
touch .env.local
```

### Add the following variables to the .env file

```bash
MONGO_URI=<your-mongodb-uri>
COOKIE_SECRET=<your-cookie-secret-with-32+-characters>
```

### Run the project

```bash
npm run dev
```

## Contributing

Please feel free to contribute to the repository via pull requests!