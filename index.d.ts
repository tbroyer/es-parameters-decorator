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
        readonly type: "class";

        /** The name of the decorated class. */
        readonly name: string | undefined;
      }
    | {
        /** The kind of class element that was decorated. */
        readonly type: "method" | "setter";

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

type ClassMethodParameterDecorator<This = unknown, Value = unknown> = (
  value: undefined,
  context: ClassMethodParameterDecoratorContext<This>,
) => ((this: This, value: Value) => Value) | void;

type ClassMethodParameterDecorators<This = unknown, Value = unknown> =
  | ClassMethodParameterDecorator<This, Value>
  | ClassMethodParameterDecorator<This, Value>[]
  | [name: string, ...decorators: ClassMethodParameterDecorator<This, Value>[]]
  | [
      name: string,
      rest: false,
      ...decorators: ClassMethodParameterDecorator<This, Value>[],
    ]
  | [
      name: string,
      rest: true,
      ...decorators: ClassMethodParameterDecorator<This, Value[]>[],
    ]
  | [rest: false, ...decorators: ClassMethodParameterDecorator<This, Value>[]]
  | [rest: true, ...decorators: ClassMethodParameterDecorator<This, Value[]>[]]
  | {
      name?: string | undefined;
      rest?: false | undefined;
      decorators: ClassMethodParameterDecorator<This, Value>[];
    }
  | {
      name?: string | undefined;
      rest: true;
      decorators: ClassMethodParameterDecorator<This, Value[]>[];
    };

type RemapMethodParametersToDecorators<This, Params extends unknown[]> = {
  [K in keyof Params]?:
    | ClassMethodParameterDecorators<This, Params[K]>
    | undefined;
};

/**
 * Returns a class decorator to apply parameter decorators to its constructor's parameters.
 *
 * The function takes as many arguments as there are parameters on the annotated class's constructor.
 * Each argument can be either:
 * - `undefined` to skip the parameter and not apply any parameter decorator to it
 * - a single parameter decorator
 * - an array of parameter decorators, optionally _prefixed_ with the parameter name and/or whether it is a `...` rest parameter
 * - an object with a `decorators` property as an array of parameter decorators, and optional properties `name` and `rest`
 *
 * @template Class The type of the decorated class.
 * @param decorators Sets of parameter decorators, one set per constructor parameter.
 */
export declare function parameters<
  Class extends abstract new (...args: any) => any = abstract new (
    ...args: any
  ) => any,
>(
  ...decorators: RemapMethodParametersToDecorators<
    Class,
    ConstructorParameters<Class>
  >
): (value: Class, context: ClassDecoratorContext<Class>) => Class | void;
/**
 * Returns a method decorator to apply parameter decorators to its parameters.
 *
 * The function takes as many arguments as there are parameters on the annotated method.
 * Each argument can be either:
 * - `undefined` to skip the parameter and not apply any parameter decorator to it
 * - a single parameter decorator
 * - an array of parameter decorators, optionally _prefixed_ with the parameter name and/or whether it is a `...` rest parameter
 * - an object with a `decorators` property as an array of parameter decorators, and optional properties `name` and `rest`
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated method.
 * @param decorators Sets of parameter decorators, one set per constructor parameter.
 */
export declare function parameters<
  This = unknown,
  Value extends (this: This, ...args: any) => any = (
    this: This,
    ...args: any
  ) => any,
>(
  ...decorators: RemapMethodParametersToDecorators<This, Parameters<Value>>
): (
  value: Value,
  context: ClassMethodDecoratorContext<This, Value>,
) => Value | void;

type ClassSetterParameterDecorators<This = unknown, Value = unknown> =
  | ClassMethodParameterDecorator<This, Value>
  | ClassMethodParameterDecorator<This, Value>[]
  | [name: string, ...decorators: ClassMethodParameterDecorator<This, Value>[]]
  | {
      name?: string | undefined;
      decorators: ClassMethodParameterDecorator<This, Value>[];
    };

/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated setter.
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<This = unknown, Value = unknown>(
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): (
  value: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
) => ((this: This, value: Value) => void) | void;
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated setter.
 * @param name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<This = unknown, Value = unknown>(
  name: string,
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): (
  value: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
) => ((this: This, value: Value) => void) | void;
/**
 * Returns a setter decorator to apply parameter decorators to its parameter.
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated setter.
 * @param decorators The parameter decorators to apply to the setter's parameter
 * @param decorators.name The name of the parameter, to make it available to parameter decorators in their {@linkplain ClassMethodParameterDecoratorContext.name context}
 * @param decorators.decorators The parameter decorators to apply to the setter's parameter
 */
export declare function parameter<This = unknown, Value = unknown>(decorators: {
  name?: string | undefined;
  decorators: ClassMethodParameterDecorator<This, Value>[];
}): (
  value: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
) => ((this: This, value: Value) => void) | void;

/**
 * Returns a parameter decorator that replaces any `undefined` value received by the parameter with the given value.
 *
 * This mimics the native _default parameter value syntax_ in function declarations, but applies that default value before the following parameter decorators.
 * Because parameter decorators are applied from last to first, the `defaultValue` decorator should likely come last.
 *
 * If other decorators don't need to see that default value, then you should prefer the native _default parameter value_ syntax in the function declaration.
 * In TypeScript, you'll want to use both to get the appropriate typing for the method (but note that the value declared in the function signature will actually be ignored).
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated parameter.
 * @param value The default value for the parameter.
 */
export declare function defaultValue<This, Value>(
  value: Value,
): ClassMethodParameterDecorator<This, Value>;

/**
 * Returns a parameter decorator that conditionally _applies_ a set of parameter decorators only to non-`undefined` parameter values.
 *
 * The decorators themselves are called when the class is initialized, but the function they return will only be called (when the annotated method is invoked) when the corresponding value is not `undefined`.
 *
 * To apply the decorators unconditionally, but never let them see an `undefined` value, use the {@link defaultValue} decorator instead.
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated parameter.
 * @param decorators The parameter decorators to be optionally _applied_.
 */
export declare function optional<This, Value>(
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): ClassMethodParameterDecorator<This, Value | undefined>;

/**
 * Returns a parameter decorator that applies a set of decorators to each value of a `...` rest parameter, rather than those values as an array.
 *
 * @template This The type on which the class element will be defined. For a static class element, this will be
 * the type of the constructor. For a non-static class element, this will be the type of the instance. For a class (constructor), this will be `undefined`.
 * @template Value The type of the decorated parameter.
 * @param decorators The parameter decorators to apply to all the rest argument values.
 */
export declare function rest<This, Value>(
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): ClassMethodParameterDecorator<This, Value[]>;
