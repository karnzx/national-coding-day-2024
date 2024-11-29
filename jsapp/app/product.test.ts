import { getProductPrice, Product } from "./product";

function expect(actual: any) {
  return {
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log(" ✅ PASS");
      } else {
        console.log(` ❌ FAIL: want ${expected} but got ${actual}`);
      }
    },
    toHaveBeenCalled: () => {
      if (actual.called === 1) {
        console.log(" ✅ PASS");
      } else {
        console.log(
          ` ❌ FAIL: should call once but got called ${actual.called} times`
        );
      }
    },
    toHaveBeenCalledWith: (...args: any[]) => {
      if (JSON.stringify(actual.args) === JSON.stringify(args)) {
        console.log(" ✅ PASS");
      } else {
        console.log(` ❌ FAIL: want ${args} but got ${actual.args}`);
      }
    },
  };
}

function test(title: string, callback: () => void) {
  console.group(title);
  callback();
  console.groupEnd();
}

// Challenge: write your own test with you own style for the following functions:
// products.ts getProductPrice function

// Dummy object: that not affact the test use for pass complie
test("Dummy: error product name and product id are required", () => {
  const dummy = {
    search: null,
  };
  try {
    getProductPrice(dummy, "", "");
  } catch (error) {
    expect(error.message).toEqual("Product name and product id are required");
  }
});

// Stub: return a canned value not null
// object always return the value no matter what and only single test use.
test("Stub: error product not found", () => {
  const stub = {
    search: (productName: string, productId: string) => {
      return null;
    },
  };
  try {
    getProductPrice(stub, "LAPTOP", "1234");
  } catch (error) {
    expect(error.message).toEqual("Product not found");
  }
});

test("Stub: get product price", () => {
  const product: Product = {
    productName: "Laptop",
    productId: "LAPTOP-123",
    price: 999.99,
  };

  const stub = {
    search: (productName: string, productId: string) => {
      return product;
    },
  };

  const actual = getProductPrice(stub, "Laptop", "LAPTOP-123");
  expect(actual).toEqual(999.99);
});

// Fake: simplified version of real implementation
// He told that Fake is Stub with If condition and can be resuable
const fakeFinder = {
  search: (productName: string, productId: string) => {
    if (productName === "Laptop" && productId == "LAPTOP-123") {
      return {
        productName: "Laptop",
        productId: "LAPTOP-123",
        price: 999.99,
      };
    }

    return null;
  },
};

test("Fake: get product price", () => {
  const actual = getProductPrice(fakeFinder, "Laptop", "LAPTOP-123");

  expect(actual).toEqual(999.99);
});

test("Fake: get product not found", () => {
  try {
    getProductPrice(fakeFinder, "Laptop", "LAPTOP-321");
  } catch (error) {
    expect(error.message).toEqual("Product not found");
  }
});

// Spy: Keeo track of the call made to the function
// Dynamic language need to check for function parameter type too.

function spyOn(obj: any, method: string = "search") {
  let spy = {
    called: 0,
    args: [],
  };

  const originalMethod = obj[method];

  spy[method] = (...args: any[]) => {
    spy.called++;
    spy.args = args;
    return originalMethod(...args);
  };

  return spy;
}

test("Spy: search should have been called once", () => {
  const stub = {
    search: (productName: string, productId: string) => {
      return { productName, productId, price: 999.99 };
    },
  };

  const spy = spyOn(stub, "search");

  const actual = getProductPrice(spy as any, "Laptop", "LAPTOP-123");

  expect(actual).toEqual(999.99);
  expect(spy).toHaveBeenCalled();
});

test("Spy: should call search with productName and productId", () => {
  const stub = {
    search: (productName: string, productId: string) => {
      return { productName, productId, price: 999.99 };
    },
  };

  const spy = spyOn(stub, "search");

  const actual = getProductPrice(spy as any, "Laptop", "LAPTOP-123");

  expect(actual).toEqual(999.99);
  expect(spy).toHaveBeenCalledWith("Laptop", "LAPTOP-123");
});

// Mocks: are pre-programmed with expectation which from a specification
// Mocks are used to define expectations about function calls.
// Spies are used to track function call without pre-setting expection
// Mocks can be use a lot in every test case but the test with take too much memory so
// use the right tool for the right test

function mock(obj: any) {
  const expectations: { method: string; args: any[]; returnValue: any }[] = [];
  const calls: { method: string; args: any[] }[] = [];

  // Create a mock for the given object and method
  const mockObj = {
    // Define the 'search' method on the mock object
    search: (...args: any[]) => {
      calls.push({ method: "search", args });

      // Find if the call matches any expectation
      const expectation = expectations.find(
        (exp) =>
          exp.method === "search" &&
          JSON.stringify(exp.args) === JSON.stringify(args)
      );

      // If a matching expectation is found, return the predefined return value
      if (expectation) {
        return expectation.returnValue;
      } else {
        // If no matching expectation, just return undefined (or could throw an error)
        throw new Error(
          `Unexpected call to search with arguments ${JSON.stringify(args)}`
        );
      }
    },

    // Set up an expectation for the 'search' method
    expect: (method: string) => ({
      withArgs: (...expectedArgs: any[]) => ({
        andReturn: (returnValue: any) => {
          if (method === "search") {
            // Store the expectation for the 'search' method
            expectations.push({ method, args: expectedArgs, returnValue });
          }
        },
      }),
    }),

    // Verify if all expectations were called with the correct arguments
    Verify: () => {
      return expectations.every((exp) => {
        return calls.some(
          (call) =>
            call.method === exp.method &&
            JSON.stringify(call.args) === JSON.stringify(exp.args)
        );
      });
    },
  };

  return mockObj;
}

test("Mocks: search should have call with expectations in mock", () => {
  const stub = {
    search: (productName: string, productId: string) => {
      return { productName: "AnuchitO", productId: "Nong", price: 888.88 };
    },
  };

  const mk = mock(stub);
  mk.expect("search").withArgs("Laptop", "LAPTOP-123").andReturn({
    productName: "Laptop",
    productId: "LAPTOP-123",
    price: 999.99,
  });

  const actual = getProductPrice(mk, "Laptop", "LAPTOP-123");

  expect(actual).toEqual(999.99);
  expect(mk.Verify()).toEqual(true);
});
