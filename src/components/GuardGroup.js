import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import Icon from "./Icon";
import Select from "./Select";
import MultiSelect from "./MultiSelect";
import { getPostsInType } from "../api";
function GuardGroup({
  groupSettings,
  allPostTypes,
  updateState,
  fetchInitialPostInType,
  deleteRedirect,
  isFirst,
}) {
  const {
    type,
    guard_specific,
    posts_to_guard,
    settings_id,
    redirects_to,
  } = groupSettings;
  const [isCollapsed, setIsCollapsed] = useState(!isFirst ? true : false);
  const [redirectInput, setRedirectInput] = useState(redirects_to);
  const [allPostsInType, setAllPostsInType] = useState([]);
  useEffect(() => {
    const postInType = fetchInitialPostInType(type);
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
    const postInType = fetchInitialPostInType(newType);
    setAllPostsInType(postInType);
    const updatedRedirect = {
      ...groupSettings,
      type: newType,
      posts_to_guard: [],
    };
    updateState(settings_id, updatedRedirect);
  }
  function addGuardedPost(post) {
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
  const [fetchingPosts, setFetchingPosts] = useState(false);
  async function fetchPostInTypeBySearch(searchVal) {
    if (searchVal === "") {
      setAllPostsInType(fetchInitialPostInType(type));
      return;
    }
    setFetchingPosts(true);
    console.log(getPostsInType);
    const fetchedPosts = await getPostsInType(type, searchVal);
    console.log(fetchedPosts);
    setAllPostsInType(fetchedPosts);
    setFetchingPosts(false);
  }
  const variants = {};
  const previewVariant = {
    detail: {
      opacity: 0,
      height: 250,
      transition: {
        damping: 300,
        delay: 0.2,
        staggerChildren: 0.15,
      },
    },
    preview: {
      opacity: 1,
      height: "auto",
      transition: {
        damping: 300,
        staggerChildren: 0.15,
      },
    },
  };
  const detailVariant = {
    preview: {
      opacity: 0,
      height: 0,
      transition: {
        damping: 300,
        staggerChildren: 0.15,
      },
    },
    detail: {
      opacity: 1,
      height: "auto",
      transition: {
        damping: 300,
        staggerChildren: 0.15,
      },
    },
  };
  const childrenVariants = {
    detail: {
      opacity: 1,
    },
    preview: {
      opacity: 0,
    },
  };
  const previewChildren = {
    detail: {
      opacity: 0,
    },
    preview: {
      opacity: 1,
    },
  };
  return (
    <motion.div className="guard-group">
      <div className="collapse">
        <h3>Redirect</h3>
        <button
          className="collapse-button"
          type="button"
          style={{
            transform: !isCollapsed ? `rotate(180deg)` : `rotate(0deg)`,
          }}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <Icon name="chevron-down" />
        </button>
      </div>
      <motion.div
        animate={isCollapsed ? "preview" : "details"}
        style={{ marginBottom: `30px` }}
      >
        {!isCollapsed ? (
          <AnimatePresence>
            <motion.div
              className="guarding"
              variants={detailVariant}
              animate="detail"
              initial="preview"
            >
              <motion.div className="input-group" variants={childrenVariants}>
                <div className="guarding">
                  <motion.div
                    className="input-group"
                    variants={childrenVariants}
                  >
                    <Select
                      value={type}
                      options={allPostTypes}
                      label="Select Post Types to Guard"
                      update={updateType}
                      redirectID={settings_id}
                    />
                  </motion.div>
                  <motion.div
                    className="input-group"
                    variants={childrenVariants}
                  >
                    <label htmlFor="guard_specific">
                      Guard Only specific posts
                    </label>
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
                  </motion.div>
                </div>
                <motion.div className="redirect-to" variants={childrenVariants}>
                  <label htmlFor="">Redirect to:</label>
                  <input
                    type="text"
                    placeholder="https://google.com"
                    name=""
                    onBlur={() => updateRedirect("redirects_to", redirectInput)}
                    value={redirectInput}
                    onChange={(e) => setRedirectInput(e.target.value)}
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className="input-group input-group--small"
                variants={childrenVariants}
              >
                {guard_specific && (
                  <motion.div variants={childrenVariants} exit="preview">
                    <MultiSelect
                      values={posts_to_guard}
                      options={allPostsInType}
                      fetchNewPosts={fetchPostInTypeBySearch}
                      fetchingPosts={fetchingPosts}
                      label="Choose which posts to guard"
                      addItem={addGuardedPost}
                      deleteItem={deleteGuardedPost}
                    />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            className="collapsed-view"
            variants={previewVariant}
            animate="preview"
            initial="detail"
          >
            <motion.p variants={previewChildren}>
              <strong>Type:</strong> {type}
            </motion.p>
            <motion.p variants={previewChildren}>
              <strong>Redirects to:</strong> {redirects_to}
            </motion.p>
          </motion.div>
        )}
      </motion.div>
      <div className="util-section">
        <div className="actions">
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
    </motion.div>
  );
}
export default GuardGroup;
