import { expect, describe, test } from "tstyche";
import {
  parameters,
  parameter,
  rest,
  defaultValue,
  type ClassMethodParameterDecoratorContext,
} from "parameters-decorator";

/* eslint-disable @typescript-eslint/no-unused-vars */

declare function boolean<This>(
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
): (this: This, value: boolean) => boolean;
declare function double<This>(
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
): (this: This, value: number) => number;
declare function long<This>(
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
): (this: This, value: number) => number;
declare function string<This>(
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
): (this: This, value: string) => string;

declare function logged<This>(
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
): void;

describe("parameters", () => {
  describe("class", () => {
    test("parameter length", () => {
      @(expect(parameters(boolean, double, long, string)).type.toBeApplicable)
      @(expect(parameters(boolean, double, long)).type.toBeApplicable)
      @(expect(parameters(boolean, double)).type.toBeApplicable)
      @(expect(parameters(boolean)).type.toBeApplicable)
      // too many
      @(expect(parameters(boolean, double, long, string, logged)).type.not
        .toBeApplicable)
      class Sut {
        constructor(b: boolean, d: number, l: number, s: string) {}
      }
    });
    test("various forms", () => {
      @(expect(
        parameters(
          [boolean],
          ["d", double],
          [false, long],
          ["s", false, string],
        ),
      ).type.toBeApplicable)
      @(expect(
        parameters(
          { decorators: [boolean] },
          { name: "d", decorators: [double] },
          { rest: false, decorators: [long] },
          { name: "s", rest: false, decorators: [string] },
        ),
      ).type.toBeApplicable)
      @(expect(
        parameters(
          boolean,
          { name: "d", decorators: [double] },
          [false, long],
          { name: "s", rest: false, decorators: [string] },
        ),
      ).type.toBeApplicable)
      class Sut {
        constructor(b: boolean, d: number, l: number, s: string) {}
      }
    });
    test("types", () => {
      @(expect(parameters(boolean)).type.toBeApplicable)
      @(expect(parameters(logged)).type.toBeApplicable)
      @(expect(parameters([boolean, logged])).type.toBeApplicable)
      @(expect(parameters(double)).type.not.toBeApplicable)
      @(expect(parameters(long)).type.not.toBeApplicable)
      @(expect(parameters(string)).type.not.toBeApplicable)
      class Sut {
        constructor(b: boolean) {}
      }
    });
  });
  describe("method", () => {
    test("static", () => {
      class Sut {
        @(expect(parameters(boolean, double, long, string)).type.toBeApplicable)
        static method(b: boolean, d: number, l: number, s: string) {}
      }
    });
    test("parameter length", () => {
      class Sut {
        @(expect(parameters(boolean, double, long, string)).type.toBeApplicable)
        @(expect(parameters(boolean, double, long)).type.toBeApplicable)
        @(expect(parameters(boolean, double)).type.toBeApplicable)
        @(expect(parameters(boolean)).type.toBeApplicable)
        // too many
        @(expect(parameters(boolean, double, long, string, logged)).type.not
          .toBeApplicable)
        method(b: boolean, d: number, l: number, s: string) {}
      }
    });
    test("various forms", () => {
      class Sut {
        @(expect(
          parameters(
            [boolean],
            ["d", double],
            [false, long],
            ["s", false, string],
          ),
        ).type.toBeApplicable)
        @(expect(
          parameters(
            { decorators: [boolean] },
            { name: "d", decorators: [double] },
            { rest: false, decorators: [long] },
            { name: "s", rest: false, decorators: [string] },
          ),
        ).type.toBeApplicable)
        @(expect(
          parameters(
            boolean,
            { name: "d", decorators: [double] },
            [false, long],
            { name: "s", rest: false, decorators: [string] },
          ),
        ).type.toBeApplicable)
        method(b: boolean, d: number, l: number, s: string) {}
      }
    });
    test("types", () => {
      class Sut {
        @(expect(parameters(boolean)).type.toBeApplicable)
        // XXX: must be explicit, but This type argument is enough
        @(expect(parameters<Sut>(logged)).type.toBeApplicable)
        @(expect(parameters([boolean, logged])).type.toBeApplicable)
        @(expect(parameters(double)).type.not.toBeApplicable)
        @(expect(parameters(long)).type.not.toBeApplicable)
        @(expect(parameters(string)).type.not.toBeApplicable)
        method(b: boolean) {}
      }
    });
  });
});

describe("parameter", () => {
  test("static", () => {
    class Sut {
      @(expect(parameter(boolean)).type.toBeApplicable)
      @(expect(parameter(logged)).type.toBeApplicable)
      @(expect(parameter(boolean, logged)).type.toBeApplicable)
      @(expect(parameter(double)).type.not.toBeApplicable)
      @(expect(parameter(long)).type.not.toBeApplicable)
      @(expect(parameter(string)).type.not.toBeApplicable)
      static set prop(b: boolean) {}
    }
  });
  test("member", () => {
    class Sut {
      @(expect(parameter(boolean)).type.toBeApplicable)
      @(expect(parameter(logged)).type.toBeApplicable)
      @(expect(parameter(boolean, logged)).type.toBeApplicable)
      @(expect(parameter(double)).type.not.toBeApplicable)
      @(expect(parameter(long)).type.not.toBeApplicable)
      @(expect(parameter(string)).type.not.toBeApplicable)
      set prop(b: boolean) {}
    }
  });
  test("various forms", () => {
    class Sut {
      @(expect(parameter(boolean)).type.toBeApplicable)
      @(expect(parameter(boolean, logged)).type.toBeApplicable)
      @(expect(parameter("b", boolean)).type.toBeApplicable)
      @(expect(parameter("b", boolean, logged)).type.toBeApplicable)
      @(expect(parameter({ name: "b", decorators: [boolean] })).type
        .toBeApplicable)
      @(expect(parameter({ name: "b", decorators: [boolean, logged] })).type
        .toBeApplicable)
      set prop(b: boolean) {}
    }
  });
  test("types", () => {
    class Sut {
      @(expect(parameter(boolean)).type.toBeApplicable)
      @(expect(parameter(logged)).type.toBeApplicable)
      @(expect(parameter(boolean, logged)).type.toBeApplicable)
      @(expect(parameter(logged)).type.toBeApplicable)
      @(expect(parameter(double)).type.not.toBeApplicable)
      @(expect(parameter(long)).type.not.toBeApplicable)
      @(expect(parameter(string)).type.not.toBeApplicable)
      set prop(b: boolean) {}
    }
  });
});

test("rest", () => {
  @(expect(parameters(double, [true, rest(string)])).type.toBeApplicable)
  @(expect(parameters(double, ["b", true, rest(string)])).type.toBeApplicable)
  @(expect(parameters(double, [true, rest(string, logged)])).type
    .toBeApplicable)
  // TODO:
  // @(expect(parameters(double, rest(string))).type.not.toBeApplicable)
  // @(expect(parameters(double, [false, rest(string)])).type.not.toBeApplicable)
  class Sut {
    constructor(a: number, ...b: string[]) {}

    // XXX: must be explicit, but This type argument is enough
    @(expect(parameters<Sut>(boolean, [true, rest(string)])).type
      .toBeApplicable)
    @(expect(parameters<Sut>(boolean, ["b", true, rest(string)])).type
      .toBeApplicable)
    @(expect(parameters<Sut>(boolean, [true, rest(string, logged)])).type
      .toBeApplicable)
    // TODO:
    // @(expect(parameters<Sut>(boolean, rest(string))).type.not.toBeApplicable)
    // @(expect(parameters<Sut>(boolean, [false, rest(string)])).type.not.toBeApplicable)
    fn(a: boolean, ...b: string[]) {}
  }
});

test("defaultValue", () => {
  @(expect(parameters(defaultValue(-1))).type.toBeApplicable)
  class Sut {
    constructor(a: number) {}

    // XXX: must be explicit, but This type argument is enough
    @(expect(parameters<Sut>(defaultValue(-1))).type.toBeApplicable)
    fn(a: number) {}

    @(expect(parameter(defaultValue(-1))).type.toBeApplicable)
    set prop(a: number) {}
  }
});
