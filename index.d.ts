/**
 * Context provided to a class method parameter decorator.
 *
 * @see {@link https://github.com/tc39/proposal-class-method-parameter-decorators/blob/4be5af502e54d27fd6b2cb7e37b9de8577e54c09/README.md | The TC39 Proposal}
 */
export interface ClassMethodParameterDecoratorContext<This = unknown> {
  readonly kind: "parameter";

  readonly name: string | undefined;

  readonly index: number;

  readonly rest: boolean;

  readonly function: {
    readonly type: "class" | "method" | "setter";

    readonly name: string | symbol | undefined;

    readonly static?: boolean | undefined;

    readonly private?: boolean | undefined;
  };

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
      rest: boolean,
      ...decorators: ClassMethodParameterDecorator<This, Value>[],
    ]
  | [rest: boolean, ...decorators: ClassMethodParameterDecorator<This, Value>[]]
  | {
      name?: string | undefined;
      rest?: boolean | undefined;
      decorators: ClassMethodParameterDecorator<This, Value>[];
    };

type RemapMethodParametersToDecorators<This, Params extends unknown[]> = {
  [K in keyof Params]?:
    | ClassMethodParameterDecorators<This, Params[K]>
    | undefined;
};

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

export declare function parameter<This = unknown, Value = unknown>(
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): (
  value: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
) => ((this: This, value: Value) => void) | void;
export declare function parameter<This = unknown, Value = unknown>(
  name: string,
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): (
  value: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
) => ((this: This, value: Value) => void) | void;
export declare function parameter<This = unknown, Value = unknown>(decorators: {
  name?: string | undefined;
  decorators: ClassMethodParameterDecorator<This, Value>[];
}): (
  value: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
) => ((this: This, value: Value) => void) | void;

export declare function optional<This, Value>(
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): ClassMethodParameterDecorator<This, Value | undefined>;

// TODO: should return …<…, Value[]> rather than …<…, Value>
export declare function rest<This, Value>(
  ...decorators: ClassMethodParameterDecorator<This, Value>[]
): ClassMethodParameterDecorator<This, Value>;
