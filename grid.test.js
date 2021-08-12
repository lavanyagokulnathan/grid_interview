const grid = require("./grid");

describe("Given a `grid` function", () => {
    beforeEach(() => {
        grid.defaultValue = 0;
    });

    it("returns a function", () => {
        expect(typeof grid()).toBe("function");
    });

    describe("when called without any additional arguments", () => {
        it("should return an empty array", () => {
            expect(grid()()).toEqual([]);
        });
    });

    describe("when called with `width` and `height` arguments", () => {
        it("should return an array of zeroes with the expected size", () => {
            expect(grid({ width: 2, height: 2 })()).toEqual([
                [0, 0],
                [0, 0]
            ]);
            expect(grid({ width: 4, height: 4 })()).toEqual([
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
        });

        it("should return an iterable array", () => {
            grid({ width: 2, height: 2 })().forEach((arr) => {
                arr.forEach((num) => {
                    expect(num).toEqual(grid.defaultValue);
                });
            });
        });

        it("should return an empty array with invalid arguments", () => {
            expect(grid({ width: null, height: null })()).toEqual([]);
            expect(grid({ width: -1, height: -1 })()).toEqual([]);
            expect(grid({ width: "4", height: "4" })()).toEqual([]);
        });

        it("should return an array of values if specified", () => {
            grid.defaultValue = "hello";
            expect(grid({ width: 2, height: 2 })()).toEqual([
                ["hello", "hello"],
                ["hello", "hello"]
            ]);

            grid.defaultValue = "world";
            expect(grid({ width: 4, height: 4 })()).toEqual([
                ["world", "world", "world", "world"],
                ["world", "world", "world", "world"],
                ["world", "world", "world", "world"],
                ["world", "world", "world", "world"]
            ]);
        });
    });

    describe("when an array is being passed in", () => {
        const array = [
            [1, 2],
            [3, 4]
        ];

        it("should return a new array", () => {
            expect(grid(array)()).toEqual(array);
            expect(grid(array)()).not.toBe(array);
        });

        describe("when an action is being passed in", () => {
            describe("and `CLEAR` action is being called", () => {
                it("should reset to the default value", () => {
                    const expectedValue = [
                        [0, 2],
                        [3, 4]
                    ];

                    expect(grid(array)({ type: "CLEAR", pos: [0, 0] })).toEqual(
                        expectedValue
                    );
                    expect(array[0][0]).toBe(1);
                });

                it("should not change anything if the position is invalid", () => {
                    expect(grid(array)({ type: "CLEAR", pos: [2, 2] })).toEqual(array);
                    expect(grid(array)({ type: "CLEAR", pos: [4, 4] })).toEqual(array);
                });
            });

            it("should overwrite a value with `SET`", () => {
                const expectedValue = [
                    [1, 2],
                    [3, 5]
                ];

                const arrayWithSetValue = grid(array)({
                    type: "SET",
                    pos: [1, 1],
                    value: 5
                });
                expect(arrayWithSetValue).toEqual(expectedValue);
                expect(array[1][1]).toBe(4);
                expect(arrayWithSetValue[1][1]).toBe(5);
            });

            it("should swap values with `SWAP`", () => {
                const expectedValue = [
                    [4, 2],
                    [3, 1]
                ];

                const arrayWithSwappedValues = grid(array)({
                    type: "SWAP",
                    from: [0, 0],
                    to: [1, 1]
                });

                expect(arrayWithSwappedValues).toEqual(expectedValue);
                expect(array[0][0]).toBe(1);
                expect(array[1][1]).toBe(4);
                expect(arrayWithSwappedValues[0][0]).toBe(4);
                expect(arrayWithSwappedValues[1][1]).toBe(1);
            });
        });
    });
});