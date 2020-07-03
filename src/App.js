import React, { useEffect, useState } from "react";
import Data from "./data.json";
import "./App.css";
import GaurdGroup from "./components/GuardGroup";
import Icon from "./components/Icon.js";
import { genId } from "./lib";

import {
  defaultData as defaultRedirect,
  getAllData,
  saveRedirects,
} from "./api";

function App() {
  const [redirects, setRedirectsState] = useState([]);
  const [globalPostsIn, setGlobalPostsIn] = useState({});
  const [postTypes, setPostTypes] = useState([]);
  async function setInitialData() {
    const { redirects, posts_in, post_types } = await getAllData();
    const usersRedirects = redirects.length > 0 ? redirects : [defaultRedirect];

    setRedirectsState(usersRedirects);
    setGlobalPostsIn(posts_in);
    setPostTypes(post_types);
  }
  useEffect(() => {
    setInitialData();
  }, []);

  function addRedirect() {
    const newRedirect = {
      ...defaultRedirect,
      settings_id: genId(),
    };
    setRedirectsState((prev) => [...prev, newRedirect]);
  }
  async function saveToDB() {
    const saved = await saveRedirects(redirects);
    if (saved.err) {
      console.log("ERROR", saved.err);
    } else {
      //show success message
      console.log("success");
    }
  }
  function deleteRedirect(id) {
    const updatedRedirects = [...redirects];
    const deletedRedirectIndex = redirects.findIndex(
      (redirect) => id === redirect.settings_id
    );
    updatedRedirects.splice(deletedRedirectIndex, 1);
    setRedirectsState((prev) => [...updatedRedirects]);
  }
  function updateFormState(updatedRedirId, newRedirect) {
    const updatedRedirects = [...redirects];
    const editedRedirectIndex = redirects.findIndex(
      (redirect) => updatedRedirId === redirect.settings_id
    );
    updatedRedirects.splice(editedRedirectIndex, 1, newRedirect);
    setRedirectsState((prev) => [...updatedRedirects]);
  }
  function fetchAllPostInType(type) {
    return globalPostsIn[type];
  }
  return (
    <div className="App">
      <h2>Select Types To Gaurd</h2>

      <div className="plugin-body">
        <div className="wrapper">
          {redirects &&
            redirects.map((redirect) => {
              return (
                <GaurdGroup
                  key={redirect.settings_id}
                  groupSettings={redirect}
                  allPostTypes={postTypes}
                  /* replace with fetch call to get posts in post type */
                  fetchAllPostInType={fetchAllPostInType}
                  updateState={updateFormState}
                  deleteRedirect={() => deleteRedirect(redirect.settings_id)}
                />
              );
            })}
          <button className="add-redirect" type="button" onClick={addRedirect}>
            <div className="icon-container">
              <Icon name="add" />
            </div>
            <span>Add Redirect</span>
          </button>
        </div>
        <div className="util-column">
          <button type="button" className="primary-button" onClick={saveToDB}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
