import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icon";

export default function ({ values, options, label, addItem, deleteItem }) {
  const [inputVal, setInputVal] = useState("");
  const [isShowOptions, setIsShowOptions] = useState(false);
  const [highLightedIndex, setHighLightedIndex] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState(options);
  useEffect(() => {
    setFilteredOptions((prev) =>
      options
        ? options.filter((option) => {
            return (
              inputVal === "" ||
              option.name.toLowerCase().includes(inputVal.toLowerCase())
            );
          })
        : []
    );
    setHighLightedIndex(0);
  }, [inputVal, options]);

  const ref = useRef();
  function insertGuardedPost(e, val) {
    e.preventDefault();
    let post = false;
    console.log("ran");
    if (filteredOptions[highLightedIndex]) {
      post = options.find(
        (post) => filteredOptions[highLightedIndex].name === post.name
      );
    } else if (val) {
      post = options.find((post) => val === post.name);
    } else {
      post = options.find((post) => inputVal === post.name);
    }
    addItem(post);
    if (!post) return;
    setInputVal("");
    setIsShowOptions(false);
  }
  function keyDown(e) {
    setIsShowOptions(true);
    console.log(highLightedIndex);
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighLightedIndex((prev) => (prev === 0 ? 0 : prev - 1));
    } else if (e.key === "ArrowDown") {
      setHighLightedIndex((prev) =>
        prev === filteredOptions.length - 1 ? prev : prev + 1
      );
    }
  }
  useEffect(() => {
    setInputVal("");
  }, [options]);
  return (
    <div className="multi-select">
      <label>{label}</label>
      <div className="box">
        <form ref={ref} onSubmit={insertGuardedPost}>
          <div className="input">
            <input
              type="text"
              value={inputVal}
              className="multi-select-input"
              onChange={(e) => setInputVal(e.target.value)}
              list="values"
              onKeyDown={keyDown}
              onFocus={() => setIsShowOptions(true)}
              onBlur={() => {
                console.log("unfocused");
                setTimeout(() => setIsShowOptions(false), 160);
              }}
            />
            <button
              style={{ width: "30px", marginLeft: `10px`, postion: "absolute" }}
              className="addButton"
            >
              <Icon name="add" color="black" />
            </button>
          </div>
          <ul id="values">
            {options &&
              isShowOptions &&
              filteredOptions.map(({ id, name }, index) => {
                return (
                  <li
                    key={id}
                    onMouseEnter={() => setHighLightedIndex(index)}
                    style={{
                      background: highLightedIndex === index ? "blue" : "white",
                      color: highLightedIndex === index ? `white` : `black`,
                    }}
                  >
                    <button
                      type="submit"
                      onClick={(e) => {
                        insertGuardedPost(e);
                      }}
                    >
                      {name}
                    </button>
                  </li>
                );
              })}
          </ul>
        </form>
        <ul className="list-box">
          {values &&
            values.map(({ name, id }) => {
              return (
                <li className="list-box__item" key={id}>
                  <span>{name}</span>
                  <span>
                    <button type="button" onClick={() => deleteItem(id)}>
                      <Icon name="close" />
                    </button>
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
