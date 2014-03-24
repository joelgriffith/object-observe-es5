var expect = require('must'),
	_ = require('../../lib/utils'),
	m = require('../fixtures/mock');


describe('Utils', function() {
	describe('Array utilities', function() {
		describe('#compare returns a boolean when given two arrays to compare', function() {
			it('should return false when arrays are different lengths', function() {
				expect(_.compare(m.array.compare.lengthA, m.array.compare.lengthB)).to.not.be.ok;
			});
			it('should return true when the arrays are identical', function() {
				expect(_.compare(m.array.compare.truthyA, m.array.compare.truthyB)).to.be.ok;
			});
			it('should do recursive comparisons', function(done) {
				expect(_.compare(m.array.compare.nestedA, m.array.compare.nestedB)).to.not.be.ok;
				expect(_.compare(m.array.compare.nestedA, m.array.compare.nestedC)).to.be.ok;
				done();
			});
			it('should throw a TypeError when comparing anything but Arrays', function(done) {
				expect(function() { _.compare(m.array.compare.typeA, m.array.compare.typeB);}).to.throw(TypeError);
				expect(function() { _.compare(m.array.compare.typeB, m.array.compare.typeC);}).to.throw(TypeError);
				expect(function() { _.compare(m.array.compare.typeB, m.array.compare.typeB);}).to.not.throw(TypeError);
				done();
			});
		});

		describe('#diff returns an array of deltas between two arrays', function() {
			it('should return the difference(s) between two arrays', function() {
				_.diff(m.array.diff.diffA, m.array.diff.diffB).must.have.length(1);
			});
			it('should return an empty array when there are no differences', function() {
				_.diff(m.array.diff.emptyA, m.array.diff.emptyB).must.be.empty();
			});
			it('should be ignorant of order', function() {
				_.diff(m.array.diff.orderA, m.array.diff.orderB).must.be.empty();
			});
			it('should work with both numbers and strings', function() {
				_.diff(m.array.diff.typeA, m.array.diff.typeB).must.eql(['4', 'd']);
			});
			it('should throw a TypeError when comparing anything but Arrays', function(done) {
				expect(function() { _.diff(m.array.diff.nonArrayA, m.array.diff.nonArrayB);}).to.throw(TypeError);
				expect(function() { _.diff(m.array.diff.nonArrayC, m.array.diff.nonArrayD);}).to.throw(TypeError);
				expect(function() { _.diff(m.array.diff.nonArrayE, m.array.diff.nonArrayF);}).to.throw(TypeError);
				done();
			});
		});

		describe('#keys returns an array of properties for a given object', function() {
			it('should return an array', function() {
				_.keys(m.array.keys.returnA).must.be.an.array();
			});
			it('should return an empty array when the object is empty', function() {
				_.keys(m.array.keys.empty).must.eql([]);
			});
			it('should return an array of keys for each key an object contains', function() {
				_.keys(m.array.keys.flat).must.eql(['one', 'two', 'three']);
			});
			it('should only capture root-level properties and not nested objects', function() {
				_.keys(m.array.keys.nested).must.eql(['one', 'two', 'three']);
				_.keys(m.array.keys.nested).must.include('one', 'two', 'three');
				_.keys(m.array.keys.nested).must.not.include('notMe', 'orMe');
			});
			it('should throw a TypeError when trying to pass a non-object', function(done) {
				expect(function() { _.keys(m.array.keys.nonObjectA);}).to.throw(TypeError);
				expect(function() { _.keys(m.array.keys.nonObjectB);}).to.throw(TypeError);
				expect(function() { _.keys(m.array.keys.nonObjectC);}).to.throw(TypeError);
				expect(function() { _.keys(m.array.keys.nonObjectD);}).to.throw(TypeError);
				expect(function() { _.keys(m.array.keys.nonObjectE);}).to.throw(TypeError);
				expect(function() { _.keys(m.array.keys.nonObjectF);}).to.throw(TypeError);
				done();
			});
		});
	});
});