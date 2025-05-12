/**
 * Context provided to a class method parameter decorator.
 *
 * @template Type The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @see {@link https://github.com/tc39/proposal-class-method-parameter-decorators/blob/4be5af502e54d27fd6b2cb7e37b9de8577e54c09/README.md | The ECMAScript Proposal}
 */
export interface ClassMethodParameterDecoratorContext<This = unknown> {
  /** The kind of element that was decorated. */
  readonly kind: "parameter";

  /** The name of the decorated parameter, if known. */
  readonly name: string | undefined;

  /** The ordinal position of the parameter in the parameter list. */
  readonly index: number;

  /** Indicates whether the parameter is a `...` rest element. */
  readonly rest: boolean;

  /** Contains limited information about the function to which the parameter belongs. */
  readonly function:
    | {
        /** The kind of element that was decorated. */
        readonly kind: "class";

        /** The name of the decorated class. */
        readonly name: string | undefined;
      }
    | {
        /** The kind of class element that was decorated. */
        readonly kind: "method" | "setter";

        /** The name of the decorated class element. */
        readonly name: string | symbol;

        /** A value indicating whether the class element is a static (`true`) or instance (`false`) element. */
        readonly static: boolean;

        /** A value indicating whether the class element has a private name. */
        readonly private: boolean;
      };

  /**
   * Adds a callback to be invoked either after static methods are defined but before
   * static initializers are run (when decorating a `static` element), or before instance
   * initializers are run (when decorating a non-`static` element).
   */
  addInitializer(initializer: (this: This) => void): void;

  readonly metadata: DecoratorMetadata;
}

/**
 * Returns a method or class decorator to apply parameter decorators to its (constructor's) parameters.
 *
 * The function takes as many arguments as there are parameters on the annotated method or class constructor.
 * Each argument can be either:
 * - `undefined` to skip the parameter and not apply any parameter decorator to it
 * - a single parameter decorator
 * - an array of parameter decorators, optionally _prefixed_ with the parameter name and/or whether it is a `...` rest parameter
 * - an object with a `decorators` property as an array of parameter decorators, and optional properties `name` and `rest`
 *
 * @param decorators Sets of parameter decorators, one set per parameter of the annotated method or class constructor.
 */
export declare function parameters<
  Decorators extends _NonRestClassMethodParameterDecorators[],
  This extends _ExtractThis<Decorators> = _ExtractThis<Decorators>,
  Parameters extends
    _ExtractParameters<Decorators> = _ExtractParameters<Decorators>,
>(
  ...decorators: Decorators
): {
  // Method decorator
  (
    target: (...args: [...Parameters, ...any]) => any,
    context: ClassMethodDecoratorContext<This>,
  ): (...args: Parameters) => any;
  // Class decorator
  <
    Class extends This &
      (abstract new (...args: [...Parameters, ...any]) => any),
  >(
    target: Class,
    context: ClassDecoratorContext<Class>,
  ): Class;
};
export declare function parameters<
  NonFinalParams extends _NonRestClassMethodParameterDecorators[],
  FinalParam extends _RestClassMethodParameterDecorators,
  This extends _ExtractThis<[...NonFinalParams, FinalParam]> = _ExtractThis<
    [...NonFinalParams, FinalParam]
  >,
  Parameters extends [
    ..._ExtractParameters<NonFinalParams>,
    ..._ExtractParameter<_ExtractDecorators<FinalParam>>,
  ] = [
    ..._ExtractParameters<NonFinalParams>,
    ..._ExtractParameter<_ExtractDecorators<FinalParam>>,
  ],
>(
  ...decorators: [...NonFinalParams, FinalParam]
): {
  // Method decorator
  (
    target: (...args: Parameters) => any,
    context: ClassMethodDecoratorContext<This>,
  ): (...args: Parameters) => any;
  // Class decorator
  <Class extends This & (abstract new (...args: Parameters) => any)>(
    target: Class,
    context: ClassDecoratorContext<Class>,
  ): Class;
};

type _NonRestClassMethodParameterDecorators<This = unknown, Value = any> =
  | undefined
  | _ClassMethodParameterDecorator<This, Value, false>
  | [...decorators: _ClassMethodParameterDecorator<This, Value, false>[]]
  | [
      name: string,
      ...decorators: _ClassMethodParameterDecorator<This, Value, false>[],
    ]
  | [
      rest: false,
      ...decorators: _ClassMethodParameterDecorator<This, Value, false>[],
    ]
  | [
      name: string,
      rest: false,
      ...decorators: _ClassMethodParameterDecorator<This, Value, false>[],
    ]
  | {
      name?: string | undefined;
      rest?: false | undefined;
      decorators: _ClassMethodParameterDecorator<This, Value, false>[];
    };

type _RestClassMethodParameterDecorators<This = unknown, Value = any> =
  | [
      rest: true,
      ...decorators: _ClassMethodParameterDecorator<This, Value[], true>[],
    ]
  | [
      name: string,
      rest: true,
      ...decorators: _ClassMethodParameterDecorator<This, Value[], true>[],
    ]
  | {
      name?: string | undefined;
      rest: true;
      decorators: _ClassMethodParameterDecorator<This, Value[], true>[];
    };

type _ClassMethodParameterDecorators<This = unknown, Value = any> =
  | _NonRestClassMethodParameterDecorators<This, Value>
  | _RestClassMethodParameterDecorators<This, Value>;

type _ClassMethodParameterDecorator<This, Value, Rest extends boolean> = (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This> & {
    rest: Rest;
  },
) => void | ((value: Value) => Value);

type _ExtractParameters<Decorators extends _ClassMethodParameterDecorators[]> =
  {
    [K in keyof Decorators]: _ExtractParameter<
      _ExtractDecorators<Decorators[K]>
    >;
  };

type _ExtractDecorators<Decorators extends _ClassMethodParameterDecorators> =
  Decorators extends undefined
    ? undefined
    : Decorators extends _ClassMethodParameterDecorator<unknown, any, boolean>
      ? [Decorators]
      : Decorators extends _ClassMethodParameterDecorator<
            unknown,
            any,
            boolean
          >[]
        ? Decorators
        : Decorators extends [
              name: string,
              rest: boolean,
              ...decorators: infer D extends _ClassMethodParameterDecorator<
                unknown,
                any,
                boolean
              >[],
            ]
          ? D
          : Decorators extends [
                name: string,
                ...decorators: infer D extends _ClassMethodParameterDecorator<
                  unknown,
                  any,
                  boolean
                >[],
              ]
            ? D
            : Decorators extends [
                  rest: boolean,
                  ...decorators: infer D extends _ClassMethodParameterDecorator<
                    unknown,
                    any,
                    boolean
                  >[],
                ]
              ? D
              : Decorators extends {
                    decorators: infer D extends _ClassMethodParameterDecorator<
                      unknown,
                      any,
                      boolean
                    >[];
                  }
                ? D
                : never;

type _ExtractParameter<
  Decorators extends
    | undefined
    | _ClassMethodParameterDecorator<unknown, any, never>[],
> = Decorators extends undefined
  ? any
  : _ExtractParameter_<Exclude<Decorators, undefined>>;

type _ExtractParameter_<
  Decorators extends _ClassMethodParameterDecorator<unknown, any, never>[],
> = _UnknownToAny<
  _UnionToIntersection<
    {
      [K in keyof Decorators]: _ExtractParameterFromResult<
        ReturnType<Decorators[K]>
      >;
    }[number]
  >
>;

type _UnknownToAny<T> = unknown extends T ? any : T;

type _UnionToIntersection<T> =
  boolean extends _UnknownToNever<T>
    ? boolean & _UnionToIntersectionHelper<Exclude<T, boolean>>
    : _UnionToIntersectionHelper<T>;

type _UnionToIntersectionHelper<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;

type _UnknownToNever<T> = unknown extends T ? never : T;

type _ExtractParameterFromResult<
  Result extends void | ((value: unknown) => any),
> = ReturnType<Exclude<Result, void>>;

type _ExtractThis<Decorators extends _ClassMethodParameterDecorators[]> =
  _UnionToIntersection<
    {
      [K in keyof Decorators]: _UnknownToNever<
        _ExtractThis_<_ExtractDecorators<Decorators[K]>>
      >;
    }[number]
  >;

type _ExtractThis_<
  Decorators extends
    | undefined
    | _ClassMethodParameterDecorator<unknown, any, never>[],
> = Decorators extends undefined
  ? unknown
  : _ExtractThisFromDecorators<Exclude<Decorators, undefined>>;

type _ExtractThisFromDecorators<
  Decorators extends _ClassMethodParameterDecorator<unknown, any, never>[],
> = _UnionToIntersection<
  {
    [K in keyof Decorators]: _UnknownToNever<
      _ExtractThisFromDecorator<Decorators[K]>
    >;
  }[number]
>;

type _ExtractThisFromDecorator<
  Decorator extends _ClassMethodParameterDecorator<unknown, any, never>,
> = _ExtractThisFromContext<Parameters<Decorator>[1]>;

type _ExtractThisFromContext<
  Context extends ClassMethodParameterDecoratorContext,
> = ThisParameterType<Parameters<Context["addInitializer"]>[0]>;

/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Decorators extends _ClassMethodParameterDecorator<unknown, any, false>[],
>(
  ...decorators: Decorators
): <Value extends _ExtractParameter<Decorators>>(
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>,
    Value
  >,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @param name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Decorators extends _ClassMethodParameterDecorator<unknown, any, false>[],
>(
  name: string,
  ...decorators: Decorators
): <Value extends _ExtractParameter<Decorators>>(
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>,
    Value
  >,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @param decorators The parameter decorators to apply to the setter's parameter
 * @param decorators.name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators.decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Decorators extends _ClassMethodParameterDecorator<unknown, any, false>[],
>(decorators: {
  name?: string | undefined;
  decorators: Decorators;
}): <Value extends _ExtractParameter<Decorators>>(
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>,
    Value
  >,
) => void | ((value: Value) => void);

/**
 * Returns a parameter decorator that replaces any `undefined` value received by the parameter with the given value.
 *
 * This mimics the native _default parameter value syntax_ in function declarations, but applies that default value before the following parameter decorators (and class/method/setter decorators).
 * Because parameter decorators are applied first-to-last, the `defaultValue` decorator should likely come first.
 *
 * If other decorators (parameter or class/method/setter) don't need to see that default value, then you should prefer the native _default parameter value_ syntax in the function declaration.
 * In TypeScript, you'll want to use both to get the appropriate typing for the method (but note that the value declared in the function signature will actually be ignored).
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated parameter.
 * @param value The default value for the parameter.
 */
export declare function defaultValue<This, Value>(
  value: Value,
): (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
) => (value: Value) => Value;

/**
 * Returns a parameter decorator that conditionally _applies_ a set of parameter decorators only to non-`undefined` parameter values.
 *
 * The decorators themselves are called when the class is initialized, but the function they return will only be called (when the annotated method is invoked) when the corresponding value is not `undefined`.
 *
 * To apply the decorators unconditionally, but never let them see an `undefined` value, use the {@link defaultValue} decorator instead.
 *
 * @param decorators The parameter decorators to be optionally _applied_.
 */
export declare function optional<
  Decorators extends _ClassMethodParameterDecorator<unknown, any, false>[],
>(
  ...decorators: Decorators
): (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>
  >,
) => void | ((value: unknown) => undefined | _ExtractParameter<Decorators>);

/**
 * Returns a parameter decorator that applies a set of decorators to each value of a `...` rest parameter, rather than those values as an array.
 *
 * @param decorators The parameter decorators to apply to all the rest argument values.
 */
export declare function rest<
  Decorators extends _ClassMethodParameterDecorator<unknown, any, false>[],
>(
  ...decorators: Decorators
): (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>
  > & {
    rest: true;
  },
) => void | ((value: unknown) => _ExtractParameter<Decorators>[]);
