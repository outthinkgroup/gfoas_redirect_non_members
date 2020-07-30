import React, { useEffect, useState } from "react";
import "./App.css";
import GuardGroup from "./components/GuardGroup";
import AppSidebar from "./components/AppSidebar";
import Icon from "./components/Icon.js";
import Skeleton from "./components/Skeleton";
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
  const [isSaving, setIsSaving] = useState(false);
  async function saveToDB() {
    setIsSaving(true);
    const saved = await saveRedirects(redirects);
    if (saved.err) {
      console.log("ERROR", saved.err);
    } else {
      //TODO: show success message
      console.log("success");
    }
    setIsSaving(false);
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
  function fetchInitialPostInType(type) {
    return globalPostsIn[type];
  }
  return (
    <div className="App">
      <h2>Select Types To Gaurd</h2>

      <div className="plugin-body">
        <div className="wrapper">
          {postTypes.length > 0 ? (
            redirects &&
            redirects.map((redirect, index) => {
              return (
                <GuardGroup
                  isFirst={index === 0}
                  key={redirect.settings_id}
                  groupSettings={redirect}
                  allPostTypes={postTypes}
                  /* replace with fetch call to get posts in post type */
                  fetchInitialPostInType={fetchInitialPostInType}
                  updateState={updateFormState}
                  deleteRedirect={() => deleteRedirect(redirect.settings_id)}
                />
              );
            })
          ) : (
            <Skeleton key="skeleton" />
          )}
          <button
            key="add-button"
            className="add-redirect"
            type="button"
            onClick={addRedirect}
          >
            <div className="icon-container">
              <Icon name="add" />
            </div>
            <span>Add Redirect</span>
          </button>
        </div>
        <AppSidebar save={saveToDB} saving={isSaving} />
      </div>
    </div>
  );
}

export default App;
