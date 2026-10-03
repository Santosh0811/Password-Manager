# 🔐 Password Manager — MERN Stack

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/ODM-Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN-blue?style=flat-square" alt="MERN Stack">
  <img src="https://img.shields.io/badge/Authentication-OTP%20%26%20Verification-orange?style=flat-square" alt="OTP and Verification">
  <img src="https://img.shields.io/badge/Password%20Management-Credentials%20Storage-purple?style=flat-square" alt="Password Management">
</p>

<p align="center">
  <strong>🔐 Credential Management • 👤 User Accounts • 🗄️ MongoDB • 🛡️ Admin Management</strong>
</p>

---

## 📌 Project Overview

This project is a **MERN-stack password manager** designed to allow users to maintain their website credentials from a centralized application.

The application uses:

- **React** for the frontend
- **Node.js** for the backend runtime
- **Express.js** for REST APIs
- **MongoDB** for data storage
- **Mongoose** for MongoDB schema and model management
- **UUID** for generating unique user IDs

The password manager maintains user account information and multiple website credentials associated with each user.

> **Note:** This README documents the functionality and data structures demonstrated by the provided backend schemas and admin routes. Frontend-specific functionality and other application flows depend on the implementation of the project.

---

# ✨ Features

## 👤 User Management

The user account model contains:

- Unique user ID
- Username
- Email
- Password
- OTP
- OTP expiration information
- Account verification status
- Created and updated timestamps

```text
User
├── userId
├── userName
├── email
├── password
├── otp
├── otpExpireAt
├── verified
├── createdAt
└── updatedAt
```

## 🔑 Password Management

Each user can have multiple saved website credentials.

```text
Passkey
├── site
├── username
└── password
```

A user's saved credentials are associated through `userId`.

---

# 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| UUID | Unique user ID generation |

---

# 🏗️ Application Architecture

```text
                 Password Manager
                       │
                       ▼
                React Frontend
                       │
                       │ HTTP / REST API
                       ▼
              Node.js + Express.js
                       │
                       ▼
                   Mongoose
                       │
                       ▼
                    MongoDB
```

The frontend communicates with the Express backend through APIs, while Mongoose manages MongoDB models and documents.

---

# 🗃️ Database Architecture

The provided implementation contains two main MongoDB models:

```text
MongoDB
│
├── Signup
│   ├── User account information
│   ├── Authentication information
│   ├── OTP information
│   └── Verification status
│
└── Passkeys
    ├── User information
    └── Saved website credentials
```

---

# 👤 Signup Schema

The `Signup` model represents user accounts.

```javascript
const signup = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4
    },

    userName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        default: null
    },

    otpExpireAt: {
        type: String,
        default: null
    },

    verified: {
        type: Boolean,
        default: false,
        required: true
    },

}, { timestamps: true });
```

### Fields

| Field | Type | Description |
|---|---|---|
| `userId` | String | Unique user identifier generated using UUID |
| `userName` | String | User's name |
| `email` | String | User email address |
| `password` | String | User account password |
| `otp` | String | OTP associated with verification/authentication |
| `otpExpireAt` | String | OTP expiration information |
| `verified` | Boolean | User verification status |
| `createdAt` | Date | Automatically generated creation timestamp |
| `updatedAt` | Date | Automatically generated update timestamp |

The email field is configured as unique.

---

# 🔑 Passkey Schema

The `Passkeys` model stores website credentials associated with a user.

```javascript
const passkey = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    passKeys: [
        {
            site: {
                type: String,
                required: true,
                trim: true
            },

            username: {
                type: String,
                required: true,
                trim: true
            },

            password: {
                type: String,
                default: ""
            }
        }
    ]

}, { timestamps: true });
```

### Fields

| Field | Type | Description |
|---|---|---|
| `userId` | String | Identifier of the credential owner |
| `userName` | String | Associated username |
| `email` | String | Associated email |
| `passKeys` | Array | Collection of saved credentials |
| `passKeys.site` | String | Website/service name |
| `passKeys.username` | String | Website username |
| `passKeys.password` | String | Stored website password |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

---

# 🔗 User and Passkey Relationship

The two models are associated using `userId`.

```text
Signup
│
├── userId
├── userName
└── email
       │
       │ userId
       ▼
Passkeys
│
└── passKeys[]
    ├── site
    ├── username
    └── password
```

This structure allows multiple website credentials to belong to one user.

---

# 🛡️ Admin Management

The provided implementation includes an administrator router protected by:

```javascript
adminAuth
```

The admin functionality covers:

- Viewing password-manager users
- Viewing a user's saved passkeys
- Deleting a user
- Deleting all passkeys associated with a user
- Deleting an individual passkey

The exact authentication mechanism inside `adminAuth` is not included in the provided code.

---

# 👥 Admin User APIs

## Get Users

```text
GET /passkeyUserData
```

The implementation retrieves users while excluding the account password:

```javascript
const users = await Signup.find().select("-password");
```

A successful response contains:

```text
success
data
message
```

---

## Delete User

```text
DELETE /passkeyUserDelete/:userId
```

The implementation:

1. Deletes passkey records for the specified user.
2. Deletes the corresponding user account.
3. Returns a success response when the records are removed.

Conceptually:

```text
Admin
  │
  ▼
User ID
  │
  ├── Delete user's Passkeys
  │
  └── Delete user's Signup record
```

---

# 🔐 Admin Passkey APIs

## Get User Passkeys

```text
GET /passkeySiteData/:userId
```

Retrieves passkey records associated with a specific user.

If no passkeys exist, the API returns an empty data array.

---

## Delete Individual Passkey

```text
DELETE /passkeySiteDelete/:userId/:itemId
```

The implementation removes an individual passkey from the user's `passKeys` array using MongoDB's `$pull` operation:

```javascript
await Passkey.updateOne(
    { userId: userId },
    { $pull: { passKeys: { _id: itemId } } }
);
```

---

# 📡 API Overview

Based on the provided admin router:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/passkeyUserData` | Fetch password-manager users |
| `DELETE` | `/passkeyUserDelete/:userId` | Delete user and related passkey data |
| `GET` | `/passkeySiteData/:userId` | Fetch a user's saved passkeys |
| `DELETE` | `/passkeySiteDelete/:userId/:itemId` | Delete an individual saved passkey |

All provided admin routes use `adminAuth`.

---

# 📁 Suggested Backend Structure

```text
backend/
│
├── middleware/
│   └── adminAuth.js
│
├── models/
│   ├── signup.js
│   └── passkey.js
│
├── routes/
│   └── admin.js
│
├── db.js
├── index.js
├── package.json
└── package-lock.json
```

The actual project structure may differ.

---

# 📊 Data Management

### User Account Data

```text
userId
userName
email
password
otp
otpExpireAt
verified
```

### Saved Credential Data

```text
userId
userName
email
passKeys[]
    ├── site
    ├── username
    └── password
```

This design supports multiple website credentials for a single user.

---

# 🔒 Security Considerations

The provided `Passkeys` schema stores the website password as a normal MongoDB string field:

```javascript
password: {
    type: String,
    default: ""
}
```

The provided code does **not** show encryption for stored website passwords. Therefore, this README does not claim that passkeys are encrypted.

For production use, a password manager should implement appropriate protection for sensitive credentials, including encryption at rest, secure key management, strong authentication, authorization, secure transport, and restricted administrative access.

The provided `Signup` schema also contains a password field, but the supplied code does not show how that password is hashed. The authentication implementation should therefore be reviewed separately before production use.

---

# 🛡️ Privacy and Access Control

Password managers contain highly sensitive information, including:

- Website usernames
- Website passwords
- User email addresses
- Authentication information

The provided admin APIs allow an authorized administrator to retrieve and delete user passkey data.

Because of this, administrator access should be carefully restricted and protected according to the application's security requirements.

---

# ⚠️ Important Notes

- Do not commit `.env` files.
- Protect MongoDB credentials.
- Protect administrator credentials.
- Do not expose saved passwords through unnecessary APIs.
- Review password hashing implementation before production use.
- Review encryption and key-management requirements before storing real credentials.
- Use HTTPS for deployed applications.
- Apply appropriate authentication and authorization to all sensitive endpoints.

---

# 📈 Intended Use

The project can be used as:

- A personal password-management application
- A small-scale credential management system
- A MERN-stack learning project
- A portfolio project
- A REST API and MongoDB demonstration
- An authentication and credential-management project

Production suitability depends on the complete application's authentication, encryption, access-control, deployment, and security implementation.

---

# 🎯 Project Objectives

The project demonstrates:

1. MERN-stack application development
2. MongoDB schema design
3. Mongoose model management
4. User account management
5. Credential storage
6. REST API development
7. Admin authorization middleware
8. User and passkey deletion
9. OTP and account verification data modeling
10. User-to-credential data association

---

# 🧪 Error Handling

The provided admin routes use HTTP status codes for different outcomes:

| Status | Meaning |
|---|---|
| `200` | Successful operation |
| `400` | Invalid or missing request information |
| `404` | Requested data or operation not found |
| `500` | Server-side error |

Example:

```json
{
    "success": true,
    "message": "Passkey deleted successfully"
}
```

---

# 🛠️ Development Notes

Both provided Mongoose schemas use:

```javascript
{ timestamps: true }
```

Mongoose therefore maintains:

```text
createdAt
updatedAt
```

The user ID is generated using the UUID package:

```javascript
const { v4: uuidv4 } = require("uuid");
```

with:

```javascript
userId: {
    type: String,
    default: uuidv4
}
```

---

# 📚 Technologies Demonstrated

```text
Frontend
└── React

Backend
├── Node.js
└── Express.js

Database
├── MongoDB
└── Mongoose

Utilities
└── UUID

Architecture
└── MERN Stack
```

---

# 🎓 Project Purpose

This project demonstrates how a password-management application can be developed using the MERN stack.

It combines:

```text
React
   ↓
Express.js
   ↓
Node.js
   ↓
Mongoose
   ↓
MongoDB
```

with user management, credential storage, OTP/verification data, and protected administrative operations.
