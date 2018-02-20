var should = require('should'), // jshint ignore:line
    sinon = require('sinon'),
    Promise = require('bluebird'),

// Stuff we are testing
    sequential = require('../../../../server/lib/promise/sequential'),

    sandbox = sinon.sandbox.create();

function createTask(y) {
    return function (x) {
        return x + y;
    };
}

describe('Sequential', function () {
    afterEach(function () {
        sandbox.restore();
    });

    it('shall execute tasks in order', function () {
        return sequential([createTask('b'), createTask('c'), createTask('d')], 'a').then(function (result) {
            result.should.eql('abcd');
        });
    });

    it('shall accept zero tasks', function () {
        return sequential([], 'a').then(function (result) {
            result.should.eql('a');
        });
    });

    it('shall return undefined if second arg is undefined', function () {
        return sequential([], undefined).then(function (result) {
            result.should.eql(undefined);
        });
    });

    it('shall accept tasks that are promises', function () {
                var p = new Promise((resolve, reject)=>resolve(1));
        return sequential([p], 'a').then(function (result) {
            result.should.eql(1);
        });
    });

    it('shall return undefined if second arg is undefined', function () {
        return sequential([], undefined).then(function (result) {
            result.should.eql(undefined);
        });
    });
});