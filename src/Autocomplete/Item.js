import React from "react";
import PropTypes from "prop-types";

const Item = ({ renderItem, itemData, selected, onClick, theme, ...props }) => {
  let styles = ["autocomplete__item"];
  if (selected) {
    styles.push("autocomplete__item--selected");
  }

  return (
    <li {...theme("ac-itm", ...styles)} onClick={onClick} {...props}>
      {renderItem(itemData)}
    </li>
  );
};

Item.propTypes = {
  renderItem: PropTypes.func.isRequired,
  theme: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool
};

export default Item;
