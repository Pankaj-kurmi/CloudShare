export async function getClerkToken(getToken) {
  if (typeof getToken !== "function") {
    return null;
  }

  return getToken({ template: "default" }).catch(() => getToken()).catch(() => null);
}
