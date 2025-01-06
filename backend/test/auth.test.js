/* eslint-disable func-names */
import { join } from 'path';
import { config } from 'dotenv';
import chai from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';

import { loginUser, registerUser } from '../services/auth.service.js';
import db from '../sql/db.js';

config({ path: join(process.cwd(), '.env') });
const { expect } = chai;

describe('Authentication Services', () => {
  let queryStub;
  let jwtSignStub;

  beforeEach(() => {
    queryStub = sinon.stub(db, 'query');
    jwtSignStub = sinon.stub(jwt, 'sign');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('loginUser', () => {
    it('should throw an error if query fails', async function () {
      queryStub.rejects(new Error('Bad credentials'));
      try {
        await loginUser('toto@toto.fr', 'tata');
      } catch (err) {
        expect(err.message).to.equal('Bad credentials');
        expect(queryStub.callCount).to.equal(1);
        return;
      }
      throw new Error('Should have thrown an error');
    });

    it('should throw an error if query returns 0 rows', async function () {
      queryStub.resolves({ rowCount: 0, rows: [] });
      try {
        await loginUser('toto@toto.fr', 'tata');
      } catch (err) {
        expect(err.message).to.equal('Bad credentials');
        expect(queryStub.callCount).to.equal(1);
        return;
      }
      throw new Error('Should have thrown an error');
    });

    it('should succeed when valid credentials are provided', async function () {
      queryStub.resolves({ rowCount: 1, rows: [{ email: 'toto@toto.fr' }] });
      const authUser = await loginUser('toto@toto.fr', 'tata');
      expect(authUser?.userInfo?.email).to.equal('toto@toto.fr');
    });
  });

  describe('registerUser', () => {
    it('should register a user successfully', async function () {
      const email = 'test@example.com';
      const password = 'securePassword123';
      const userId = 1;
      const token = 'jwtAccessToken';

      queryStub.resolves({
        rows: [{ id: userId, email }],
      });
      jwtSignStub.returns(token);

      // Replace hashPassword in the scope of the test
      const result = await registerUser(email, password);

      expect(result).to.eql({
        accessToken: result.accessToken,
        userInfo: { id: userId, email },
      });
    });

    it('should throw an error if the database query fails', async function () {
      const email = 'test@example.com';
      const password = 'securePassword123';

      queryStub.rejects(new Error('Database error'));

      try {
        await registerUser(email, password);
        throw new Error('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.equal('Register failed');
        expect(queryStub.calledOnce).to.be.true;
      }
    });
  });
});
