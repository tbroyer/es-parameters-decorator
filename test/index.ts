import assert from "node:assert/strict";
import { suite, test } from "node:test";
import {
  parameters,
  parameter,
  optional,
  rest,
  type ClassMethodParameterDecoratorContext,
} from "parameters-decorator";

//@ts-expect-error polyfill Symbol.metadata
Symbol.metadata ??= Symbol("metadata");

void suite("parameters", () => {
  void test("class", () => {
    const RECORDED_DATA = Symbol();
    function record<Value>(
      _: undefined,
      context: ClassMethodParameterDecoratorContext,
    ) {
      assert.equal(context.kind, "parameter");
      assert.deepEqual(context.function, { kind: "class", name: "Sut" });
      const { name, index, rest } = context;
      (((context.metadata[RECORDED_DATA] as Pick<
        ClassMethodParameterDecoratorContext,
        "name" | "index" | "rest"
      >[][]) ??= [])[index] ??= []).push({ name, index, rest });

      return function (this: unknown, value: Value) {
        assert.equal(this, undefined);
        (Sut[RECORDED_DATA][index] ??= []).push(value);
        return value;
      };
    }

    @parameters(
      [record, record],
      ["b", record],
      [false, record],
      ["d", true, record],
    )
    class Sut {
      static [RECORDED_DATA]: any[][] = [];
      constructor(a: string, b: number, c: boolean, ...d: string[]) {
        Sut[RECORDED_DATA][0].push(a);
        Sut[RECORDED_DATA][1].push(b);
        Sut[RECORDED_DATA][2].push(c);
        Sut[RECORDED_DATA][3].push(d);
      }
    }

    assert.deepEqual(Sut[Symbol.metadata]![RECORDED_DATA], [
      [
        { name: undefined, index: 0, rest: false },
        { name: undefined, index: 0, rest: false },
      ],
      [{ name: "b", index: 1, rest: false }],
      [{ name: undefined, index: 2, rest: false }],
      [{ name: "d", index: 3, rest: true }],
    ]);

    new Sut("a", 42, true, "foo", "bar", "baz");
    assert.deepEqual(Sut[RECORDED_DATA], [
      ["a", "a", "a"],
      [42, 42],
      [true, true],
      [
        ["foo", "bar", "baz"],
        ["foo", "bar", "baz"],
      ],
    ]);
  });

  void test("method", () => {
    const RECORDED_DATA = Symbol();
    function record<This extends { [RECORDED_DATA]: any[][] }, Value>(
      _: undefined,
      context: ClassMethodParameterDecoratorContext,
    ) {
      assert.equal(context.kind, "parameter");
      assert.deepEqual(context.function, {
        kind: "method",
        name: "fn",
        static: false,
        private: false,
      });
      const { name, index, rest } = context;
      (((context.metadata[RECORDED_DATA] as Pick<
        ClassMethodParameterDecoratorContext,
        "name" | "index" | "rest"
      >[][]) ??= [])[index] ??= []).push({ name, index, rest });

      return function (this: This, value: Value) {
        (this[RECORDED_DATA][index] ??= []).push(value);
        return value;
      };
    }

    class Sut {
      [RECORDED_DATA]: any[][] = [];

      @parameters(
        [record, record],
        ["b", record],
        [false, record],
        ["d", true, record],
      )
      fn(a: string, b: number, c: boolean, ...d: string[]) {
        this[RECORDED_DATA][0].push(a);
        this[RECORDED_DATA][1].push(b);
        this[RECORDED_DATA][2].push(c);
        this[RECORDED_DATA][3].push(d);
      }
    }

    assert.deepEqual(Sut[Symbol.metadata]![RECORDED_DATA], [
      [
        { name: undefined, index: 0, rest: false },
        { name: undefined, index: 0, rest: false },
      ],
      [{ name: "b", index: 1, rest: false }],
      [{ name: undefined, index: 2, rest: false }],
      [{ name: "d", index: 3, rest: true }],
    ]);

    const sut = new Sut();
    sut.fn("a", 42, true, "foo", "bar", "baz");
    assert.deepEqual(sut[RECORDED_DATA], [
      ["a", "a", "a"],
      [42, 42],
      [true, true],
      [
        ["foo", "bar", "baz"],
        ["foo", "bar", "baz"],
      ],
    ]);
  });
});

void suite("parameter", () => {
  void test("instance setter", () => {
    const RECORDED_DATA = Symbol();
    function record<This extends { [RECORDED_DATA]: any[] }, Value>(
      _: undefined,
      context: ClassMethodParameterDecoratorContext,
    ) {
      assert.equal(context.kind, "parameter");
      assert.deepEqual(context.function, {
        kind: "setter",
        name: "prop",
        static: false,
        private: false,
      });
      const { name, index, rest } = context;
      (((context.metadata[RECORDED_DATA] as Pick<
        ClassMethodParameterDecoratorContext,
        "name" | "index" | "rest"
      >[][]) ??= [])[index] ??= []).push({ name, index, rest });

      return function (this: This, value: Value) {
        this[RECORDED_DATA].push(value);
        return value;
      };
    }

    class Sut {
      [RECORDED_DATA]: any[] = [];

      // FIXME: property type should (ideally) be inferred
      @parameter<Sut, number>("b", record, record)
      set prop(b: number) {
        this[RECORDED_DATA].push(b);
      }
    }

    assert.deepEqual(Sut[Symbol.metadata]![RECORDED_DATA], [
      [
        { name: "b", index: 0, rest: false },
        { name: "b", index: 0, rest: false },
      ],
    ]);

    const sut = new Sut();
    sut.prop = 42;

    assert.deepEqual(sut[RECORDED_DATA], [42, 42, 42]);
  });

  void test("private setter", () => {
    const RECORDED_DATA = Symbol();
    function record<This extends { [RECORDED_DATA]: any[] }, Value>(
      _: undefined,
      context: ClassMethodParameterDecoratorContext,
    ) {
      assert.equal(context.kind, "parameter");
      assert.deepEqual(context.function, {
        kind: "setter",
        name: "#prop",
        static: false,
        private: true,
      });
      const { name, index, rest } = context;
      (((context.metadata[RECORDED_DATA] as Pick<
        ClassMethodParameterDecoratorContext,
        "name" | "index" | "rest"
      >[][]) ??= [])[index] ??= []).push({ name, index, rest });

      return function (this: This, value: Value) {
        this[RECORDED_DATA].push(value);
        return value;
      };
    }

    class Sut {
      [RECORDED_DATA]: any[] = [];

      // FIXME: property type should (ideally) be inferred
      @parameter<Sut, number>("b", record, record)
      set #prop(b: number) {
        this[RECORDED_DATA].push(b);
      }

      setProp(b: number) {
        this.#prop = b;
      }
    }

    assert.deepEqual(Sut[Symbol.metadata]![RECORDED_DATA], [
      [
        { name: "b", index: 0, rest: false },
        { name: "b", index: 0, rest: false },
      ],
    ]);

    const sut = new Sut();
    sut.setProp(42);

    assert.deepEqual(sut[RECORDED_DATA], [42, 42, 42]);
  });

  void test("static setter", () => {
    const RECORDED_DATA = Symbol();
    function record<Value>(
      _: undefined,
      context: ClassMethodParameterDecoratorContext,
    ) {
      assert.equal(context.kind, "parameter");
      assert.deepEqual(context.function, {
        kind: "setter",
        name: "prop",
        static: true,
        private: false,
      });
      const { name, index, rest } = context;
      (((context.metadata[RECORDED_DATA] as Pick<
        ClassMethodParameterDecoratorContext,
        "name" | "index" | "rest"
      >[][]) ??= [])[index] ??= []).push({ name, index, rest });

      return function (this: unknown, value: Value) {
        Sut[RECORDED_DATA].push(value);
        return value;
      };
    }

    class Sut {
      static [RECORDED_DATA]: any[] = [];

      // FIXME: property type should (ideally) be inferred
      @parameter<typeof Sut, number>("b", record, record)
      static set prop(b: number) {
        Sut[RECORDED_DATA].push(b);
      }
    }

    assert.deepEqual(Sut[Symbol.metadata]![RECORDED_DATA], [
      [
        { name: "b", index: 0, rest: false },
        { name: "b", index: 0, rest: false },
      ],
    ]);

    Sut.prop = 42;

    assert.deepEqual(Sut[RECORDED_DATA], [42, 42, 42]);
  });

  void test("private static setter", () => {
    const RECORDED_DATA = Symbol();
    function record<Value>(
      _: undefined,
      context: ClassMethodParameterDecoratorContext,
    ) {
      assert.equal(context.kind, "parameter");
      assert.deepEqual(context.function, {
        kind: "setter",
        name: "#prop",
        static: true,
        private: true,
      });
      const { name, index, rest } = context;
      (((context.metadata[RECORDED_DATA] as Pick<
        ClassMethodParameterDecoratorContext,
        "name" | "index" | "rest"
      >[][]) ??= [])[index] ??= []).push({ name, index, rest });

      return function (this: unknown, value: Value) {
        Sut[RECORDED_DATA].push(value);
        return value;
      };
    }

    class Sut {
      static [RECORDED_DATA]: any[] = [];

      // FIXME: property type should (ideally) be inferred
      @parameter<typeof Sut, number>("b", record, record)
      static set #prop(b: number) {
        Sut[RECORDED_DATA].push(b);
      }

      static setProp(b: number) {
        Sut.#prop = b;
      }
    }

    assert.deepEqual(Sut[Symbol.metadata]![RECORDED_DATA], [
      [
        { name: "b", index: 0, rest: false },
        { name: "b", index: 0, rest: false },
      ],
    ]);

    Sut.setProp(42);

    assert.deepEqual(Sut[RECORDED_DATA], [42, 42, 42]);
  });
});

void test("optional", () => {
  const RECORDED_DATA = Symbol();
  function record<This extends { [RECORDED_DATA]: string[] }>(name: string) {
    return function (
      _: undefined,
      context: ClassMethodParameterDecoratorContext<This>,
    ) {
      ((context.metadata[RECORDED_DATA] as string[]) ??= []).push(name);
      return function (this: This, value: number) {
        this[RECORDED_DATA].push(name);
        return value;
      };
    };
  }

  class Sut {
    [RECORDED_DATA]: string[] = [];

    @parameters<Sut>([
      record("first"),
      optional(record("second")),
      record("third"),
    ])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fn(opt?: number) {}
  }

  assert.deepEqual(Sut[Symbol.metadata]![RECORDED_DATA], [
    "third",
    "second",
    "first",
  ]);

  const sut = new Sut();
  sut.fn();
  assert.deepEqual(sut[RECORDED_DATA], ["third", "first"]);

  sut[RECORDED_DATA] = [];
  sut.fn(42);
  assert.deepEqual(sut[RECORDED_DATA], ["third", "second", "first"]);
});

void test("rest", () => {
  const RECORDED_DATA = Symbol();
  function record<This extends { [RECORDED_DATA]: any[][] }, Value>(
    _: undefined,
    context: ClassMethodParameterDecoratorContext<This>,
  ) {
    const { index } = context;
    return function (this: This, value: Value) {
      (this[RECORDED_DATA][index] ??= []).push(value);
      return value;
    };
  }
  class Sut {
    [RECORDED_DATA]: any[][] = [];

    @parameters<Sut>(record, record, record, [true, rest(record), record])
    fn(a: string, b: number, c: boolean, ...d: string[]) {
      this[RECORDED_DATA][0].push(a);
      this[RECORDED_DATA][1].push(b);
      this[RECORDED_DATA][2].push(c);
      this[RECORDED_DATA][3].push(d);
    }
  }

  const sut = new Sut();
  sut.fn("a", 42, true, "foo", "bar", "baz");

  assert.deepEqual(sut[RECORDED_DATA], [
    ["a", "a"],
    [42, 42],
    [true, true],
    [["foo", "bar", "baz"], "foo", "bar", "baz", ["foo", "bar", "baz"]],
  ]);
});
