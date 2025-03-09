// interface ResumePreviewProps {
//   resumeData: Record<number, string>
//   questions: string[]
// }

// export default function ResumePreview({ resumeData, questions }: ResumePreviewProps) {
//   // Extract data for the resume
//   const name = resumeData[0] || "Your Name"
//   const contact = resumeData[1] || "your.email@example.com | (123) 456-7890"
//   const title = resumeData[2] || "Professional Title"
//   const education = resumeData[3] || "Education details"
//   const technicalSkills = resumeData[4] || "Technical skills"
//   const softSkills = resumeData[5] || "Soft skills"
//   const recentExperience = resumeData[6] || "Recent work experience"
//   const otherExperience = resumeData[7] || "Other work experience"
//   const certifications = resumeData[8] || "Certifications and awards"
//   const summary = resumeData[9] || "Professional summary"

//   return (
//     <div className="border rounded-xl p-8 bg-white text-black shadow-xl">
//       <div className="text-center mb-8 pb-4 border-b-2 border-amber-500/20">
//         <h1 className="text-4xl font-bold mb-2 text-zinc-900">{name}</h1>
//         <p className="text-amber-600 font-medium text-lg">{title}</p>
//         <p className="text-sm mt-2 text-zinc-600">{contact}</p>
//       </div>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold border-b pb-2 mb-3 border-zinc-200 text-zinc-800 flex items-center">
//           <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-2 inline-block"></span>
//           Professional Summary
//         </h2>
//         <p className="text-zinc-700">{summary}</p>
//       </div>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold border-b pb-2 mb-3 border-zinc-200 text-zinc-800 flex items-center">
//           <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-2 inline-block"></span>
//           Skills
//         </h2>
//         <div className="grid grid-cols-2 gap-6">
//           <div className="bg-zinc-50 p-4 rounded-lg">
//             <h3 className="font-medium mb-2 text-amber-600">Technical Skills</h3>
//             <p className="text-zinc-700">{technicalSkills}</p>
//           </div>
//           <div className="bg-zinc-50 p-4 rounded-lg">
//             <h3 className="font-medium mb-2 text-amber-600">Soft Skills</h3>
//             <p className="text-zinc-700">{softSkills}</p>
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold border-b pb-2 mb-3 border-zinc-200 text-zinc-800 flex items-center">
//           <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-2 inline-block"></span>
//           Experience
//         </h2>
//         <div className="space-y-4">
//           <div className="bg-zinc-50 p-4 rounded-lg">
//             <h3 className="font-medium text-amber-600">Recent Position</h3>
//             <p className="text-zinc-700 mt-1">{recentExperience}</p>
//           </div>
//           <div className="bg-zinc-50 p-4 rounded-lg">
//             <h3 className="font-medium text-amber-600">Previous Position</h3>
//             <p className="text-zinc-700 mt-1">{otherExperience}</p>
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold border-b pb-2 mb-3 border-zinc-200 text-zinc-800 flex items-center">
//           <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-2 inline-block"></span>
//           Education
//         </h2>
//         <div className="bg-zinc-50 p-4 rounded-lg">
//           <p className="text-zinc-700">{education}</p>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold border-b pb-2 mb-3 border-zinc-200 text-zinc-800 flex items-center">
//           <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-2 inline-block"></span>
//           Certifications & Awards
//         </h2>
//         <div className="bg-zinc-50 p-4 rounded-lg">
//           <p className="text-zinc-700">{certifications}</p>
//         </div>
//       </div>
//     </div>
//   )
// }


import React from 'react';
import { Briefcase, GraduationCap, Award, Code, UserCircle2, Mail, Phone, FolderGit2 } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: Record<number, string>
  questions: string[]
}

export default function ResumePreview({ resumeData, questions }: ResumePreviewProps) {
  // Extract data for the resume
  const name = resumeData[0] || "Your Name"
  const contact = resumeData[1] || "your.email@example.com | (123) 456-7890"
  const title = resumeData[2] || "Professional Title"
  const education = resumeData[3] || "Education details"
  const technicalSkills = resumeData[4] || "Technical skills"
  const softSkills = resumeData[5] || "Soft skills"
  const recentExperience = resumeData[6] || "Recent work experience"
  const otherExperience = resumeData[7] || "Other work experience"
  const certifications = resumeData[8] || "Certifications and awards"
  const summary = resumeData[9] || "Professional summary"
  const projects = resumeData[10] || "Notable projects"

  // Split contact information
  const [email, phone] = contact.split('|').map(item => item.trim());

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-slate-900 text-white px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <h2 className="text-xl text-slate-300 font-medium mb-4">{title}</h2>
        <div className="flex items-center gap-6 text-slate-300">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>{phone}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle2 className="text-slate-700" size={24} />
            <h2 className="text-2xl font-semibold text-slate-900">Professional Summary</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Code className="text-slate-700" size={24} />
            <h2 className="text-2xl font-semibold text-slate-900">Skills</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Technical Skills</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">{technicalSkills}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Soft Skills</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700">{softSkills}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="text-slate-700" size={24} />
            <h2 className="text-2xl font-semibold text-slate-900">Professional Experience</h2>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-slate-900 pl-4">
              <h3 className="font-semibold text-slate-900 mb-2">Recent Position</h3>
              <p className="text-slate-700">{recentExperience}</p>
            </div>
            <div className="border-l-4 border-slate-300 pl-4">
              <h3 className="font-semibold text-slate-900 mb-2">Previous Position</h3>
              <p className="text-slate-700">{otherExperience}</p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FolderGit2 className="text-slate-700" size={24} />
            <h2 className="text-2xl font-semibold text-slate-900">Notable Projects</h2>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700 whitespace-pre-line">{projects}</p>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="text-slate-700" size={24} />
            <h2 className="text-2xl font-semibold text-slate-900">Education</h2>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700">{education}</p>
          </div>
        </section>

        {/* Certifications Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-slate-700" size={24} />
            <h2 className="text-2xl font-semibold text-slate-900">Certifications & Awards</h2>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700">{certifications}</p>
          </div>
        </section>
      </div>
    </div>
  );
}