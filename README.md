# vendor_module
 Building a Vendor Module with Node.js (B2B  Marketplace)


*Steps to run project:*
-----------------------
1. npm init -y
2. npm install
3. npm i express
4. npm i bcrypt
5. npm i body-parser
6. npm i jsonwebtoken
7. npm i mysql2
8. npm i nodemon
9. npm i path
10. npm i sequel
11. npm install express-validator
12. Create database vendor_module
13. npm run watch
14. npm install dotenv
15. npm install cors
16. npm install multer
17. npm install jest
17. npm install supertest


Configure below details .env file:
# Environment variables.
STATUS

#Development port
DEV_PORT
PORT

#Production port
PROD_PORT

#DB CONFIG
DB_HOST
DB_USER
DB_PORT
DB_NAME
DB_PASS
DIALECT

#JWT CONFIG
JWT_SECRET
JWT_EXPIRES_IN

# File upload directory
UPLOAD_DIR


*List of enpoints:*
-------------------
*Vendor Registration*
Endpoint: POST /api/auth/vendor/register
Description: Registers a new vendor.
Authentication: Not required.

*Vendor Login*
Endpoint: POST /api/auth/vendor/login
Description: Vendor login with email/password. Returns JWT.
Authentication: Not required.

*Get All Vendors*
Endpoint: GET /api/vendors
Features: Pagination + search by companyName/email
Authentication: Required.

*Get Vendor by ID*
Endpoint: GET /api/vendors/:id
Authentication: Required.

*Create Vendor (Admin Only)*
Endpoint: POST /api/vendors
Description: Creates vendor record.
Authentication: Required.

*Update Vendor*
Endpoint: PUT /api/vendors/:id
Authentication: Required.

*Delete Vendor*
Endpoint: DELETE /api/vendors/:id
Authentication: Required.

*Verify Vendor (Admin)*
Endpoint: PATCH /api/vendors/:id/verify
Description: Marks vendor as verified.
Authentication: Required.

*Fetch logo via*
Endpoint: GET /api/vendors/:id/logo.

Token:
User Bearer for Authentication. Get this token from *Vendor Login* endpoint


*Run test cases:*
npm test