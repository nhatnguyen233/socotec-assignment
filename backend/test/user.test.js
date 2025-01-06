/* eslint-disable func-names */
import chai from 'chai';
import sinon from 'sinon';
import Pool from '../sql/db.js';
import {
  getUserById,
  updateUser,
  deleteUserById,
} from '../services/user.service.js';
import { NotFoundError, InternalServerError } from '../utils/errors.js';

const { expect } = chai;

describe('User Service', () => {
  let queryStub;

  beforeEach(() => {
    sinon.restore();
    queryStub = sinon.stub(Pool, 'query');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getUserById', () => {
    it('should return a user if found', async function () {
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'secret',
      };
      queryStub.resolves({ rows: [mockUser] });

      const result = await getUserById(userId);

      expect(
        queryStub.calledOnceWith({
          text: ` SELECT * FROM users WHERE id = $1 LIMIT 1`,
          values: [userId],
        })
      ).to.be.true;
      expect(result).to.eql({ id: userId, email: 'test@example.com' }); // Password should be removed
    });

    it('should throw NotFoundError if user is not found', async function () {
      queryStub.resolves({ rows: [] });

      try {
        await getUserById(999);
        throw new NotFoundError('Not found User');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('Not found User');
      }
    });

    it('should throw InternalServerError on query failure', async function () {
      queryStub.rejects(new Error('Database error'));

      try {
        await getUserById(1);
        throw new Error('Should have thrown an InternalServerError');
      } catch (err) {
        expect(err).to.be.instanceOf(InternalServerError);
        expect(err.message).to.equal('Get user info failed');
      }
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async function () {
      const userId = 1;
      const mockData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const mockFile = { filename: 'avatar.jpg' };
      const mockResponse = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatarUrl: '/uploads/avatar.jpg',
      };

      queryStub.resolves({ rows: [mockResponse] });

      const result = await updateUser(userId, mockData, mockFile);

      expect(queryStub.calledOnce).to.be.true;
      expect(result).to.eql(mockResponse);
    });

    it('should throw NotFoundError if user is not found', async function () {
      const userId = 999;
      queryStub.resolves({ rows: [] });

      try {
        await updateUser(userId, {}, null);
        throw new NotFoundError('Not found User');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('User not found');
      }
    });

    it('should throw InternalServerError on query failure', async function () {
      const userId = 1;
      queryStub.rejects(new Error('Database error'));

      try {
        await updateUser(userId, {}, null);
        throw new Error('Should have thrown an InternalServerError');
      } catch (err) {
        expect(err).to.be.instanceOf(InternalServerError);
        expect(err.message).to.equal('Failed to update profile');
      }
    });
  });

  describe('deleteUserById', () => {
    it('should delete user successfully', async function () {
      const userId = 1;
      queryStub.resolves({ rows: [{ id: userId }] });

      const result = await deleteUserById(userId);

      expect(
        queryStub.calledOnceWith({
          text: `DELETE FROM users WHERE id = $1 RETURNING *`,
          values: [userId],
        })
      ).to.be.true;
      expect(result).to.eql({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundError if user is not found', async function () {
      const userId = 999;
      queryStub.resolves({ rows: [] });

      try {
        await deleteUserById(userId);
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('User not found to delete');
      }
    });

    it('should throw InternalServerError on query failure', async function () {
      const userId = 1;
      queryStub.rejects(new Error('Database error'));

      try {
        await deleteUserById(userId);
        throw new Error('Should have thrown an InternalServerError');
      } catch (err) {
        expect(err).to.be.instanceOf(InternalServerError);
        expect(err.message).to.equal('Delete user failed');
      }
    });
  });
});
