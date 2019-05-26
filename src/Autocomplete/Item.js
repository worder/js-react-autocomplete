import React from "react";

const Item = ({ renderItem, item }) => <li>{renderItem(item)}</li>;

export default Item;
