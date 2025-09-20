const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/config');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Vendor Registration and Vendor Login', () => {
  const vendorData = {
    company_name: 'OPS',
    contact_person_name: 'Dixit Patel',
    email: 'dixit.patel@radixweb.com',
    password: 'Radixweb@8',
    phone_number: '1234567890',
    business_type: 'Manufacturer',
    address: 'Ekyarth Radixweb Ahemdabad',
    country: 'India',
    gst_number: '07ABCDE1234F2Z5'
  };

  test('should register a new vendor', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/register')
      .send(vendorData);
    expect(res.statusCode).toBe(201);
    expect(res.body.vendor).toHaveProperty('id');
    expect(res.body.vendor.email).toBe(vendorData.email);
  });

  test('should not register with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/register')
      .send(vendorData);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email already in use/);
  });

  test('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/login')
      .send({ email: vendorData.email, password: vendorData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/login')
      .send({ email: vendorData.email, password: 'WrongPassword@123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid credentials/);
  });

  test('should not register with invalid GST for India', async () => {
    const invalidGST = { ...vendorData, email: 'new@example.com', gst_number: 'INVALIDGST12345' };
    const res = await request(app)
      .post('/api/auth/vendor/register')
      .send(invalidGST);
    expect(res.statusCode).toBe(422);
    expect(res.body.errors[0].msg).toMatch(/Invalid GST number format/);
  });

  test('should not register with invalid Tax ID for Global', async () => {
    const globalVendor = { ...vendorData, email: 'global@example.com', country: 'Global', gst_number: '12' };
    const res = await request(app)
      .post('/api/auth/vendor/register')
      .send(globalVendor);
    expect(res.statusCode).toBe(422);
    expect(res.body.errors[0].msg).toMatch(/Invalid Tax ID format/);
  });
});

describe('Get All Vendors, Get Vendor by ID, Create Vendor (Admin Only), Update Vendor, Delete Vendor and Verify Vendor (Admin)', () => {
  const vendorData = {
    company_name: 'OPS',
    contact_person_name: 'Nimit Bhagat',
    email: 'nimit.bhagat@radixweb.com',
    password: 'Radixweb@8',
    phone_number: '1234567890',
    business_type: 'Manufacturer',
    address: 'Ekyarth Radixweb Ahemdabad',
    country: 'India',
    gst_number: '07ABCDE1234F2Z5'
  };

  const vendorData2 = {
    company_name: 'OPS',
    contact_person_name: 'Dixit Patel',
    email: 'dixit@radixweb.com',
    password: 'Radixweb@8',
    phone_number: '1234567890',
    business_type: 'Manufacturer',
    address: 'Ekyarth Radixweb Ahemdabad',
    country: 'India',
    gst_number: '07ABCDE1234F2Z5'
  };

  let vendorId;
  let token;

  test('Vendor Registration', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/register')
      .send(vendorData);
    expect(res.statusCode).toBe(201);
    expect(res.body.vendor).toHaveProperty('id');
    vendorId = res.body.vendor.id;
  });

  test('Vendor Login', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/login')
      .send({ email: vendorData.email, password: vendorData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('Get All Vendors', async () => {
    const res = await request(app)
      .get('/api/vendors')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data', expect.arrayContaining([expect.objectContaining({ email: vendorData.email })]));
  });

  test('Get Vendor by ID', async () => {
    const res = await request(app)
      .get(`/api/vendors/${vendorId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', vendorData.email);
  });

  test('Create Vendor (Admin Only)', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/register')
      .set('Authorization', `Bearer ${token}`)
      .send(vendorData2);
    expect(res.statusCode).toBe(201);
    expect(res.body.vendor).toHaveProperty('id');
    vendorId = res.body.vendor.id;
  });

  test('Update vendor', async () => {
    const res = await request(app)
      .put(`/api/vendors/${vendorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ address: 'Ekyarth' });
    expect(res.statusCode).toBe(200);
    expect(res.body.vendor).toHaveProperty('address', 'Ekyarth');
  });

  test('Verify Vendor (Admin)', async () => {
    const res = await request(app)
      .patch(`/api/vendors/${vendorId}/verify`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('vendor', expect.objectContaining({ is_verified: true }));
  });

  test('Delete vendor', async () => {
    const res = await request(app)
      .delete(`/api/vendors/${vendorId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
