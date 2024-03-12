import os
import json
from langchain_community.document_loaders.recursive_url_loader import RecursiveUrlLoader
from bs4 import BeautifulSoup as Soup
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def chatgpt(role, prompt):
  chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": role,
            "content": prompt
            ,
        }
    ],
    # model="gpt-3.5-turbo",
    model="gpt-4",
  )
  return chat_completion.choices[0].message.content

def find_reservation_system_in_webpage(webpage_content, base_url):
  role="assistant"
  prompt = f"""
you are an agent inspecting a document and looking for key information. The following is a page from a restaturant's web site. It may contain information of an online reservation system?
Only output json in the output.

- If there is no reservation system, say "system" is none
- if there is a reservation system say "system" is tock, opentable, resy, yelp, sevenrooms or custom. Appspot is not a system.
- if there is a link to a rervaction system? output a field 'reservationUrl' for the full URL of the link
- add a field confidence for the confidence level of your answer

here is content of the page with base url as {base_url}, content is
"""
  return chatgpt(role, prompt + webpage_content)

print(chatgpt("user", "say you say me"))

import re
from typing import Generator

from bs4 import BeautifulSoup, Doctype, NavigableString, Tag

def langchain_docs_extractor(soup: BeautifulSoup) -> str:
    # Remove all the tags that are not meaningful for the extraction.
    SCAPE_TAGS = ["nav", "footer", "aside", "script", "style"]
    [tag.decompose() for tag in soup.find_all(SCAPE_TAGS)]

    def get_text(tag: Tag) -> Generator[str, None, None]:
        for child in tag.children:
            if isinstance(child, Doctype):
                continue

            if isinstance(child, NavigableString):
                yield child
            elif isinstance(child, Tag):
                if child.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
                    yield f"{'#' * int(child.name[1:])} {child.get_text()}\n\n"
                elif child.name == "a":
                    yield f"[{child.get_text(strip=False)}]({child.get('href')})"
                elif child.name == "img":
                    yield f"![{child.get('alt', '')}]({child.get('src')})"
                elif child.name in ["strong", "b"]:
                    yield f"**{child.get_text(strip=False)}**"
                elif child.name in ["em", "i"]:
                    yield f"_{child.get_text(strip=False)}_"
                elif child.name == "br":
                    yield "\n"
                elif child.name == "code":
                    parent = child.find_parent()
                    if parent is not None and parent.name == "pre":
                        classes = parent.attrs.get("class", "")

                        language = next(
                            filter(lambda x: re.match(r"language-\w+", x), classes),
                            None,
                        )
                        if language is None:
                            language = ""
                        else:
                            language = language.split("-")[1]

                        lines: list[str] = []
                        for span in child.find_all("span", class_="token-line"):
                            line_content = "".join(
                                token.get_text() for token in span.find_all("span")
                            )
                            lines.append(line_content)

                        code_content = "\n".join(lines)
                        yield f"```{language}\n{code_content}\n```\n\n"
                    else:
                        yield f"`{child.get_text(strip=False)}`"

                elif child.name == "p":
                    yield from get_text(child)
                    yield "\n\n"
                elif child.name == "ul":
                    for li in child.find_all("li", recursive=False):
                        yield "- "
                        yield from get_text(li)
                        yield "\n\n"
                elif child.name == "ol":
                    for i, li in enumerate(child.find_all("li", recursive=False)):
                        yield f"{i + 1}. "
                        yield from get_text(li)
                        yield "\n\n"
                elif child.name == "div" and "tabs-container" in child.attrs.get(
                    "class", [""]
                ):
                    tabs = child.find_all("li", {"role": "tab"})
                    tab_panels = child.find_all("div", {"role": "tabpanel"})
                    for tab, tab_panel in zip(tabs, tab_panels):
                        tab_name = tab.get_text(strip=True)
                        yield f"{tab_name}\n"
                        yield from get_text(tab_panel)
                elif child.name == "table":
                    thead = child.find("thead")
                    header_exists = isinstance(thead, Tag)
                    if header_exists:
                        headers = thead.find_all("th")
                        if headers:
                            yield "| "
                            yield " | ".join(header.get_text() for header in headers)
                            yield " |\n"
                            yield "| "
                            yield " | ".join("----" for _ in headers)
                            yield " |\n"

                    tbody = child.find("tbody")
                    tbody_exists = isinstance(tbody, Tag)
                    if tbody_exists:
                        for row in tbody.find_all("tr"):
                            yield "| "
                            yield " | ".join(
                                cell.get_text(strip=True) for cell in row.find_all("td")
                            )
                            yield " |\n"

                    yield "\n\n"
                elif child.name in ["button"]:
                    continue
                else:
                    yield from get_text(child)

    joined = "".join(get_text(soup))
    return re.sub(r"\n\n+", "\n\n", joined).strip()


def find_res_from_url(url):
   loader = RecursiveUrlLoader(
     url=url, max_depth=2, extractor=lambda x: langchain_docs_extractor (Soup(x))
   )
   docs = loader.load()
   docs1 = [ doc for doc in docs if doc.metadata.get("language") is not None]
   for doc in docs1:
        result = find_reservation_system_in_webpage( doc.page_content, doc.metadata["source"])
        # print(result)
        result_object = json.loads(result)
        if result_object.get("system") != "none":
           return result_object
   return None

print(find_res_from_url("https://leyouethiopian.com/"))
print(find_res_from_url("https://www.anglerrestaurants.com/san-francisco"))
print(find_res_from_url("https://www.7dsteakhouse.com/"))
