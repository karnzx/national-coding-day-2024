import { getProductPrice, Product } from "./product";

function expect(actual: any) {
  return {
    toEqual: (expected: any) => {
      if (actual === expected) {
        console.log(" ✅ PASS");
      } else {
        console.log(` ❌ FAIL: want ${expected} but got ${actual}`);
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
