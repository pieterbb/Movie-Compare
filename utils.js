// Debounce function. Returns the input function but limits it to be executed once every X
const debounce = (func, delay = 1000) => {
  // return function with debounce wrapper
  let timeOutId;
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }

    timeOutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
