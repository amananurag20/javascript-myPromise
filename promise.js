class myPromise {
    constructor(promiseCallback) {
      this.state = "pending"; // 'pending', 'fulfilled', or 'rejected' state.
      this.value = undefined; // initial value of the promise.
      this.handlers = []; // handlers for `then` and `catch` method
  
      // Resolve function of promise changing its state,value and executing onFulfilled handlers
      const resolve = (value) => {
        if (this.state === "pending") {
          this.state = "fulfilled";
          this.value = value;
          this.handlers.forEach((callback) => callback.onFulfilled(value));
        }
      };
  
      // Reject function of promise changing its state,value and executing rejected handlers
      const reject = (reason) => {
        if (this.state === "pending") {
          this.state = "rejected";
          this.value = reason;
          this.handlers.forEach((callback) => callback.onRejected(reason));
        }
      };
  
      // Execute the promiseCallback function here.
      try {
        promiseCallback(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  
    //this is promise concept which  i have applied in below code-
    //Here .then method is implemented where if promise is in pending state like for async task then the .then function actually registered the callback function in the promise handlers array for both onFullfilled and onRejected.
  
    //And if promise is not in pending state like for sync task then we must need to execute the callback function immediately as promise is already in fulfilled state or rejected state and in both case we need to resolve our new promise with the result of the callback function. only in case of any exception and if onRejected is not passed then we are rejecting our new promise with the error.
  
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
        console.log("this", this);
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
  
    //if any exception is being thrown in the then method then we are rejecting the promise with the error
    catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  }
  
  //Here i have just taken a simple example of promise to test the above code
  const promise = new myPromise((res, rej) => {
    setTimeout(() => {
      res("hello");
    }, 1000);
  });
  
  promise.then(() => {
    console.log("fulfilled");
  });
  