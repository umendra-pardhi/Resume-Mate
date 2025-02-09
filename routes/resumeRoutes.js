const express = require("express");
const multer = require("multer");
// const fs = require("fs/promises");
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
  html: true  
});

const upload = multer({ dest: "uploads/" });

function fileToGenerativePart(content, mimeType) {
    return {
        inlineData: {
            data: content,
            mimeType,
        },
    };
}

module.exports = (genAI) => {
  const router = express.Router(genAI);



  router.post("/analyze", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).render("index", { error: "No resume uploaded. Please upload a valid file." });
      }

      const filePath = req.file.path;


      const resumeContent = Buffer.from(fs.readFileSync(filePath)).toString("base64");

      const resumeData = [
        fileToGenerativePart(resumeContent, "application/pdf")
    ];


      fs.unlink(filePath,

        (err => {
            if (err) console.log(err);
            else {
                console.log("\nDeleted file: "+filePath);
            }
        }));


        async function run() {


         
            const data = fs.readFileSync('roadmaps.json', 'utf8');
            const jsonData = JSON.parse(data);
          

            // const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
            const prompt1 ="you are my resume mentor, help me out to improve my resume suggest me what improvement should i do in resume. suggest these points Potential Job Roles:,Technical Skills to Develop/Highlight:,Soft Skills to Develop/Highlight:,Resume Improvements:, roadmaps links, roadmap iframe Analyze the resume in PDF format and provide the following: \
1. Suggested roadmap links (in an embedded iframe) based on matching job roles or skills. \
2. A dynamically generated iframe displaying the PDF roadmap URL. \
3. Ensure the iframe's src dynamically corresponds to the most relevant roadmap URL from the roadmap.json file. \
\n\nBehavior: \
- Read the resume content to identify the user's skills and experience. \
- Map this information against the predefined RoleBasedRoadmaps and SkillBasedRoadmaps in the roadmap.json file. \
- Suggest matching roadmaps for improvement and potential job roles. \
\n\nOutput Example: \
1. Display an embedded roadmap: \
   <iframe src='https://docs.google.com/viewer?url=https://roadmap.sh/pdfs/roadmaps/backend.pdf&embedded=true' width='560' height='315' frameborder='0'></iframe> \
2. Provide links for other related roadmaps based on the analysis. \
\n\nKey Components: \
- Resume Analyzer: Extracts text and identifies keywords. \
- Roadmap Finder: Matches keywords with entries in roadmap.json. \
- Dynamic iFrame: Constructs and displays the relevant roadmap PDF.  do not generate script code or any html code only allowed to write iframe for roadmap pdf display. generate output in properly formatted form. ";

const prompt="read my resume and give me some tips for improvement and give list of roadmaps with url and pdf_url clickable links from json file provided and job roles to apply ";
        const prompt2=`Please help me structure the resume into a more organized format, ensuring clear sections for Professional Summary, Skills, Professional Experience, Education, and Projects. Ensure the content is concise, easy to read, and well-formatted. Additionally, please rate the resume using the following points system:
                        
                        One month of full-time experience gets 2.5 points
                        Participation in open-source work gets 10 points
                        One month of internship gets 1 point
                        Having interned at a top company or a top startup or a YC startup results in 6 bonus points
                        Having worked full-time at a top company or a top startup or a YC startup results in 12 bonus points
                        Each project that has a lot of users or has made a big impact gets 3 points
                        Having a project that is technically interesting or challenging gets 4 points
                        Clear and well-structured format gets 5 points
                        Strong professional summary gets 5 points
                        Well-defined skills section gets 5 points
                        Comprehensive and relevant experience details get 5 points
                        Detailed and impactful project descriptions get 5 points
                        The total score should be out of 100. After rating the resume, provide a verbose and detailed description of what needs to be changed or improved in the resume to make it better. also provide list of roadmaps with url and pdf_url clickable links from json file provided, in output do not mention \'from json file provided\' and for pdf_url of roadmap provide output like  <iframe src='https://docs.google.com/viewer?url=https://roadmap.sh/pdfs/roadmaps/backend.pdf&embedded=true' width='560' height='315' frameborder='0'></iframe> this and by analyzing resume relevent url should be there in src url query and list of job roles to apply`;
            // const resumeContent = [
            //     fileToGenerativePart("resume.pdf", "application/pdf"),
            // ];
        
        
            const result = await model.generateContent([prompt2,data, ...resumeData]);
            const response = await result.response;
            const text = response.text();
            console.log(text);
            const html = md.render(text);
            res.render("result", { text:html });
        }


        const markdown = `## Roadmap for Umendra Pardhi's Job Search

Based on Umendra's resume, here's a roadmap for various job roles and the skills he might need to develop:

**Potential Job Roles:**

* **Junior Full Stack Developer:** This aligns perfectly with his stated objective and demonstrated skills in both front-end and back-end technologies.
* **Front-End Developer:**  His experience with React, HTML, CSS, and JavaScript makes him a suitable candidate.
* **Back-End Developer:** His projects utilizing Node.js, Express.js, and databases like Firebase and MongoDB showcase relevant back-end skills.
* **Web Developer:** A more general role focusing on website creation, where his full-stack experience would be valuable.
* **IoT Developer:** His projects involving Arduino, ESP32, and NodeMCU demonstrate interest and basic skills in IoT, offering a specialized path.
* **Freelance Developer (Full Stack/Front-End/Back-End):** His freelance experience provides a strong foundation for continued independent work.

**Skills Roadmap & Gaps:**

Umendra possesses a solid foundation, but here are some areas for improvement to enhance his marketability:

**Technical Skills to Develop/Highlight:**

* **Testing:**  His resume lacks mention of testing methodologies (unit, integration, end-to-end testing). Learning frameworks like Jest, Mocha, or Cypress would significantly enhance his profile.
* **Version Control (Git):** While Git is mentioned, showcasing deeper understanding of branching strategies, pull requests, and collaborative workflows would be beneficial. Contributing to open-source projects would demonstrate these skills effectively.
* **API Design and Development (RESTful APIs):** While implied through his full-stack work, explicitly mentioning experience designing and developing RESTful APIs using frameworks like Express.js would be advantageous.
* **Database Management:** Expanding his database knowledge beyond basic CRUD operations to include optimization, data modeling, and schema design would be valuable.
* **DevOps Practices (CI/CD):** Familiarization with continuous integration and continuous deployment pipelines using tools like Jenkins, Travis CI, or GitHub Actions would be a strong asset.
* **UI/UX Principles:** While he mentions user-friendly solutions, showcasing a deeper understanding of UI/UX principles and user-centered design would strengthen his front-end capabilities. Consider adding projects that demonstrate these skills.
* **State Management (Redux/Context API):** For more complex front-end projects, experience with state management libraries like Redux or Context API in React is essential.
* **Security Best Practices:**  Understanding and implementing secure coding practices (OWASP guidelines) is crucial for any web developer and should be highlighted.


**Soft Skills to Develop/Highlight:**

* **Communication:** While listed, provide concrete examples in the resume where effective communication played a key role in project success.
* **Problem-Solving:** Demonstrate problem-solving skills by highlighting specific challenges faced in projects and how they were overcome.   
* **Teamwork/Collaboration:** Emphasize experiences working in teams or collaborating on projects. If he hasn't had much team experience, contributing to open-source projects can fill this gap.
* **Project Management:** Even for individual projects, demonstrating basic project management skills like planning, task breakdown, and time management can impress potential employers.

**Resume Improvements:**

* **Quantify Achievements:**  Instead of just listing responsibilities, quantify achievements whenever possible.  For example, "Improved website performance by 15% by optimizing database queries."
* **Project Descriptions:** Provide more detailed descriptions of projects, including the technologies used, challenges faced, and outcomes achieved. Links to live projects or GitHub repositories are highly recommended.
* **Tailor Resume:** Customize the resume for each specific job application, highlighting the skills and experiences that are most relevant to the position.

| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |


<iframe src="https://docs.google.com/viewer?url=https://roadmap.sh/pdfs/roadmaps/backend.pdf&embedded=true" width="560" height="315" frameborder="0"></iframe>



By addressing these areas, Umendra can significantly strengthen his profile and increase his chances of landing his desired job role.`;
const html = md.render(markdown);

        // res.render("result", { text: html });
        
        run();


     


    } catch (error) {
      console.error("Error analyzing resume:", error.message);

      // Handle specific errors
      const errorMessage = error.response?.data?.error?.message || "Something went wrong. Please try again.";
      res.status(500).render("index", { error: errorMessage });
    }
  });

  return router;
};
