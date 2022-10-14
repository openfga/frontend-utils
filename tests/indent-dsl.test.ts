import { friendlySyntaxToApiSyntax, indentDSL } from "../src";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { testModels } from "./data";

const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const repeatSequence = (sequence: string, times: number) => {
    return sequence.repeat(times);
}

const generateRandomNumberOfSpaces = () => {
    return repeatSequence(" ", getRandomNumber(0, 30));
};

const generateRandomNewLines = () => {
    return repeatSequence("\n", getRandomNumber(0, 15));
};

describe("indent-dsl", () => {
    testModels.forEach(testCase => {
        it(`should indent ${testCase.name}`, () => {
            const rawFriendly = testCase.friendly.split("\n").map(line => generateRandomNumberOfSpaces() + line.trim()).join("\n");
            const apiSyntax = friendlySyntaxToApiSyntax(indentDSL(rawFriendly));
            expect(apiSyntax).toEqual(testCase.json);
        });
    });

    testModels.forEach(testCase => {
        it(`should indent ${testCase.name} with random spaces and empty lines removed`, () => {
            const rawFriendly = testCase.friendly.split("\n").map(line => generateRandomNumberOfSpaces() + line.trim() + generateRandomNewLines()).join("\n");
            const apiSyntax = friendlySyntaxToApiSyntax(indentDSL(rawFriendly, true));
            expect(apiSyntax).toEqual(testCase.json);
        });
    });
    
    testModels.forEach(testCase => {
        it(`should indent ${testCase.name} with empty lines removed`, () => {
            const rawFriendly = testCase.friendly.split("\n").map(line => line.trim() + generateRandomNewLines()).join("\n");
            const apiSyntax = friendlySyntaxToApiSyntax(indentDSL(rawFriendly, true));
            expect(apiSyntax).toEqual(testCase.json);
        });
    });

    testModels.forEach(testCase => {
        it(`should indent ${testCase.name} with empty lines not removed`, () => {
            const rawFriendly = testCase.friendly.split("\n").map(line => line.trim() + generateRandomNewLines()).join("\n");
            const apiSyntax = friendlySyntaxToApiSyntax(indentDSL(rawFriendly, false));
            expect(apiSyntax).toEqual(testCase.json);
        });
    });

});
