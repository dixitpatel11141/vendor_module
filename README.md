# Vendor Module



A Node.js B2B marketplace vendor management system with authentication, CRUD operations, and file upload capabilities.



## Features



- 🔐 JWT-based authentication

- 👥 Vendor registration and management

- 🔍 Search and pagination

- 📁 Logo upload functionality

- 🛡️ Admin verification system

- ✅ Comprehensive test coverage



## Tech Stack



- **Node.js** - Runtime environment

- **Express.js** - Web framework

- **MySQL** - Database

- **JWT** - Authentication

- **Multer** - File uploads

- **Jest** - Testing framework



## Setup



### Prerequisites

- Node.js installed

- MySQL database



### Installation



```bash

npm install

```



### Database Setup



Create a MySQL database named `vendor_module`



### Environment Configuration



Create a `.env` file with the following variables:



```env

# Environment

STATUS=development



# Server Ports

DEV_PORT=3000

PORT=3000

PROD_PORT=8080



# Database Configuration

DB_HOST=localhost

DB_USER=your_username

DB_PORT=3306

DB_NAME=vendor_module

DB_PASS=your_password

DIALECT=mysql



# JWT Configuration

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=24h



# File Upload

UPLOAD_DIR=uploads/

```



## Development



```bash

npm run dev

```



## Testing



```bash

npm test

```



## API Endpoints



### Authentication



| Method | Endpoint | Description | Auth Required |

|--------|----------|-------------|---------------|

| POST | `/api/auth/vendor/register` | Register new vendor | ❌ |

| POST | `/api/auth/vendor/login` | Vendor login (returns JWT) | ❌ |



### Vendor Management



| Method | Endpoint | Description | Auth Required |

|--------|----------|-------------|---------------|

| GET | `/api/vendors` | Get all vendors (with pagination/search) | ✅ |

| GET | `/api/vendors/:id` | Get vendor by ID | ✅ |

| POST | `/api/vendors` | Create vendor (Admin only) | ✅ |

| PUT | `/api/vendors/:id` | Update vendor | ✅ |

| DELETE | `/api/vendors/:id` | Delete vendor | ✅ |

| PATCH | `/api/vendors/:id/verify` | Verify vendor (Admin only) | ✅ |

| GET | `/api/vendors/:id/logo` | Fetch vendor logo | ✅ |



### Authentication



Use Bearer token authentication. Obtain token from the login endpoint:



```

Authorization: Bearer <your_jwt_token>

```
