//Menu component that will define the layout of the pages

import React, { useEffect, useState } from "react"; //import react and its hooks
import axios from "axios"; //import axios to send information

function Menu({ categories }) {
  //take in the category that was specified for the pages to determine whats going to be displayed on each menu page
  const [menuItems, setMenuItems] = useState([]); //usestate, a react hook, allows a component to have state, and to update that state, and to re-render the component when the state changes, the first element is the current state value, and the second element is a function that updates the state

  useEffect(() => {
    //useeffect creates a side effect, which happens when the component is rendered (like react, do this after the component is shown on the screem)
    axios
      .get("http://localhost:5000/api/menu", { params: { categories } }) //axios to send http requests, the get request is made to the api/menu endpoint (on server js where it looks for get requests on that path) with the categories parameter
      .then((response) => setMenuItems(response.data)) //if the request is successful, set the menu items to the data that was returned which is the menu items associated with the category
      .catch((error) => console.error("Error fetching menu data:", error));
  }, [categories]); //dependency array, if the categories change, the effect will run again for different categories on different pages

  const sizeOrder = ["Small", "Regular", "Medium", "Large"]; //order of sizes to be displayed

  const getSizeOrderIndex = (
    size //the brackets is for a shorthand arrow function which is better than explicitly having to say function getSizeOrderIndex(size)
  ) =>
    sizeOrder.indexOf(size) !== -1 ? sizeOrder.indexOf(size) : sizeOrder.length; //if the size is in the size order array, return the index of the size, if not return the length of the size order array so you put it at the end

  const groupedItems = menuItems.reduce(
    //reduce is a function that takes an array and reduces it to a single value
    (acc, { menu_item_id, food_name, category, image_url, size, price }) => {
      //acc is the accumulator which is a value that is built up as the reduce function goes through the array, the second parameter is the current value being processed which is a destructured menu object taking the relevant details
      if (!acc[food_name]) acc[food_name] = []; //set foodname as key and check if it exists, if it doesnt then set it to an empty array
      acc[food_name].push({ menu_item_id, category, image_url, size, price }); //use food_name as the key of an array (to group up sizes and prices of the same foodname together) inside the accumulator, for each food name, push the details associated with it into the array
      return acc; //returns the reduced menu items which is an object with the foodname as the key and the details as the value
    },
    {}
  );

  return (
    <div className="menu-container container-fluid p-0">
      {/*container fluid is a bootstrap class that makes the container full width of the viewport*/}
      {categories.map(
        (
          category //map is a function which takes an array and applies a function to each element in the array, in this case it takes the categories arrayand creates a div for each category and displays the category name etc
        ) => (
          <div className="menu-section container-fluid p-0" key={category}>
            {/*use the category parameter as a key*/}
            <h2 className="display-1 custom-bolder text-center bg-blue m-0 p-0 mb-0 norican-regular custom-color">
              {category}{" "}
              {/*display the category on the page, make it look pretty with the blue background*/}
            </h2>
            <div className="bg-white menu-items container-fluid p-0">
              <div className="row">
                {/*use bootstrap row class to create a row*/}
                {Object.entries(groupedItems) //object.entries is a function which turns an object (in this case the menu items we reduced earlier) into one big array of key value pairs
                  .filter(([_, items]) => items[0].category === category) //its saying ignore the key and only take the items, then filter the items by the category parameter provided, menu_items[0] points to the first item in the array because the items are grouped by food name anyway so you dont have to check the categories of each foodname variation
                  .map(([foodName, items]) => {
                    //map through grouped items where the foodname is the key and the items are the values
                    const hasImage =
                      items[0].image_url && items[0].image_url.trim() !== ""; //check if the fooditem has an image
                    return (
                      <div
                        className={`col-lg-3 col-md-4 col-12 mb-3 ${
                          hasImage ? "mx-auto" : "" //if the food item has an image, center it with mx-auto which is short for margin-left/right: auto
                        }`}
                        key={foodName} //use the foodname as the key
                      >
                        <div className="card m-0 border-0">
                          <div className="card-body p-2 d-flex align-items-center">
                            <div className="mr-0">
                              <img src={items[0].image_url} alt="" />{" "}
                              {/*display the image of the food item*/}
                            </div>
                            <div className="d-flex flex-column flex-grow-1">
                              <p className="text-center luxurious-roman-regular fs-3 fs-md-3 fs-lg-2">
                                <strong>{foodName}</strong>{" "}
                                {/*display the food name*/}
                              </p>
                              <p className="text-center noto-serif-regular fs-4 fs-md-4 fs-lg-3">
                                {items
                                  .sort(
                                    (a, b) =>
                                      getSizeOrderIndex(a.size) - //refer to function getSizeOrderIndex to sort the sizes in the correct order
                                        getSizeOrderIndex(b.size) ||
                                      a.price - b.price //use subtraction to sort the prices in ascending order, so if a is less than b, it will be negative and a will come before b
                                  )
                                  .map(
                                    (
                                      { size, price } //map through the items and display the sorted size and price
                                    ) => `${size ? `${size}: ` : ""}£${price}` //string literal for display purposes (if size exists, display it with a colon, if not display nothing, then display the price with a pound sign)
                                  )
                                  .join(" / ")}{" "}
                                {/*connect the sizes and prices with a forward slash for display again*/}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Menu;
