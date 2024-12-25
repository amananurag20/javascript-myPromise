# Custom Implementation of a Promise Class (`myPromise`)

This README provides a structured explanation of the custom implementation of a `myPromise` class, mimicking the behavior of native JavaScript Promises.

---

## Overview
The `myPromise` class allows asynchronous operations to be handled in a structured way, adhering to the `Promise` specification. It implements the following core functionalities:

1. `then` for chaining and handling fulfilled promises.
2. `catch` for handling errors or rejected promises.

### Key Features:
- Internal state management (`pending`, `fulfilled`, `rejected`).
- Callback registration for `then` and `catch`.
- Handles both synchronous and asynchronous tasks.
- Supports chaining.

---

## Class Structure

### **1. Constructor**
The constructor initializes the state, value, and handlers for the promise. It accepts a `promiseCallback` function that defines the asynchronous operation.

```javascript
constructor(promiseCallback) {
  this.state = "pending"; // Initial state of the promise
  this.value = undefined; // Holds the resolved or rejected value
  this.handlers = []; // Stores onFulfilled and onRejected handlers

  // Internal resolve function
  const resolve = (value) => {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      this.handlers.forEach((callback) => callback.onFulfilled(value));
    }
  };

  // Internal reject function
  const reject = (reason) => {
    if (this.state === "pending") {
      this.state = "rejected";
      this.value = reason;
      this.handlers.forEach((callback) => callback.onRejected(reason));
    }
  };

  try {
    promiseCallback(resolve, reject); // Executes the promise logic
  } catch (error) {
    reject(error); // Handles any synchronous exceptions
  }
}
```

---

### **2. `.then` Method**
The `then` method registers callbacks for fulfilled or rejected states. It ensures proper chaining by returning a new `myPromise`.

#### Key Points:
- If the promise is still `pending`, the callbacks are queued in `handlers`.
- If the promise is already resolved or rejected, the callbacks are executed immediately.
- Handles exceptions thrown within the callbacks and propagates them to the next promise.

```javascript
then(onFulfilled, onRejected) {
  return new myPromise((resolve, reject) => {
    const handleCallback = () => {
      try {
        if (this.state === "fulfilled") {
          const result = onFulfilled ? onFulfilled(this.value) : this.value;
          resolve(result);
        } else if (this.state === "rejected") {
          if (onRejected) {
            const result = onRejected(this.value);
            resolve(result);
          } else {
            reject(this.value);
          }
        }
      } catch (error) {
        reject(error);
      }
    };

    if (this.state === "pending") {
      this.handlers.push({
        onFulfilled: handleCallback,
        onRejected: handleCallback,
      });
    } else {
      handleCallback();
    }
  });
}
```

---

### **3. `.catch` Method**
The `catch` method is syntactic sugar for handling rejected promises. It internally calls `then` with `undefined` for `onFulfilled` and provides the rejection handler.

```javascript
catch(onRejected) {
  return this.then(undefined, onRejected);
}
```

---

## Example Usage

### Testing the `myPromise` Implementation
The following demonstrates how to use the `myPromise` class with asynchronous operations:

```javascript
const promise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("hello");
  }, 1000);
});

promise
  .then((value) => {
    console.log("Fulfilled with value:", value);
    return "chained value";
  })
  .then((value) => {
    console.log("Chained value:", value);
  })
  .catch((error) => {
    console.error("Caught error:", error);
  });
```

#### Output:
```plaintext
Fulfilled with value: hello
Chained value: chained value
```

---

## Key Concepts

### **State Management**
- **Pending**: Initial state of the promise.
- **Fulfilled**: Resolved state with a value.
- **Rejected**: Rejected state with a reason.

### **Handler Execution**
- Callbacks registered via `then` or `catch` are stored in `handlers` when the promise is `pending`.
- When the state changes to `fulfilled` or `rejected`, the corresponding handlers are executed.

### **Chaining**
- Each `then` call returns a new `myPromise`, enabling chaining.
- The resolved value of one `then` is passed to the next.
- Exceptions are propagated down the chain until a `catch` handles them.

---

## Debugging Tips
1. **Log State Transitions**:
   Add `console.log` statements inside `resolve` and `reject` to trace state changes.
2. **Verify Callbacks**:
   Check the `handlers` array to ensure callbacks are correctly registered.
3. **Check Chaining**:
   Ensure each `then` returns a new `myPromise`.

---

## Advantages of this Implementation
1. Mimics the behavior of native JavaScript Promises closely.
2. Provides a deeper understanding of how promises work under the hood.
3. Fully supports asynchronous operations and chaining.
