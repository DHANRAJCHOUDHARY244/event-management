import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

export default function AboutPage() {
  // Group members with real details
  const groupMembers = [
    { name: "Aman", studentId: "CIHE231402" },
    { name: "Husnain Ali", studentId: "CIHE240280" },
    { name: "Attiq", studentId: "CIHE240404" },
    { name: "Kartik Sharma", studentId: "CIHE231437" },
    { name: "Charanpal Kaur", studentId: "CIHE23865" },
  ];

  // References used
  const references = [
    "Images: Unsplash (https://unsplash.com/)",
    "Fonts: Google Fonts (https://fonts.google.com/)",
    "Icons: FontAwesome (https://fontawesome.com/)",
    "React: https://reactjs.org/",
    "Tailwind CSS: https://tailwindcss.com/",
    "PHP Documentation: https://www.php.net/",
    "MySQL Documentation: https://dev.mysql.com/doc/",
  ];

  return (
    <div>
      <PageMeta
        title="About | EventHub"
        description="Overview of Event Management System project, roles, and highlights"
      />
      <PageBreadcrumb pageTitle="About" />

      <div className="max-w-4xl mx-auto mt-6 space-y-6">
        {/* About Project */}
        <ComponentCard title="About EventHub">
          <p>
            EventHub is a web-based Event Management System designed to make event 
            creation, registration, and tracking easier for users and organizers. 
            The platform features secure authentication, real-time event listings, 
            and an interactive dashboard for managing event details.
          </p>
          <p>
            The application is built using <strong>React (Vite) + Tailwind CSS</strong> 
            for the frontend, <strong>PHP + MySQL</strong> for the backend, and 
            <strong>JWT-based authentication</strong> for secure access control. 
            State management is handled with <strong>Zustand</strong>, and Axios is 
            used for API communication.
          </p>
        </ComponentCard>

        {/* Work Distribution */}
        <ComponentCard title="Work Distribution and Roles">
          <p>
            Our team collaboratively worked on different parts of the project:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Aman:</strong> Backend API development, MySQL database design, and JWT authentication.</li>
            <li><strong>Husnain Ali:</strong> Frontend development with React and Tailwind CSS, routing, and dashboard UI.</li>
            <li><strong>Attiq:</strong> Integration of API with frontend, form validation, and error handling.</li>
            <li><strong>Kartik Sharma:</strong> Testing, debugging, and user experience improvements.</li>
            <li><strong>Charanpal Kaur:</strong> Documentation, report writing, and additional frontend components.</li>
          </ul>
        </ComponentCard>

        {/* Project Highlights */}
        <ComponentCard title="Project Highlights">
          <ul className="list-disc list-inside space-y-1">
            <li>Responsive design ensuring seamless experience across devices.</li>
            <li>Role-based access control (Admin, Organizer, User).</li>
            <li>JWT Authentication with token refresh mechanism.</li>
            <li>Dynamic dashboard for event management and registration.</li>
            <li>Secure APIs for CRUD operations and validations.</li>
          </ul>
        </ComponentCard>

        {/* Challenges */}
        <ComponentCard title="Challenges Faced">
          <p>
            One major challenge was maintaining real-time synchronization between 
            frontend and backend while implementing pagination and search filters. 
            We also faced issues with CORS configuration and token-based authentication 
            which required additional debugging.
          </p>
          <p>
            Coordinating as a team remotely and managing version control was 
            challenging but handled efficiently using Git and frequent meetings.
          </p>
        </ComponentCard>

        {/* Group Members */}
        <ComponentCard title="Group Members">
          <ul className="list-disc list-inside space-y-1">
            {groupMembers.map((member) => (
              <li key={member.studentId}>
                {member.name} - ID: {member.studentId}
              </li>
            ))}
          </ul>
        </ComponentCard>

        {/* References */}
        <ComponentCard title="References">
          <ul className="list-disc list-inside space-y-1">
            {references.map((ref, index) => (
              <li key={index}>{ref}</li>
            ))}
          </ul>
        </ComponentCard>
      </div>
    </div>
  );
}
