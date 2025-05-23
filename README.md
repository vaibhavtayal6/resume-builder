# Resume Builder

Resume Builder is a web application designed to help users create professional resumes effortlessly. Leveraging modern web technologies, it offers a seamless and intuitive experience for crafting personalized resumes.

## Features

- **User-Friendly Interface**: Simplifies the resume creation process with an intuitive design.
- **Customizable Templates**: Offers a variety of templates to suit different professional needs.
- **Real-Time Preview**: Allows users to see changes in real-time as they edit their resumes.
- **AI-Powered Cover Letter Generation**: Dynamically generates a tailored cover letter based on the company and role the user is applying for, utilizing key details from the resume.

## Technologies Used

- **Frontend**: React.js with Next.js framework
- **Styling**: Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **AI Integration**: GPT-based model for cover letter generation

## Getting Started

To set up the project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhavtayal6/resume-builder.git
cd resume-builder
```

### 2. Install Dependencies and Start the Servers

#### Frontend Setup

```bash
npm install
npm run dev
```

The application will be accessible at http://localhost:3000.

#### Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
pip install fastapi uvicorn pdfplumber language-tool-python python-multipart
python -m uvicorn server:app --reload --port 8000
```


This is necessary for AI-based cover letter generation and other backend functionalities.

## How the Cover Letter Generation Works

1. User fills in resume details (Name, Experience, Skills, etc.).
2. Inputs Company Name & Role they are applying for.
3. AI dynamically generates a tailored cover letter based on the resume data.
4. User reviews and customizes before finalizing.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.
