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
test("error product name and product id are required", () => {
  const dummy = {
    search: null,
  };
  try {
    getProductPrice(dummy, "", "");
  } catch (error) {
    expect(error.message).toEqual("Product name and product id are required");
  }
});
