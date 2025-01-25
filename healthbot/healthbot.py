import google.generativeai as genai

YOUR_API_KEY = "AIzaSyBSlzAb4SzjUmEKJxpX6GPPtN3z_ND18fY"

genai.configure(api_key=YOUR_API_KEY)

model=genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="Keep output to a maximum of 5 sentences")

chat = model.start_chat(
    # Set history of conversation based on diagnosis.

    # Not accessable object
    history=[
        {"role": "user", "parts": "N/A"},
        {"role": "model", "parts": "N/A"},
    ]
)

# Given information based on diagnosis                 
d_info = chat.send_message("I have been diagnosed with basal cell carcinoma. Can you give me more information about this?")
print(d_info.text)
chat.history.append({"role": "model", "parts": d_info.text}) 

# Prompt User for Questions
user_response = input("Enter any questions you have concerning your diagnosis?")
while True:
    if user_response == '':
        break
    response = chat.send_message(user_response)

    # Add chat bot response and user question to history
    chat.history.append({"role": "user", "parts": user_response})
    chat.history.append({"role": "model", "parts": response.text})

    print(response.text)

    user_response = input("\nDo you have any more questions?")





