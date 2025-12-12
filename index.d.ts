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
  Parameters extends _ExtractParameters<Decorators> =
    _ExtractParameters<Decorators>,
  ContextConstraints extends _ExtractContextConstraints<Decorators> =
    _ExtractContextConstraints<Decorators>,
>(
  ...decorators: Decorators
): {
  // Method decorator
  (
    target: (...args: [...Parameters, ...any]) => any,
    context: ClassMethodDecoratorContext<This> & ContextConstraints,
  ): (...args: Parameters) => any;
  // Class decorator
  <
    Class extends This &
      (abstract new (...args: [...Parameters, ...any]) => any),
  >(
    target: Class,
    context: ClassDecoratorContext<Class> & ContextConstraints,
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
  ContextConstraints extends _ExtractContextConstraints<
    [...NonFinalParams, FinalParam]
  > = _ExtractContextConstraints<[...NonFinalParams, FinalParam]>,
>(
  ...decorators: [...NonFinalParams, FinalParam]
): {
  // Method decorator
  (
    target: (...args: Parameters) => any,
    context: ClassMethodDecoratorContext<This> & ContextConstraints,
  ): (...args: Parameters) => any;
  // Class decorator
  <Class extends This & (abstract new (...args: Parameters) => any)>(
    target: Class,
    context: ClassDecoratorContext<Class>,
  ): Class;
};
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
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template Parameters The types of the parameters
 * @template This The type on which the class element will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param decorators Sets of parameter decorators, one set per parameter of the annotated method or class constructor.
 */
export declare function parameters<
  Parameters extends unknown[],
  This = unknown,
  ContextConstraints extends {
    kind?: "class" | "method" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    kind?: "class" | "method" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(
  ...decorators: {
    [K in keyof Parameters]: _NonRestClassMethodParameterDecorators<
      NoInfer<This>,
      Parameters[K],
      { kind: "class" | "method" } & NoInfer<ContextConstraints>
    >;
  }
): {
  // Method decorator
  (
    target: (...args: [...Parameters, ...any]) => any,
    context: ClassMethodDecoratorContext<This> & ContextConstraints,
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
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template NonFinalParams The types of the non-rest parameters
 * @template RestParam The type of the rest parameter's elements
 * @template This The type on which the class element will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param decorators Sets of parameter decorators, one set per parameter of the annotated method or class constructor.
 */
export declare function parameters<
  NonFinalParams extends unknown[],
  RestParam,
  This = unknown,
  ContextConstraints extends {
    kind?: "class" | "method" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    kind?: "class" | "method" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(
  ...decorators: [
    ...{
      [K in keyof NonFinalParams]: _NonRestClassMethodParameterDecorators<
        NoInfer<This>,
        NonFinalParams[K],
        { kind: "class" | "method" } & NoInfer<ContextConstraints>
      >;
    },
    _RestClassMethodParameterDecorators<
      NoInfer<This>,
      NoInfer<RestParam>,
      { kind: "class" | "method" } & NoInfer<ContextConstraints>
    >,
  ]
): {
  // Method decorator
  (
    target: (...args: [...NonFinalParams, RestParam]) => any,
    context: ClassMethodDecoratorContext<This> & ContextConstraints,
  ): (...args: [...NonFinalParams, RestParam]) => any;
  // Class decorator
  <
    Class extends This &
      (abstract new (...args: [...NonFinalParams, RestParam]) => any),
  >(
    target: Class,
    context: ClassDecoratorContext<Class>,
  ): Class;
};

type _NonRestClassMethodParameterDecorators<
  This = unknown,
  Value = any,
  ContextConstraints = unknown,
> =
  | undefined
  | _ClassMethodParameterDecorator<
      This,
      Value,
      undefined,
      false,
      ContextConstraints
    >
  | [
      ...decorators: _ClassMethodParameterDecorator<
        This,
        Value,
        undefined,
        false,
        ContextConstraints
      >[],
    ]
  | [
      name: string,
      ...decorators: _ClassMethodParameterDecorator<
        This,
        Value,
        string,
        false,
        ContextConstraints
      >[],
    ]
  | [
      rest: false,
      ...decorators: _ClassMethodParameterDecorator<
        This,
        Value,
        undefined,
        false,
        ContextConstraints
      >[],
    ]
  | [
      name: string,
      rest: false,
      ...decorators: _ClassMethodParameterDecorator<
        This,
        Value,
        string,
        false,
        ContextConstraints
      >[],
    ]
  | {
      name: string;
      rest?: false | undefined;
      decorators: _ClassMethodParameterDecorator<
        This,
        Value,
        string,
        false,
        ContextConstraints
      >[];
    }
  | {
      name?: undefined;
      rest?: false | undefined;
      decorators: _ClassMethodParameterDecorator<
        This,
        Value,
        undefined,
        false,
        ContextConstraints
      >[];
    };

type _RestClassMethodParameterDecorators<
  This = unknown,
  Value = any,
  ContextConstraints = unknown,
> =
  | [
      rest: true,
      ...decorators: _ClassMethodParameterDecorator<
        This,
        Value[],
        undefined,
        true,
        ContextConstraints
      >[],
    ]
  | [
      name: string,
      rest: true,
      ...decorators: _ClassMethodParameterDecorator<
        This,
        Value[],
        string,
        true,
        ContextConstraints
      >[],
    ]
  | {
      name: string;
      rest: true;
      decorators: _ClassMethodParameterDecorator<
        This,
        Value[],
        string,
        true,
        ContextConstraints
      >[];
    }
  | {
      name?: undefined;
      rest: true;
      decorators: _ClassMethodParameterDecorator<
        This,
        Value[],
        undefined,
        true,
        ContextConstraints
      >[];
    };

type _ClassMethodParameterDecorators<This = unknown, Value = any> =
  | _NonRestClassMethodParameterDecorators<This, Value>
  | _RestClassMethodParameterDecorators<This, Value>;

type _ClassMethodParameterDecorator<
  This,
  Value,
  Name extends string | undefined,
  Rest extends boolean,
  ContextConstraints,
> = (
  target: undefined,
  context: Omit<ClassMethodParameterDecoratorContext<This>, "function"> & {
    name: Name;
    rest: Rest;
    function: {
      kind: ContextConstraints extends { kind: unknown }
        ? ContextConstraints["kind"]
        : never;
      name: ContextConstraints extends { name: unknown }
        ? ContextConstraints["name"]
        : never;
      static: ContextConstraints extends { static: unknown }
        ? ContextConstraints["static"]
        : never;
      private: ContextConstraints extends { private: unknown }
        ? ContextConstraints["private"]
        : never;
    };
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
    : Decorators extends _ClassMethodParameterDecorator<
          unknown,
          any,
          string | undefined,
          boolean,
          unknown
        >
      ? [Decorators]
      : Decorators extends _ClassMethodParameterDecorator<
            unknown,
            any,
            string | undefined,
            boolean,
            unknown
          >[]
        ? Decorators
        : Decorators extends [
              name: string,
              rest: boolean,
              ...decorators: infer D extends _ClassMethodParameterDecorator<
                unknown,
                any,
                string | undefined,
                boolean,
                unknown
              >[],
            ]
          ? D
          : Decorators extends [
                name: string,
                ...decorators: infer D extends _ClassMethodParameterDecorator<
                  unknown,
                  any,
                  string | undefined,
                  boolean,
                  unknown
                >[],
              ]
            ? D
            : Decorators extends [
                  rest: boolean,
                  ...decorators: infer D extends _ClassMethodParameterDecorator<
                    unknown,
                    any,
                    string | undefined,
                    boolean,
                    unknown
                  >[],
                ]
              ? D
              : Decorators extends {
                    decorators: infer D extends _ClassMethodParameterDecorator<
                      unknown,
                      any,
                      string | undefined,
                      boolean,
                      unknown
                    >[];
                  }
                ? D
                : never;

type _ExtractParameter<
  Decorators extends
    | undefined
    | _ClassMethodParameterDecorator<unknown, any, never, never, unknown>[],
> = Decorators extends undefined
  ? any
  : _ExtractParameter_<Exclude<Decorators, undefined>>;

type _ExtractParameter_<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    never,
    never,
    unknown
  >[],
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
    | _ClassMethodParameterDecorator<unknown, any, never, never, unknown>[],
> = Decorators extends undefined
  ? unknown
  : _ExtractThisFromDecorators<Exclude<Decorators, undefined>>;

type _ExtractThisFromDecorators<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    never,
    never,
    unknown
  >[],
> = _UnionToIntersection<
  {
    [K in keyof Decorators]: _UnknownToNever<
      _ExtractThisFromDecorator<Decorators[K]>
    >;
  }[number]
>;

type _ExtractThisFromDecorator<
  Decorator extends _ClassMethodParameterDecorator<
    unknown,
    any,
    never,
    never,
    unknown
  >,
> = _ExtractThisFromContext<Parameters<Decorator>[1]>;

type _ExtractThisFromContext<
  Context extends ClassMethodParameterDecoratorContext,
> = ThisParameterType<Parameters<Context["addInitializer"]>[0]>;

type _ExtractContextConstraints<
  Decorators extends _ClassMethodParameterDecorators[],
> = _UnionToIntersection<
  {
    [K in keyof Decorators]: _ExtractContextConstraints_<
      _ExtractDecorators<Decorators[K]>
    >;
  }[number]
>;

type _ExtractContextConstraints_<
  Decorators extends
    | undefined
    | _ClassMethodParameterDecorator<unknown, any, never, never, unknown>[],
> = Decorators extends undefined
  ? any
  : _ExtractContextConstraintsFromDecorators<Exclude<Decorators, undefined>>;

type _ExtractContextConstraintsFromDecorators<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    never,
    never,
    unknown
  >[],
> = _UnionToIntersection<
  {
    [K in keyof Decorators]: _Function<
      Parameters<Decorators[K]>[1]["function"]
    >;
  }[number]
>;

type _Function<
  Function extends ClassMethodParameterDecoratorContext["function"],
> = {
  kind: Function["kind"];
  name: Function["name"];
  static?: Function extends { static: unknown }
    ? Function["static"]
    : undefined;
  private?: Function extends { private: unknown }
    ? Function["private"]
    : undefined;
};

/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    undefined,
    false,
    { kind: "setter" }
  >[],
  ContextConstraints extends
    _ExtractContextConstraintsFromDecorators<Decorators> =
    _ExtractContextConstraintsFromDecorators<Decorators>,
>(
  ...decorators: Decorators
): <Value extends _ExtractParameter<Decorators>>(
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>,
    Value
  > &
    ContextConstraints,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @param name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    string,
    false,
    { kind: "setter" }
  >[],
  ContextConstraints extends
    _ExtractContextConstraintsFromDecorators<Decorators> =
    _ExtractContextConstraintsFromDecorators<Decorators>,
>(
  name: string,
  ...decorators: Decorators
): <Value extends _ExtractParameter<Decorators>>(
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>,
    Value
  > &
    ContextConstraints,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @param decorators The parameter decorators to apply to the setter's parameter
 * @param decorators.name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators.decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    string,
    false,
    { kind: "setter" }
  >[],
  ContextConstraints extends
    _ExtractContextConstraintsFromDecorators<Decorators> =
    _ExtractContextConstraintsFromDecorators<Decorators>,
>(decorators: {
  name: string;
  decorators: Decorators;
}): <Value extends _ExtractParameter<Decorators>>(
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>,
    Value
  > &
    ContextConstraints,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @param decorators The parameter decorators to apply to the setter's parameter
 * @param decorators.decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    undefined,
    false,
    { kind: "setter" }
  >[],
  ContextConstraints extends
    _ExtractContextConstraintsFromDecorators<Decorators> =
    _ExtractContextConstraintsFromDecorators<Decorators>,
>(decorators: {
  name?: undefined;
  decorators: Decorators;
}): <Value extends _ExtractParameter<Decorators>>(
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>,
    Value
  > &
    ContextConstraints,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template Value The type of the parameter
 * @template This The type on which the setter will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Value,
  This = unknown,
  ContextConstraints extends {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(
  ...decorators: _ClassMethodParameterDecorator<
    NoInfer<This>,
    NoInfer<Value>,
    undefined,
    false,
    { kind: "setter" } & NoInfer<ContextConstraints>
  >[]
): (
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value> & ContextConstraints,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template Value The type of the parameter
 * @template This The type on which the setter will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Value,
  This = unknown,
  ContextConstraints extends {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(
  name: string,
  ...decorators: _ClassMethodParameterDecorator<
    NoInfer<This>,
    NoInfer<Value>,
    string,
    false,
    { kind: "setter" } & NoInfer<ContextConstraints>
  >[]
): (
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value> & ContextConstraints,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template Value The type of the parameter
 * @template This The type on which the setter will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param decorators The parameter decorators to apply to the setter's parameter
 * @param decorators.name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators.decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Value,
  This = unknown,
  ContextConstraints extends {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(decorators: {
  name: string;
  decorators: _ClassMethodParameterDecorator<
    NoInfer<This>,
    NoInfer<Value>,
    string,
    false,
    { kind: "setter" } & NoInfer<ContextConstraints>
  >[];
}): (
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value> & ContextConstraints,
) => void | ((value: Value) => void);
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template Value The type of the parameter
 * @template This The type on which the setter will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param decorators The parameter decorators to apply to the setter's parameter
 * @param decorators.decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<
  Value,
  This = unknown,
  ContextConstraints extends {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(decorators: {
  name?: undefined;
  decorators: _ClassMethodParameterDecorator<
    NoInfer<This>,
    NoInfer<Value>,
    undefined,
    false,
    { kind: "setter" } & NoInfer<ContextConstraints>
  >[];
}): (
  value: (value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value> & ContextConstraints,
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
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    string | undefined,
    false,
    unknown
  >[],
>(
  ...decorators: Decorators
): (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>
  > &
    _ExtractContext<Decorators>,
) => void | ((value: unknown) => undefined | _ExtractParameter<Decorators>);
/**
 * Returns a parameter decorator that conditionally _applies_ a set of parameter decorators only to non-`undefined` parameter values.
 *
 * The decorators themselves are called when the class is initialized, but the function they return will only be called (when the annotated method is invoked) when the corresponding value is not `undefined`.
 *
 * To apply the decorators unconditionally, but never let them see an `undefined` value, use the {@link defaultValue} decorator instead.
 *
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template Value The type of the parameter
 * @template This The type on which the class element will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param decorators The parameter decorators to be optionally _applied_.
 */
export declare function optional<
  Value,
  This = unknown,
  ContextConstraints extends {
    kind?: "class" | "method" | "setter" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    kind?: "class" | "method" | "setter" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(
  ...decorators: _ClassMethodParameterDecorator<
    NoInfer<This>,
    NoInfer<Value>,
    string | undefined,
    false,
    NoInfer<ContextConstraints>
  >[]
): (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This> & {
    rest: false;
    function: ContextConstraints;
  },
) => void | ((value: Value) => Value);

type _ExtractContext<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    never,
    never,
    unknown
  >[],
> = _UnionToIntersection<
  {
    [K in keyof Decorators]: Parameters<Decorators[K]>[1];
  }[number]
>;

/**
 * Returns a parameter decorator that applies a set of decorators to each value of a `...` rest parameter, rather than those values as an array.
 *
 * @param decorators The parameter decorators to apply to all the rest argument values.
 */
export declare function rest<
  Decorators extends _ClassMethodParameterDecorator<
    unknown,
    any,
    string | undefined,
    false,
    unknown
  >[],
>(
  ...decorators: Decorators
): (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<
    _ExtractThisFromDecorators<Decorators>
  > &
    Omit<_ExtractContext<Decorators>, "rest"> & {
      rest: true;
    },
) => void | ((value: unknown) => _ExtractParameter<Decorators>[]);
/**
 * Returns a parameter decorator that applies a set of decorators to each value of a `...` rest parameter, rather than those values as an array.
 *
 * This overload is meant to be used with explicit type arguments, for when type inference fails to correctly infer the return type.
 *
 * @template Value The type of the parameter
 * @template This The type on which the class element will be defined.
 * @template ContextConstraints Constraints applied to the decorator context
 * @param decorators The parameter decorators to apply to all the rest argument values.
 */
export declare function rest<
  Value,
  This = unknown,
  ContextConstraints extends {
    kind?: "class" | "method" | "setter" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  } = {
    kind?: "class" | "method" | "setter" | undefined;
    name?: string | symbol | undefined;
    static?: boolean | undefined;
    private?: boolean | undefined;
  },
>(
  ...decorators: _ClassMethodParameterDecorator<
    NoInfer<This>,
    NoInfer<Value>,
    string | undefined,
    false,
    NoInfer<ContextConstraints>
  >[]
): (
  target: undefined,
  context: ClassMethodParameterDecoratorContext<This> & {
    rest: true;
    function: ContextConstraints;
  },
) => void | ((value: Value) => Value);
