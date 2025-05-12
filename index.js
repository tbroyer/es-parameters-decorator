const FUNCTION_KEYS = ["kind", "name", "static", "private"];

const CLASS_OR_METHOD_DECORATOR_KIND = ["class", "method"];

/** @type {import("./index.js").parameters} */
export function parameters(...decorators) {
  return function (classOrMethod, context) {
    if (!CLASS_OR_METHOD_DECORATOR_KIND.includes(context.kind)) {
      throw unsupportedDecoratorLocation(context);
    }

    const ctxTmpl = prepareContext(context);

    const params = prepareDecorators.call(this, decorators, ctxTmpl);
    if (params === undefined) {
      return;
    }

    switch (context.kind) {
      case "class":
        return class extends classOrMethod {
          constructor(...args) {
            applyDecorators.call(undefined, args, params);
            super(...args);
          }
        };
      case "method":
        return function (...args) {
          applyDecorators.call(this, args, params);
          return classOrMethod.apply(this, args);
        };
    }
  };
}

/** @type {import("./index.js").parameter} */
export function parameter(...decorators) {
  return function (setter, context) {
    if (context.kind !== "setter") {
      throw unsupportedDecoratorLocation(context);
    }

    const ctxTmpl = prepareContext(context);

    let name;
    ({ name, decorators } = normalizeSetterDecorators(decorators));

    const param = prepareDecoratorsForParam.call(this, decorators, {
      name,
      index: 0,
      rest: false,
      ...ctxTmpl,
    });
    if (param === undefined) {
      return;
    }

    return function (value) {
      value = param.call(this, value);
      setter.call(this, value);
    };
  };
}

/** @type {import("./index.js").defaultValue} */
export function defaultValue(def) {
  return function (_, context) {
    if (context.kind !== "parameter") {
      throw unsupportedDecoratorLocation(context);
    }
    return function (value) {
      return value === undefined ? def : value;
    };
  };
}

/** @type {import("./index.js").optional} */
export function optional(...decorators) {
  return function (_, context) {
    if (context.kind !== "parameter") {
      throw unsupportedDecoratorLocation(context);
    }
    const param = prepareDecoratorsForParam.call(this, decorators, context);
    if (param === undefined) {
      return;
    }
    return function (value) {
      if (value === undefined) {
        return undefined;
      }
      return param.call(this, value);
    };
  };
}

/** @type {import("./index.js").rest} */
export function rest(...decorators) {
  return function (_, context) {
    if (context.kind !== "parameter") {
      throw unsupportedDecoratorLocation(context);
    }
    if (context.rest !== true) {
      throw new Error(
        `rest() must be used on rest parameters (parameter ${context.index})`,
      );
    }
    const param = prepareDecoratorsForParam.call(this, decorators, {
      ...context,
      rest: false,
    });
    if (param === undefined) {
      return;
    }
    return function (values) {
      for (let i = 0; i < values.length; i++) {
        values[i] = param.call(this, values[i]);
      }
      return values;
    };
  };
}

/**
 * @param {{kind: string}} context
 * @returns {Error}
 */
function unsupportedDecoratorLocation(context) {
  return new Error(`Unsupported decorator location: ${context.kind}`);
}

/**
 * @param {ClassDecoratorContext | ClassMethodDecoratorContext | ClassSetterDecoratorContext} context
 * @returns {Omit<import("./index.js").ClassMethodParameterDecoratorContext, "name" | "index" | "rest">}
 */
function prepareContext(context) {
  const { addInitializer, metadata } = context;
  return {
    kind: "parameter",
    function: Object.fromEntries(
      Object.entries(context).filter(([name]) => FUNCTION_KEYS.includes(name)),
    ),
    addInitializer,
    metadata,
  };
}

/**
 * @template This
 * @this {This}
 * @param {ReadonlyArray<import("./index.js")._ClassMethodParameterDecorators<This>>} decorators
 * @param {Omit<import("./index.js").ClassMethodParameterDecoratorContext<This>, "name" | "index" | "rest">} ctxTmpl
 */
function prepareDecorators(decorators, ctxTmpl) {
  /** @type {Array<((<Value>(value: Value) => Value) & { rest?: true }) | undefined>} */
  const params = Array(decorators.length);
  for (let index = 0; index < decorators.length; index++) {
    const {
      name,
      rest,
      decorators: decs,
    } = normalizeMethodDecorators(decorators[index]);
    if (decs == null) {
      continue;
    }
    if (index < decorators.length - 1 && rest) {
      throw new Error("Only the final parameter can be a 'rest' parameter");
    }
    params[index] = prepareDecoratorsForParam.call(this, decs, {
      name,
      index,
      rest,
      // no need to deep-copy 'function', it'll be done in prepareDecoratorsForParam
      ...ctxTmpl,
    });
    if (rest && params[index]) {
      params[index].rest = rest;
    }
  }
  if (params.every((p) => p === undefined)) {
    return undefined;
  }
  return params;
}

/**
 * @template This
 * @template Value
 * @param {import("./index.js")._ClassMethodParameterDecorators<This, Value>} decorators
 * @returns {{name?: string | undefined, rest: boolean, decorators?: Array<import("./index.js")._ClassMethodParameterDecorator<This, Value>>}}
 */
function normalizeMethodDecorators(decorators) {
  if (decorators == null) {
    return {};
  }

  let name, rest;
  if (typeof decorators === "function") {
    decorators = [decorators];
  } else if (!Array.isArray(decorators)) {
    ({ name, rest, decorators } = decorators);
  } else if (typeof decorators[0] !== "function") {
    if (typeof decorators[0] === "string") {
      [name, ...decorators] = decorators;
    }
    if (typeof decorators[0] === "boolean") {
      [rest, ...decorators] = decorators;
    }
  }

  if (decorators.length === 0) {
    return {};
  }

  for (let i = 0; i < decorators.length; i++) {
    assertCallable(decorators[i], "Parameter decorators must be functions");
  }

  return { name, rest: rest ?? false, decorators };
}

/**
 * @template This
 * @template Value
 * @param {Parameters<import("./index.js").parameter<This, Value>>} decorators
 * @returns {{name?: string | undefined, decorators?: Array<import("./index.js")._ClassMethodParameterDecorator<This, Value>>}}
 */
function normalizeSetterDecorators(decorators) {
  if (decorators == null) {
    return {};
  }

  let name;
  switch (typeof decorators[0]) {
    case "string":
      [name, ...decorators] = decorators;
      break;
    case "object":
      ({ name, decorators } = decorators);
      break;
  }

  if (decorators.length === 0) {
    return {};
  }

  for (let i = 0; i < decorators.length; i++) {
    assertCallable(decorators[i], "Parameter decorators must be functions");
  }

  return { name, decorators };
}

/**
 * @template This
 * @template Value
 * @this {This}
 * @param {ReadonlyArray<import("./index.js")._ClassMethodParameterDecorator<This, Value>>} decorators
 * @param {import("./index.js").ClassMethodParameterDecoratorContext<This>} ctxTmpl
 */
function prepareDecoratorsForParam(decorators, ctxTmpl) {
  /** @type {Array<(value: Value) => Value>} */
  const init = [];
  for (let i = decorators.length - 1; i >= 0; i--) {
    let result = decorators[i].call(this, undefined, {
      ...ctxTmpl,
      function: { ...ctxTmpl.function },
    });
    if (result !== undefined) {
      init.push(
        assertCallable(
          result,
          "Parameter decorator must return a function, or undefined",
        ),
      );
    }
  }

  if (init.length === 0) {
    return undefined;
  }
  if (init.length === 1) {
    return init[0];
  }
  return function (value) {
    for (let i = init.length - 1; i >= 0; i--) {
      value = init[i].call(this, value);
    }
    return value;
  };
}

/**
 * @param {unknown} f
 * @param {string} msg
 * @returns {Function}
 */
function assertCallable(f, msg) {
  if (typeof f !== "function") {
    throw new TypeError(msg);
  }
  return f;
}

/**
 * @param {unknown[]} args
 * @param {ReadonlyArray<((<Value>(value: Value) => Value) & { rest?: true }) | undefined>} params
 */
function applyDecorators(args, params) {
  for (let i = 0; i < params.length; i++) {
    let p = params[i];
    if (p !== undefined) {
      if (p.rest) {
        args.splice(i, Infinity, ...p.call(this, args.slice(i)));
      } else {
        args[i] = p.call(this, args[i]);
      }
    }
  }
}
