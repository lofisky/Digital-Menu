import React from "react";
import Menu from "../Components/Menu"; // Import the Menu component that has the layout for the menu pages

function Menu2() {
  const categories = ["Sides", "Millennium Thick Milkshakes", "Drinks"];

  return <Menu categories={categories} />;
}

export default Menu2;
