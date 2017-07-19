import { expect } from 'test-drive-react';
import { root } from '../../src';

describe('root', () => {
    it("does not copy everything", () => {
        const result = root({
            foo: "foo"
        }, {
            bar: "bar",
            className: ""
        });
        expect(result).to.eql({ className: "", bar: "bar" }); // todo: prolly needs to throw an error
    });

    describe("data", () => {
        it("should merge empty objects", () => {
            const result = root({

            }, {
                className: ""
            });
            expect(result).to.eql({ className: "" }); // todo: prolly needs to throw an error
        });

        it("should merge data attributes", () => {
            const result = root({
                "data-x": "test"
            }, {
                "data-x": "overriden",
                className: ""
            });

            expect(result).to.eql({
                "data-x": "test",
                className: ""
            });
        });

        it("should merge different attributes", () => {
            const result = root({
                "data-1": "1"
            }, {
                "data-2": "2",
                className: ""
            });

            expect(result).to.eql({
                "data-1": "1",
                "data-2": "2",
                className: ""
            });
        });
    });

    describe('className', () => {
        it("should throw if no className provided in rootProps", () => {
            expect(() => root({}, {} as any)).to.throw(Error, 'className');
        });

        it("should concatinate classNames", () => {
            const result = root({
                className: "blah"
            }, {
                className: "root"
            });

            expect(result).to.eql({ className: "root blah" });
        });
    });

    describe('style', () => {
        it("should assign componentProps to root if nothing exists on root", () => {
            const result = root({style: {color: "green"}}, {className: "root"});

            expect(result).to.eql({style: {color: "green"}, className:"root"});
        });

        it("should merge props", () => {
            const result = root({
                style: {
                    color: "green"
                }
            }, {
                style: {
                    color: "red"
                },
                className: "root"
            });

            expect(result).to.eql({style: {color: "green"}, className:"root"});
        });

        it("should maintain root style even when component style is empty", () => {
            const result = root({}, {style: {color: "red"}, className: "root"});

            expect(result).to.eql({style: {color: "red"}, className:"root"});
        });
    });
});
