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
