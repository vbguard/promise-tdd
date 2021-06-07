const ViktorPromise = require("./promise");
const t = setTimeout;

describe("Viktor promise: ", () => {
  let promise;
  let executorSpy;

  const successResult = 42;
  const errorResult = "We have error";

  beforeEach(() => {
    executorSpy = jest.fn((resolve, reject) =>
      t(() => resolve(successResult), 150)
    );
    promise = new ViktorPromise(executorSpy);
  });

  test("should exists and to be typeof function", () => {
    expect(ViktorPromise).toBeDefined();
    expect(typeof ViktorPromise).toBe("function");
  });

  test("instance should have methods: then, catch, finally", () => {
    expect(promise.then).toBeDefined();
    expect(promise.catch).toBeDefined();
    expect(promise.finally).toBeDefined();
  });

  test("should call executor function", () => {
    expect(executorSpy).toHaveBeenCalled();
  });

  test("should get data in then block and chain then", async () => {
    const result = await promise.then((num) => num).then((num) => num * 2);
    expect(result).toBe(successResult * 2);
    expect(result).not.toBe(successResult * 3);
  });

  test("should catch error", () => {
    const errorExecutor = (_, reject) => t(() => reject(errorResult), 150);
    const errorPromise = new ViktorPromise(errorExecutor);

    return new Promise((resolve) =>
      errorPromise.catch((err) => {
        expect(err).toBe(errorResult);
        resolve();
      })
    );
  });

  test("should call finally method", async () => {
    const finallySpy = jest.fn(() => {});
    await promise.finally(finallySpy);

    expect(finallySpy).toHaveBeenCalled();
  });
});
