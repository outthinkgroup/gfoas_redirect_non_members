// import { debounce } from "../lib";
const ENDPOINT = "/wp-json/gfoas/v1/get-posts-in-type";
export async function getPostsInType(type, searchVal) {
  const body = JSON.stringify({ type, searchVal });
  const data = await fetch(ENDPOINT, {
    method: "POST",
    body,
    credentials: "same-origin",
  }).then((res) => res.json());
  return data;
}
