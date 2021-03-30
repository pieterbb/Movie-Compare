// Autocomplete Widget, Styled by Bulma CSS

// Extra Challenge:
// 1. Add keyboard navigation to the dropdown menu
// 2. Make the initial values grey and add red or green depending on the winner

// Use this challenge as an example for code review, mainly when to split out in functions. How to design the logic.

// Learned: Can't remove a event listener on an arrow function, Scrolledintoview method, break out in functions if you have to do the same thing multiple times.
// Simple solutions such as on/off flag are often better than complex elegant solutions

const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
        <div class="dropdown-content results">
        
        </div>
        </div>
    </div>
    `;
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");
  let dropdownItem;
  //let keyboardEventListenerActive = false;

  const removeKeyboardListener = () => {
    root.removeEventListener("keydown", keypressHandler);
    keyboardEventListenerActive = false;
  };

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    for (let item of items) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        // Update value of the input
        // Close autocomplete
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
        removeKeyboardListener();
      });

      resultsWrapper.appendChild(option);
    }

    dropdownItem = root.querySelector(".dropdown-item");

    // I don't want the event listener to get attached multiple times. But this does not feel like a smooth way to do it
    // I have to set it here, because I don't want it to fire before dropdown is created. Which could work I guess?

    // Check if the value is the same, therefore I should use a class with this or something?

    // Left and right autocomplete use the same variable. So I have to removekeyboardlistener after closing the window.
    // this is where classes would work well. Because you could use instances.The instances would have their own vars using this.

    root.addEventListener("keydown", keypressHandler);

    // First I had an anonymous function call. This can be called multiple times by an event listener
    // By turning it into a declared function extra calls will be disregarded. This means I don't have to check
    // anymore if it already exists and a second autocomplete doesn't conflict because the eventhandler get's removed on close.

    // if (keyboardEventListenerActive === false) {
    //   console.log("Event Listener set");
    //   root.addEventListener("keydown", keypressHandler);
    //   keyboardEventListenerActive = true;
    // }
  };

  const keypressHandler = (e) => {
    console.log(e.key + " pressed...");
    if (dropdownItem) {
      switch (e.key) {
        case "ArrowDown":
          // Check if not first in list or already active
          if (
            dropdownItem.previousElementSibling !== null ||
            dropdownItem.classList.contains("is-active")
          ) {
            dropdownItem.classList.remove("is-active");
            dropdownItem = dropdownItem.nextElementSibling || dropdownItem;
            dropdownItem.classList.add("is-active");
            dropdownItem.scrollIntoViewIfNeeded();
          } else {
            // Item is first in list and not active. So highlight it and don't jump to next one
            dropdownItem.classList.remove("is-active");
            dropdownItem.classList.add("is-active");
            dropdownItem.scrollIntoViewIfNeeded();
          }
          break;

        case "ArrowUp":
          if (dropdownItem) {
            dropdownItem.classList.remove("is-active");
            dropdownItem = dropdownItem.previousElementSibling || dropdownItem;
            dropdownItem.classList.add("is-active");
            dropdownItem.scrollIntoViewIfNeeded();
          }
          break;

        case "Enter":
          // Simulate a click event so you don't have to hook the enter key to extra code.
          dropdownItem.click();
          break;

        case "Escape":
          dropdown.classList.remove("is-active");
          removeKeyboardListener();
          break;
      }
    }
  };

  input.addEventListener("input", debounce(onInput, 500));

  document.addEventListener("click", (event) => {
    // Hide if clicked outside of the dropdown element
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
      removeKeyboardListener();
    }
  });
};
