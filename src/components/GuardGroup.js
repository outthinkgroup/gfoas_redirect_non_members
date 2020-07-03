import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import Select from "./Select";
import MultiSelect from "./MultiSelect";
function GuardGroup({
  groupSettings,
  allPostTypes,
  updateState,
  fetchAllPostInType,
  deleteRedirect,
}) {
  const {
    type,
    guard_specific,
    posts_to_guard,
    settings_id,
    redirects_to,
  } = groupSettings;

  const [redirectInput, setRedirectInput] = useState(redirects_to);
  const [allPostsInType, setAllPostsInType] = useState([]);
  useEffect(() => {
    const postInType = fetchAllPostInType(type);
    setAllPostsInType(postInType);
    console.log(allPostsInType);
  }, [type, allPostTypes]);

  function updateRedirect(key, value) {
    const updatedRedirect = {
      ...groupSettings,
      [key]: value,
    };
    updateState(settings_id, updatedRedirect);
  }
  function updateType(newType) {
    const postInType = fetchAllPostInType(newType);
    setAllPostsInType(postInType);
    const updatedRedirect = {
      ...groupSettings,
      type: newType,
      posts_to_guard: [],
    };
    updateState(settings_id, updatedRedirect);
  }
  function addGuardedPost(post) {
    console.log("a");
    const removedIfExist = posts_to_guard.filter(
      (guardedPost) => post.id !== guardedPost.id
    );
    const updatedGuardedPostList = [post, ...removedIfExist];
    updateRedirect("posts_to_guard", updatedGuardedPostList);
  }
  function deleteGuardedPost(id) {
    const updated_posts_to_guard = posts_to_guard.filter(
      (post) => post.id !== id
    );
    updateRedirect("posts_to_guard", updated_posts_to_guard);
  }

  return (
    <div className="guard-group">
      <div className="guarding">
        <div className="input-group">
          <div className="guarding">
            <div className="input-group">
              <Select
                value={type}
                options={allPostTypes}
                label="Select Post Types to Guard"
                update={updateType}
                redirectID={settings_id}
              />
            </div>
            <div className="input-group">
              <label htmlFor="guard_specific">Guard Only specific posts</label>
              <input
                type="checkbox"
                name="guard-specific"
                id="guard_specific"
                checked={guard_specific}
                onChange={() =>
                  updateRedirect(
                    "guard_specific",
                    guard_specific ? false : true
                  )
                }
              />
            </div>
          </div>
          <div className="redirect-to">
            <label htmlFor="">Redirect to:</label>
            <input
              type="text"
              placeholder="https://google.com"
              name=""
              onBlur={() => updateRedirect("redirects_to", redirectInput)}
              value={redirectInput}
              onChange={(e) => setRedirectInput(e.target.value)}
            />
          </div>
        </div>
        <div className="input-group input-group--small">
          {guard_specific && (
            <div>
              <MultiSelect
                values={posts_to_guard}
                options={allPostsInType}
                label="Choose which posts to guard"
                addItem={addGuardedPost}
                deleteItem={deleteGuardedPost}
              />
            </div>
          )}
        </div>
      </div>
      <div className="util-section">
        <button
          type="button"
          onClick={deleteRedirect}
          className="util-button delete"
        >
          <span className="icon-container">
            <Icon name="close" />
          </span>
          Delete
        </button>
      </div>
    </div>
  );
}
export default GuardGroup;
