async function yumyumGraphQLCall(query) {
  const body = {
    query: query,
  };
  const a = await fetch("https://graph-3khoexoznq-uc.a.run.app/graphql", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    method: "POST",
  });

  const jsonobj = await a.json();
  return jsonobj;
}
exports.yumyumGraphQLCall = yumyumGraphQLCall;
