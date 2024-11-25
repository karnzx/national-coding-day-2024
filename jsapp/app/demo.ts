// simple version if we don't have test library what we can do is just run the function and see the output

import { FizzBuzz } from './fizzbuzz'

const result = FizzBuzz()
if (result !== 55) {
  console.error("❌ FizzBuzz test failed")
  process.exit(1)
}
console.log("✅ FizzBuzz test passed")
