import { expect, describe, test } from "tstyche";
import {
  parameters,
  parameter,
  rest,
  defaultValue,
  type ClassMethodParameterDecoratorContext,
} from "parameters-decorator";

/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-private-class-members */

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
declare function stringArray<This>(
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
): (this: This, value: string[]) => string[];

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
      // FIXME: too many
      // @(expect(parameters(boolean, double, long, string, logged)).type.not
      //   .toBeApplicable)
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
        @(expect(parameters(logged)).type.toBeApplicable)
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
  expect(parameters).type.toBeCallableWith(double, [true, rest(string)]);
  expect(parameters).type.not.toBeCallableWith(double, rest(string));
  expect(parameters).type.not.toBeCallableWith(double, [false, rest(string)]);

  @(expect(parameters(double, [true, rest(string)])).type.toBeApplicable)
  @(expect(parameters(double, ["b", true, rest(string)])).type.toBeApplicable)
  @(expect(parameters(double, [true, rest(string, logged)])).type
    .toBeApplicable)
  // Note: will only be applied to those *arguments*
  @(expect(parameters(double, string)).type.toBeApplicable)
  @(expect(parameters(double, string, string)).type.toBeApplicable)
  @(expect(parameters(double, stringArray)).type.not.toBeApplicable)
  class Sut {
    constructor(a: number, ...b: string[]) {}

    @(expect(parameters(boolean, [true, rest(string)])).type.toBeApplicable)
    @(expect(parameters(boolean, ["b", true, rest(string)])).type
      .toBeApplicable)
    @(expect(parameters(boolean, [true, rest(string, logged)])).type
      .toBeApplicable)
    // Note: will only be applied to those *arguments*
    @(expect(parameters(boolean, string)).type.toBeApplicable)
    @(expect(parameters(boolean, string, string)).type.toBeApplicable)
    @(expect(parameters(boolean, stringArray)).type.not.toBeApplicable)
    fn(a: boolean, ...b: string[]) {}
  }
});

test("defaultValue", () => {
  @(expect(parameters(defaultValue(-1))).type.toBeApplicable)
  class Sut {
    constructor(a: number) {}

    @(expect(parameters(defaultValue(-1))).type.toBeApplicable)
    fn(a: number) {}

    @(expect(parameter(defaultValue(-1))).type.toBeApplicable)
    set prop(a: number) {}
  }
});

// First, some constrained parameter decorators
declare function onlyNonRest(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & { rest: false },
): void;
declare function onlyRest(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & { rest: true },
): void;
declare function named(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & { name: string },
): void;
// TODO ?
// declare function memberPrefixed(
//   target: undefined,
//   context: ClassMethodParameterDecoratorContext & {
//     function: { name: `p${string}` };
//   },
// ): void;
// declare function memberSuffixed(
//   target: undefined,
//   context: ClassMethodParameterDecoratorContext & {
//     function: { name: `${string}S` };
//   },
// ): void;
declare function onlyClass(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { kind: "class" };
  },
): void;
declare function onlyMethod(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { kind: "method" };
  },
): void;
declare function onlySetter(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { kind: "setter" };
  },
): void;
declare function onlyMember(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { kind: "method" | "setter" };
  },
): void;
declare function memberNonStatic(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { static: false };
  },
): void;
declare function memberStatic(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { static: true };
  },
): void;
declare function memberPublic(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { private: false };
  },
): void;
declare function memberPrivate(
  target: undefined,
  context: ClassMethodParameterDecoratorContext & {
    function: { private: true };
  },
): void;

describe("constrained applicability", () => {
  test("rest", () => {
    expect(parameters).type.toBeCallableWith(onlyNonRest);
    expect(parameters).type.toBeCallableWith(["name", onlyNonRest]);
    expect(parameters).type.toBeCallableWith([false, onlyNonRest]);
    expect(parameters).type.toBeCallableWith(["name", false, onlyNonRest]);
    expect(parameters).type.toBeCallableWith({ decorators: [onlyNonRest] });
    expect(parameters).type.toBeCallableWith({
      rest: false,
      decorators: [onlyNonRest],
    });
    expect(parameters).type.not.toBeCallableWith([true, onlyNonRest]);
    expect(parameters).type.not.toBeCallableWith(["name", true, onlyNonRest]);
    expect(parameters).type.not.toBeCallableWith({
      rest: true,
      decorators: [onlyNonRest],
    });

    expect(parameters).type.toBeCallableWith([true, onlyRest]);
    expect(parameters).type.toBeCallableWith(["name", true, onlyRest]);
    expect(parameters).type.toBeCallableWith({
      rest: true,
      decorators: [onlyRest],
    });
    expect(parameters).type.not.toBeCallableWith(onlyRest);
    expect(parameters).type.not.toBeCallableWith(["name", onlyRest]);
    expect(parameters).type.not.toBeCallableWith([false, onlyRest]);
    expect(parameters).type.not.toBeCallableWith(["name", false, onlyRest]);
    expect(parameters).type.not.toBeCallableWith({ decorators: [onlyRest] });
    expect(parameters).type.not.toBeCallableWith({
      rest: false,
      decorators: [onlyRest],
    });
  });

  test("named", () => {
    expect(parameters).type.toBeCallableWith(["name", named]);
    expect(parameters).type.toBeCallableWith({
      name: "name",
      decorators: [named],
    });
    expect(parameters).type.toBeCallableWith(["name", true, named]);
    expect(parameters).type.toBeCallableWith({
      name: "name",
      rest: true,
      decorators: [named],
    });
    expect(parameters).type.not.toBeCallableWith(named);
    expect(parameters).type.not.toBeCallableWith({ decorators: [named] });
    expect(parameters).type.not.toBeCallableWith([true, named]);
    expect(parameters).type.not.toBeCallableWith({
      rest: true,
      decorators: [named],
    });
  });

  test("function.kind", () => {
    @(expect(parameters(onlyClass)).type.toBeApplicable)
    @(expect(parameters(onlyMethod)).type.not.toBeApplicable)
    @(expect(parameters(onlySetter)).type.not.toBeApplicable)
    @(expect(parameters(onlyMember)).type.not.toBeApplicable)
    class C {
      constructor(a: string) {}

      @(expect(parameters(onlyClass)).type.not.toBeApplicable)
      @(expect(parameters(onlyMethod)).type.toBeApplicable)
      @(expect(parameters(onlySetter)).type.not.toBeApplicable)
      @(expect(parameters(onlyMember)).type.toBeApplicable)
      fn(a: string) {}

      @(expect(parameter(onlyClass)).type.not.toBeApplicable)
      @(expect(parameter(onlyMethod)).type.not.toBeApplicable)
      @(expect(parameter(onlySetter)).type.toBeApplicable)
      @(expect(parameter(onlyMember)).type.toBeApplicable)
      set prop(value: string) {}
    }
  });

  test("function.static", () => {
    @(expect(parameters(memberNonStatic)).type.toBeApplicable)
    @(expect(parameters(memberStatic)).type.toBeApplicable)
    @(expect(parameters([onlyMember, memberNonStatic])).type.not.toBeApplicable)
    @(expect(parameters([onlyMember, memberStatic])).type.not.toBeApplicable)
    class C {
      constructor(a: string) {}

      @(expect(parameters(memberNonStatic)).type.toBeApplicable)
      @(expect(parameters(memberStatic)).type.not.toBeApplicable)
      fn(a: string) {}

      @(expect(parameter(memberNonStatic)).type.toBeApplicable)
      @(expect(parameter(memberStatic)).type.not.toBeApplicable)
      set prop(value: string) {}

      @(expect(parameters(memberNonStatic)).type.not.toBeApplicable)
      @(expect(parameters(memberStatic)).type.toBeApplicable)
      static fn(a: string) {}

      @(expect(parameter(memberNonStatic)).type.not.toBeApplicable)
      @(expect(parameter(memberStatic)).type.toBeApplicable)
      static set prop(value: string) {}
    }
  });

  test("function.private", () => {
    @(expect(parameters(memberPublic)).type.toBeApplicable)
    @(expect(parameters(memberPrivate)).type.toBeApplicable)
    @(expect(parameters([onlyMember, memberPublic])).type.not.toBeApplicable)
    @(expect(parameters([onlyMember, memberPrivate])).type.not.toBeApplicable)
    class C {
      constructor(a: string) {}

      @(expect(parameters(memberPublic)).type.toBeApplicable)
      @(expect(parameters(memberPrivate)).type.not.toBeApplicable)
      fn(a: string) {}

      @(expect(parameter(memberPublic)).type.toBeApplicable)
      @(expect(parameter(memberPrivate)).type.not.toBeApplicable)
      set prop(value: string) {}

      @(expect(parameters(memberPublic)).type.not.toBeApplicable)
      @(expect(parameters(memberPrivate)).type.toBeApplicable)
      #fn(a: string) {}

      @(expect(parameter(memberPublic)).type.not.toBeApplicable)
      @(expect(parameter(memberPrivate)).type.toBeApplicable)
      set #prop(value: string) {}
    }
  });
});
