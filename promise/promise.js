function noop() {}

class ViktorPromise {
  constructor(executor) {
    this.queue = [];
    this.errorHandler = noop;
    this.finallyHandler = noop;

    try {
      executor.call(null, this.onResolve.bind(this), this.onReject.bind(this));
    } catch (error) {
      this.errorHandler(error);
    } finally {
      this.finallyHandler();
    }
  }

  onResolve(data) {
    this.queue.forEach((cb) => {
      data = cb(data);
    });

    this.finallyHandler();
  }

  onReject(error) {
    this.errorHandler(error);
    this.finallyHandler();
  }

  then(fn) {
    this.queue.push(fn);
    return this;
  }

  catch(fn) {
    this.errorHandler = fn;
    return this;
  }

  finally(fn) {
    this.finallyHandler(fn);
    return this;
  }
}

// const promise = new ViktorPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("RxJS");
//   }, 150);
// });

// promise
//   .then((value) => {
//     value.toUpperCase();
//   })
//   .then((value) => {
//     console.log("ViktorPromise: ", value);
//   })
//   .catch((err) => {
//     console.error(err);
//   })
//   .finally(() => {
//     console.log("finally");
//   });

module.exports = ViktorPromise;
