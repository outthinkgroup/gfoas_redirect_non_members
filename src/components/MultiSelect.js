import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { _debounce as debounce } from "../lib/debounce";

export default function ({
  values,
  options,
  label,
  addItem,
  deleteItem,
  fetchNewPosts,
  fetchingPosts,
}) {
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
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighLightedIndex((prev) => (prev === 0 ? 0 : prev - 1));
    } else if (e.key === "ArrowDown") {
      setHighLightedIndex((prev) =>
        prev === filteredOptions.length - 1 ? prev : prev + 1
      );
    }
  }
  // useEffect(() => {
  //   setInputVal("");
  // }, [options]);
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
              onChange={(e) => {
                debounce(fetchNewPosts(e.target.value), 300);
                setInputVal(e.target.value);
              }}
              list="values"
              onKeyDown={keyDown}
              onFocus={() => setIsShowOptions(true)}
              onBlur={() => {
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
                      background:
                        highLightedIndex === index ? "var(--primary)" : "white",
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
            {fetchingPosts && <li className="fake-option">loading posts...</li>}
            {filteredOptions.length == 0 && !fetchingPosts && (
              <li className="fake-option">no posts found</li>
            )}
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
