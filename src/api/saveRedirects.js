export async function saveRedirects(redirects) {
  const body = JSON.stringify(redirects);
  const data = await fetch(
    "http://create.local/wp-json/gfoas/v1/redirect-settings",
    {
      method: "POST",
      credentials: "include",
      body,
    }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res;
    });
  return data;
}
