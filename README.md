# OnlyDance

## Running the backend scripts

To run the backend server, you need first cd into the backend directory using ```cd backend```. Then you need to activate the environment using ```bash venv/bin/activate ``` on Mac/Linux and ```bash venv\Scripts\activate ``` on Windows.

Now you need to install your backend dependencies before running your backend server using ```pip install -r requirements.txt```. To save any new dependencies, you can run ```pip freeze > requirements.txt```.

Now you can run your backend server using ```uvicorn app:app --reload```.

## Running the frontend

Simply run `npm install` and `npm run dev` to run the frontend in development mode.

## Refer to [scoring.ipynb](scoring.ipynb) to find documentation and a walkthrough for the feature engineering, scoring model, and timestamp interpolation.
