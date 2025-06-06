[Devpost]: https://devpost.com/software/dermatech-ai
[Devpost]

# Inspiration
Just over two years ago both of Max's parents got diagnosed with skin cancer. My [Max's] mother was fortunate enough to find that she only had Basal Cell cancer, a slow growing and generally not dangerous cancer. My father, however, was diagnosed with Melanoma cancer – a quick growing skin cancer that can kill a person in under a year of diagnosis. Fortunately for him, they caught it early on and were able to remove it before he was under any threat. The aspect of this experience that stuck with me most was that this was my dad’s first dermatology appointment ever, after growing up in the sunny Florida Keys and having a mother who has faced skin cancer on numerous occasions. The only reason he scheduled an appointment was because my mother had nagged him to. If he hadn’t, he might not be here today. Sometimes I think about the people like my dad who weren’t fortunate enough to have someone force them to go to the doctor, or didn’t make the appointment in time. A tool that would allow them to easily get advice from the comfort and quickness of their home might be enough of a push to get them to make a dermatology appointment.

# What it does
Our model allows a user to upload an image of a skin lesion and uses AI technology to predict whether or not the user may have cancer.

# How we built it
We created a CNN (Convolutional Neural Network) and trained it on data from a Kaggle dataset of images of skin lesions, both cancerous and non-cancerous. For the front end, we used Next.js, and we used flask to integrate the frontend and backend. We also used the Google Gemini API to explain the prediction of the AI to the user, and we plan to improve this functionality to allow the user to interact with it and ask follow-up questions.

# Challenges we ran into
We had trouble using Flask to integrate the front-end and back-end, and there was difficulty with connecting the chatbot with the front-end. Additionally, the model didn't perform very well at first and we had difficulty creating it in the first place, since we are not very experienced with creating neural networks.

# Accomplishments that we're proud of
We're proud of the fact that we were able to link everything together at the end, and that we were able to create a neural network in such a short amount of time with very little experience.

# What we learned
We learned how to work in a team to create software, how to divide the tasks, and bring everything together at the end.

# What's next for DermaTech AI
We plan on making the user account system better and sending notifications to them to check up on their skin lesions again every once in a while to make sure that they know if it gets worse and needs attention. We also plan on making a chatbot that the user can interact with to ask follow-up questions about the AI's prediction, as most people don't know very much about skin diseases.

# Built With
cors
css
firebase
firestore
flask
gemini
next.js
numpy
pandas
pillow
python
pytorch
react.js
