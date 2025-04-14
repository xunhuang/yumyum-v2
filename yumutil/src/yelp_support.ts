interface YelpSuggestion {
  title: string;
  subtitle: string;
  redirectUrl: string;
}

interface YelpSearchResult {
  name: string;
  address: string;
  redirectUrl: string;
}

interface YelpResponse {
  data: {
    searchSuggestFrontend: {
      prefetchSuggestions: {
        suggestions: YelpSuggestion[];
      };
    };
  };
}

export async function yelp_basic_search(searchTerm: string, city: string, state: string): Promise<YelpSearchResult[]> {
  try {
    const response = await fetch("https://www.yelp.com/gql/batch", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "content-type": "application/json",
      },
      "body": JSON.stringify([{
        operationName: "GetSuggestions",
        variables: {
          capabilities: [],
          prefix: searchTerm,
          location: `${city}, ${state}`
        },
        extensions: {
          operationType: "query",
          documentId: "109c8a7e92ee9b481268cf55e8e21cc8ce753f8bf6453ad42ca7c1652ea0535f"
        }
      }]),
      "method": "POST"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as [YelpResponse];
    const suggestions = data[0].data.searchSuggestFrontend.prefetchSuggestions.suggestions;
    const results = suggestions.map(suggestion => ({
      name: suggestion.title,
      address: suggestion.subtitle,
      redirectUrl: suggestion.redirectUrl,
    }));

    return results;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    const result = await yelp_basic_search("trabocco", "Alameda", "CA");
    // console.log("Search results:", result);
  } catch (err) {
    console.error("Error in main:", err);
  }
}

main();
