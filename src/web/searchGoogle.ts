export async function searchGoogle({
  query = ``,
  limit = 10,
  timeFrame = "",
}: {
  query: string;
  limit: number;
  timeFrame: string;
}): Promise<Array<{ snippet: string; link: string; title: string }>> {
  const URL = `https://www.googleapis.com/customsearch/v1`;
  const _query = encodeURIComponent(query);
  const { key, cx } = getRandomKeyAndCx();
  let url: string = `${URL}?key=${key}&cx=${cx}&q=${_query}&num=${limit}`;
  if (timeFrame) {
    url += `&dateRestrict=${timeFrame}`;
  }

  try {
    const response = await fetch(url);

    if (response.status !== 200) {
      console.error(
        `Failed to search Google for query "${query}"`,
        response.status
      );
      throw new Error("HTTP error 429");
    }

    const json = await response.json();
    const items = json.items || [];

    return items.map((item: any) => ({
      snippet: item.snippet || "",
      link: item.link || "",
      title: item.title || "",
    }));
  } catch (error) {
    console.error(`Failed to search Google for query "${query}"`, error);
    throw error;
  }
}

const googleSearchKeys = [
  // { key: "AIzaSyCBGOb0CC0BmpJFo1X-BDreFBG2IQnPeYc", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyDVE1sHxqZlO5HIzHkqq-8Co58Ezo8XntE", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyAafqsX8eB8i9gi6Zzw0DC0bwVIfLcOsXs", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyCcTvYNFK_sdRSaaZpgcu9aF4REletzVCA", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyCIg2O0z7gkFtcRND3Ikxlk72Q1vPoutoo", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyDZlKSSl7iPkkD2M67Lrq7pqMDBTxgwnrs", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyDguV5IDEVOgJEy2cs0FuiRuGG3UQaap5Q", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyBAvB8Rf1Ccdla-CznWLdesYTVi0DQqq0w", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyDq5lzZCzQoy7jwhXXF3Ub3Uum1u9VDxcA", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyDlpsA18mjRxQPlQkFZqhNerCiwh_Y6vGI", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyDm29D_CJkwdm-LQoUynF5CUOnYzhuAu9s", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyBh8qtqjqn8QNk7UFhUHzKkiVQp1VkSvgA", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyDqDBgqvxtMdNJrXg8gs5jzMW_cU5LxSMQ", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyBMWZE1ALttKd8tCGorSH8RtPA75kdmFWc", cx: "a153b8f3eccff4560" },
  // { key: "AIzaSyBMisbR65C2gbiQgcgn-h2QpU0BXa5x0Ao", cx: "a153b8f3eccff4560" },
  { key: "AIzaSyCidelZeJRJOjWSSyGVwbFGz5JZTVJjfl4", cx: "a153b8f3eccff4560" },
  { key: "AIzaSyAvilVQFmtNkrFARMT9m0gjQwDOxpxYbbg", cx: "a153b8f3eccff4560" },
  { key: "AIzaSyD6p5q_mLG8cDAS68J6MecDIkg99oQiScc", cx: "a153b8f3eccff4560" },
  { key: "AIzaSyAMfsKeCOHDrfvOWtElMzVlJe0qjj24sis", cx: "a153b8f3eccff4560" },
  { key: "AIzaSyC3aOmee6WkmgWX5npptOnEQ9Ttv-zzYJE", cx: "a153b8f3eccff4560" },
];

function getRandomKeyAndCx() {
  const randomIndex = Math.floor(Math.random() * googleSearchKeys.length);
  return googleSearchKeys[randomIndex];
}
