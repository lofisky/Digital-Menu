import React from "react";
import Menu from "../Components/Menu"; // Import the Menu component

function Menu1() {
  const categories = ["Fish", "Burgers", "Chicken"];

  return <Menu categories={categories} />; // Pass the categories prop to the Menu component
}

export default Menu1;
