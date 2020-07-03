const ENDPOINT = "/wp-json/gfoas/v1/redirect-settings";

export async function getAllData() {
  const data = await fetch(ENDPOINT, {
    credentials: "same-origin",
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
  console.log(data);
  return data;
}
