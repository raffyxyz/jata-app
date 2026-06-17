import { MapPin, Mail, Phone } from "lucide-react";
import { mockResume } from "../data/mock";

export function Resume() {
  const resume = mockResume;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resume</h1>
          <p className="page-subtitle">
            Your master resume. AI optimizes it for each application.
          </p>
        </div>
        <button className="btn-primary">Export PDF</button>
      </div>

      <div className="resume-layout">
        <div className="resume-sidebar">
          <div className="resume-avatar-section">
            <div className="resume-avatar">{resume.name.split(" ").map(n => n[0]).join("")}</div>
            <h2 className="resume-name">{resume.name}</h2>
            <p className="resume-title">{resume.title}</p>
          </div>

          <div className="resume-contact">
            <h3 className="resume-section-label">Contact</h3>
            <div className="resume-contact-item">
              <Mail size={14} />
              <span>{resume.email}</span>
            </div>
            <div className="resume-contact-item">
              <Phone size={14} />
              <span>{resume.phone}</span>
            </div>
            <div className="resume-contact-item">
              <MapPin size={14} />
              <span>{resume.location}</span>
            </div>
          </div>

          <div className="resume-skills">
            <h3 className="resume-section-label">Skills</h3>
            <div className="resume-skills-list">
              {resume.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="resume-languages">
            <h3 className="resume-section-label">Languages</h3>
            {resume.languages.map((lang) => (
              <span key={lang} className="resume-language">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="resume-main">
          <div className="resume-section">
            <h3 className="resume-section-title">Professional Summary</h3>
            <p className="resume-summary-text">{resume.summary}</p>
          </div>

          <div className="resume-section">
            <h3 className="resume-section-title">Experience</h3>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="resume-experience-item">
                <div className="resume-experience-header">
                  <div>
                    <h4 className="resume-experience-position">
                      {exp.position}
                    </h4>
                    <p className="resume-experience-company">{exp.company}</p>
                  </div>
                  <span className="resume-experience-date">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p className="resume-experience-description">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          <div className="resume-section">
            <h3 className="resume-section-title">Education</h3>
            {resume.education.map((edu) => (
              <div key={edu.id} className="resume-education-item">
                <div className="resume-education-header">
                  <div>
                    <h4 className="resume-education-degree">
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="resume-education-school">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="resume-education-date">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
