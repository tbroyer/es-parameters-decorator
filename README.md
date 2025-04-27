# parameters-decorator

This library exports [ECMAScript decorators](https://github.com/tc39/proposal-decorators) that adds support for [parameter decorators](https://github.com/tc39/proposal-class-method-parameter-decorators/blob/4be5af502e54d27fd6b2cb7e37b9de8577e54c09/README.md)

Only standard decorators are supported, not TypeScript _experimental_ decorators;
it's tested with both Babel's [`@babel/plugin-proposal-decorators`](https://babeljs.io/docs/babel-plugin-proposal-decorators) and TypeScript 5+.

## API

Note that below, when it's said that a parameter decorator is conditionally applied, or that it will be applied to specific values, this is only about the function that such a parameter decorator can return.
The parameter decorator itself will only be called once, and unconditionally, when the class is initialized; the returned function will be called (or maybe not) each time the annotated method is invoked.

### @parameters()

The `parameters` decorator can annotate classes or class methods and allows applying parameter decorators to their parameters (or the parameters of the class constructor).
Note that because the parameter name, or whether the parameter is a _rest_ parameter of a _variadic_ function, cannot be determined at runtime, those informations must be specified explicitly.

The `parameters` decorator takes as many arguments as the function it annotates, where each argument represents the decorator(s) to apply to the corresponding function parameter.
Those can thus take different forms:

- `undefined` to _skip_ the parameter and not apply any decorator to it
- a single parameter decorator
- an array of parameter decorators, optionally _prefixed_ with the parameter name and/or whether it's a _rest_ parameter (both optional but in this order)
- an object with a `decorators` property as an array of parameter decorators, and optional properties `name` and `rest`

The following example, using the syntax from the ECMAScript proposal:

```js
class Cls {
  constructor(@A param1, param2, @B @C param3) { }

  method(@D @E param1, @F @G param2, @H ...rest) { }
}
```

can be written using the `parameters` decorator as (examplifying the various forms):

```js
@parameters(A, undefined, { name: "param3", decorators: [B, C] })
class Cls {
  constructor(param1, param2, param3) {}

  @parameters(["param1", D, E], [F, G], ["rest", true, H])
  method(param1, param2, ...rest) {}
}
```

### @parameter()

The `parameter` decorator is the equivalent of `parameters` but for a _setter_.
Because there can only be a single parameter, it takes an optional parameter name as the first argument, followed by a list of parameter decorators.
It can also take a single object as argument with a `decorators` property as an array of parameter decorators, and an optional `name` property.

```js
class Cls {
  @parameter("value", A, B)
  set prop1(value) {}

  @parameter(A)
  set prop2(value) {}
}
```

### @rest()

The `rest` parameter decorator allows applying a set of parameter decorators to each value of a _rest_ parameter (each argument of the actual invocation) rather than the array of values.

```js
class Cls {
  @parameters([true, rest(A, B)])
  method(...rest) {}
}

// The A and B decorators will each be called 3 times,
// for each one of the "one", "two", and "three" values.
new Cls().method("one", "two", "three");
```

### @defaultValue()

The `defaultValue` parameter decorator allows assigning a default value to an optional parameter _before_ other decorators are applied.
Because decorators are applied from last to first, this decorator should generally come last.

If other decorators don't need to see that default value, then you should prefer the native _default parameter value_ syntax in the function declaration.
In TypeScript, you'll want to use both to get the appropriate typing for the method (but note that the value declared in the function signature will actually be ignored).

```js
class Cls {
  // The decorator can see an `undefined` value
  @parameters(A)
  method1(param = -1) {}

  // The decorator will never see an `undefined` value
  @parameters([A, defaultValue(-1)])
  method(param) {}
}
```

### @optional()

The `optional` parameter decorator allows only applying a set of parameter decorators to argument values that aren't `undefined`, i.e. when an optional parameter is _not_ omitted.

```js
class Cls {
  @parameters(optional(A, B))
  method(param) {}
}

// The A and B decorators won't be called
new Cls().method();

// The A and B decorators will be called with the 42 value
new Cls().method(42);
```
