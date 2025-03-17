from groq import Groq
import os

#os.system("pip uninstall -y gradio")
#os.system("pip install --upgrade gradio==5.16.0")

import gradio as gr

api_key = os.getenv("GROQ_API")
client = Groq(api_key=api_key)

def userQuery(query, chatHistory):
    chatHistory.append({"role":"user", "content": query})
    return chatHistory

def generate_recipe(query, dietary_pref, metric, chatHistory, macros):

    if metric==None:
        metric="Imperial"

    if dietary_pref==None:
        dietary_pref="None specified"

    messages = [
        {"role": "system",
         "content": f'''
        You are a friendly AI chef and assistant. Your name is Remy. Your goal is to answer questions and provide recipes. 
        --if the user is conversational, reply conversationally
        --if the user asks questions about cooking, respond.
        --if a user *EXPLICITLY* asks for a recipe, then generate one. 
        --Refer to previous recipes, if any {chatHistory}, unless the user asks for a new one
        --if a user asks for a substitution or a question about a recipe, respond by referring to the recipe most recently generated {chatHistory}.
        --include emojis in your responses, but not too many
        --be concise, but friendly in your responses.
        
        **If a user asks for a recipes, follow these rules**
        1) The user may have dietary restrictions. If they do, you must abide by these. Do not provide recipes that would go against these restrictions, regardless of the query. If there is a contradiction between the query and dietary restrictions, ask the user for clarification and do NOT provide a recipe. 
        2) If the user doesn't provide dietary restrictions, you have no limitations. Do not mention anything about not having dietary restrictions.
        3) Provide any measurements in the measurement system specified. 
        4) Provide a cooking estimate time
        '''},

        {"role": "user",
         "content": f"Respond to: {query} in the language of the query. If asked to make a recipe, follow the dietary restrictions below (if any): {dietary_pref}. Provide measurements in the {metric} system. Provide macronutrients if true: {macros}"},
    ]

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )
    response_content =""

    for chunk in completion:
        response_content += chunk.choices[0].delta.content or ""
    chatHistory.append({"role":"assistant", "content": response_content})
    return chatHistory

CSS="""
     .letmecookButton{
        font-size: 20px !important;
        background-color: #98C264;
     }
     
     .Title{
        font-size: 25px !important;
        text-align: "center" !important;
        display: block;
     }
     
     .info{
        text-align:"center" !important;
        display: block !important;
     }
     """
with (gr.Blocks( fill_width=True, css=CSS) as demo):

    chatHistory = gr.State([])
    
    with gr.Row():
        gr.Image("Food.png", show_label=False, show_download_button=False, show_fullscreen_button=False, elem_classes="top_image")
    with gr.Sidebar():
        gr.Markdown("# 🍳 Recipe Preferences", elem_classes="Title")
        gr.Markdown("Customize your recipes with the options below!", elem_classes="info")
        with gr.Column(scale=4):
            dietary_restrictions=gr.Textbox(placeholder="Enter restrictions here", label="Dietary restrictions")
            metric = gr.Radio(["Metric", "Imperial"], label="Measurement")
            macros = gr.Checkbox(label="Include Macronutrients?")
        clear = gr.Button("Clear Chat", elem_classes="letmecookButton")

    chatbot = gr.Chatbot(type="messages", show_copy_button=True, label="Remy", avatar_images= [None, "LETMECOOK.png"], placeholder="<h1 style='text-align: center'>🐁 Remy The Recipe Maker </h1>\n<h4 style='text-align: center'>Ask me about anything cooking related! </h4>")
    with gr.Row(equal_height=True):
        prompt1 = gr.Button(value="Tell me a fun, cooking fact")
        prompt2 = gr.Button(value="Whats the best way to cook poached eggs?")
        prompt3 = gr.Button(value="Suggest a recipe for date night")
        prompt4 = gr.Button(value="What seasoning would you recommend for chicken?")
    with gr.Row(equal_height=True, height=50):
        user_input = gr.Textbox(
            placeholder="Ask for a recipe here...",
            lines=1,
            scale=1,
            show_label=False,
            elem_classes="userText",
        )
        send_button = gr.Button("Cook", elem_classes="letmecookButton", scale=0)
    send_button.click(
        fn = userQuery,
        inputs = [user_input, chatHistory],
        outputs = chatbot
    ).then(
        fn = generate_recipe,
        inputs = [user_input, dietary_restrictions, metric, chatHistory, macros],
        outputs = chatbot,
        queue=True,
    ).then(
        fn=lambda: "",
        inputs=None,
        outputs=user_input,
    )
    clear.click(
        fn=lambda: [],
        outputs=chatHistory,
    ).then(
        fn=lambda: chatHistory,
        outputs=chatbot,
    ).then(
        fn=lambda: "",
        outputs=[dietary_restrictions]
    )
    prompt1.click(
        fn=lambda: prompt1,
        outputs=user_input
    )
    prompt2.click(
        fn=lambda: prompt2,
        outputs=user_input
    )
    prompt3.click(
        fn=lambda: prompt3,
        outputs=user_input
    )
    prompt4.click(
        fn=lambda: prompt4,
        outputs=user_input
    )

demo.launch()
