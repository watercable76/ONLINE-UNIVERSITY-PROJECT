const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function() {
    it('should throw error if no auth header is present', function() {
        const req = {
            get: function() {
                return null;
            }
        };

        //expect(authMiddleware(req, {}, () => {})).to.throw('Not authenticated.');

        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    });

    it('should throw error if the auth header is only one string', function() {
        const req = {
            get: function() {
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(req, {}, () => {})).to.throw();

    });

    it('should throw error if the token cannot be verified', function() {
        const req = {
            get: function(headerName) {
                return 'Bearer xyz';
            }
        }
    });

});
