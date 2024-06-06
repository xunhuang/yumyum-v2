export async function yumyumGraphQLCall(query: string): Promise<any> {
  const body = {
    query: query,
  };
  const response = await fetch(
    "https://graph-3khoexoznq-uc.a.run.app/graphql",
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      method: "POST",
    }
  );

  const jsonobj = await response.json();
  return jsonobj;
}
