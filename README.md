# Country Info & Calendar API

This is a backend application built with Nest.js that provides information about countries and allows users to add public holidays to a personal calendar.

## Features

- Get a list of all available countries.
- Get detailed information for a specific country, including bordering nations, historical population data, and the national flag.
- Add national holidays for a given country and year to a user's calendar.

## Tech Stack

- **Framework**: [Nest.js](https://nestjs.com/)
- **Language**: TypeScript
- **ODM**: [Mongoose](https://mongoosejs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for running a MongoDB instance)

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone [https://github.com/your-username/country-info-app.git](https://github.com/your-username/country-info-app.git)
cd country-info-app
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Open the `.env` file and update the `MONGODB_URI` with your MongoDB connection string.

**Note**: The `.env` file is included in `.gitignore` and should never be committed to version control for security reasons.

### 3. Set Up the Database

You can use Docker to easily spin up a MongoDB instance:

```bash
docker run --name my-mongo -p 27017:27017 -d mongo
```

The application will connect to this instance, and Mongoose will create the collection automatically on the first data insertion. No migrations are needed.

### 4. Running the Application

To run the application in development mode with live-reloading:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`.

---

## 📜 API Endpoints

### Countries

#### `GET /countries`

Returns a list of all available countries supported by the Nager API.

**✅ Success Response (200 OK)**

```json
[
    { "countryCode": "AD", "name": "Andorra" },
    { "countryCode": "AL", "name": "Albania" },
    ...
]
```

#### `GET /countries/:countryCode`

Returns aggregated information for a single country.

**✅ Success Response (200 OK)** for `/countries/DE`

```json
{
  "borders": [
    { "name": "Austria", "countryCode": "AT" },
    { "name": "Belgium", "countryCode": "BE" },
    ...
  ],
  "population": [
    { "year": 2018, "value": 82927922 },
    { "year": 2017, "value": 82695000 },
    ...
  ],
  "flag": "[https://flagcdn.com/w320/de.png](https://flagcdn.com/w320/de.png)"
}
```

**❌ Error Response (404 Not Found)**

```json
{
  "message": "Country with code 'XX' not found.",
  "error": "Not Found",
  "statusCode": 404
}
```

### Calendar

#### `POST /users/:userId/calendar/holidays`

Adds national holidays of a specific country to the specified user's calendar. **Note**: `userId` is the MongoDB ObjectId string.

**Request Body**

```json
{
  "countryCode": "US",
  "year": 2025,
  "holidays": ["New Year's Day", "Independence Day"]
}
```

_The `holidays` array is optional. If omitted, all public holidays for that year will be added._

**✅ Success Response (201 Created)**

```json
{
  "message": "Holidays added successfully.",
  "savedCount": 2
}
```

**❌ Error Response (400 Bad Request)** for invalid `countryCode`

```json
{
  "message": ["countryCode must be a valid ISO31661 Alpha2 code"],
  "error": "Bad Request",
  "statusCode": 400
}
```
