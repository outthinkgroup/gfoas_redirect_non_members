const ENDPOINT = "/wp-json/gfoas/v1/redirect-settings";
export async function saveRedirects(redirects) {
  const body = JSON.stringify(redirects);
  const data = await fetch(ENDPOINT, {
    method: "POST",
    credentials: "include",
    body,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res;
    });
  return data;
}
