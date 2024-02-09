
from openai import OpenAI
import os
import functions_framework

from markupsafe import escape

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
@functions_framework.http
def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)
    request_args = request.args

    if request_json and "name" in request_json:
        name = request_json["name"]
    elif request_args and "name" in request_args:
        name = request_args["name"]
    else:
        name = "World"
    return f"Hello {escape(name)}!"


# Ensure you have set your OpenAI API key as an environment variable

def call_chatgpt(system, prompt):
    """
    Calls ChatGPT with the GPT-4 model and a given prompt.

    Args:
        prompt (str): The prompt to send to ChatGPT.

    Returns:
        str: The response from ChatGPTe
    """
    try:
        response = client.chat.completions.create(
           model="gpt-4",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
        temperature=0.7,
        max_tokens=150,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0)
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"An error occurred: {str(e)}"

def find_reservation_system(resturant_info):
    resturant_info = """
    Bird Dog
    Contemporary, American Contemporary, Palo Alto , 25 - 50 USD, TBD
    420 Ramona St., Palo Alto, California
    -122.16308, 37.445793
    First Introduced 2019
"""
    prompt = f"""
    You are a search agent looking for information from the internet and you can use
    search engines such as bing.
    Find the online reservation system for the following restaurant: 
    {resturant_info}

    A few well known reservation systems are OpenTable, Resy, Tock, SevenRooms,Yelp, and Bookatable.
    return whether this restaurant has an online reservation system and if so 
    what it is. Result should be in a json format. 

    The json should contain fields such as follows:
         - system: Resy
         - url: https://resy.com
         - name: Bird Dog
       
    If no reservation system is found, system:none. 
    If a online reservation system is found, return the website url. 

    You should make sure the URL is valid, the reservation system is 
    indeed on that website, 
    for example some times opentable would display "Not available on OpenTable" 
    and in this case we want to return system: none
    """

    role = "You are a search agent looking for information from the internet "

    return call_chatgpt(role, prompt)

response = find_reservation_system("Bird Dog")
print(response)  # Output: "The meaning of life is to give life meaning."