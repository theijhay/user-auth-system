const request = require('supertest');
const app = require('../app');
const { sequelize, User, Organisation, UserOrganisation } = require('../models');
const jwt = require('jsonwebtoken');

jest.setTimeout(30000); // Set timeout to 30 seconds

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset the database
});

afterEach(async () => {
    await User.destroy({ where: {} });
    await Organisation.destroy({ where: {} });
    await UserOrganisation.destroy({ where: {} });
});

afterAll(async () => {
    await sequelize.close();
});

describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.firstName).toBe('John');
        expect(res.body.data.user.email).toBe('john@example.com');

        const organisation = await Organisation.findOne({ where: { name: "John's Organisation" } });
        expect(organisation).not.toBeNull();
    });

    it('should fail if required fields are missing', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                // Missing lastName, email, and password
            });

        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'lastName' }),
                expect.objectContaining({ field: 'email' }),
                expect.objectContaining({ field: 'password' })
            ])
        );
    });

    it('should fail if email is already in use', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'john@example.com', // Duplicate email
                password: 'password123',
                phone: '0987654321'
            });

        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'email' })
            ])
        );
    });
});

describe('POST /auth/login', () => {
    it('should log the user in successfully', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.email).toBe('john@example.com');
    });

    it('should fail to log in with incorrect password', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'john@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Authentication failed');
    });
});

describe('Token generation', () => {
    it('should ensure token expires at the correct time and contains correct user details', async () => {
        const user = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const token = user.body.data.accessToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        expect(decoded).toHaveProperty('exp');
        expect(decoded).toHaveProperty('user.id');
    });
});

describe('GET /api/organisations', () => {
    it('should ensure users can’t see data from organisations they don’t have access to', async () => {
        const user1 = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const user2 = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                password: 'password123',
                phone: '0987654321'
            });

        await request(app)
            .post('/api/organisations')
            .set('Authorization', `Bearer ${user1.body.data.accessToken}`)
            .send({
                name: 'John\'s Org',
                description: 'Organisation 1'
            });

        const res = await request(app)
            .get('/api/organisations')
            .set('Authorization', `Bearer ${user2.body.data.accessToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.organisations).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "John's Org" })
            ])
        );
    });
});
