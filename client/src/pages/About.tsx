import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";

export default function AboutPage() {
  // Sample group members
  const groupMembers = [
    { name: "Dhanraj Choudhary", studentId: "123456" },
    { name: "Member 2", studentId: "234567" },
    { name: "Member 3", studentId: "345678" },
  ];

  // Sample references
  const references = [
    "Images: Unsplash.com (https://unsplash.com/)",
    "Fonts: Google Fonts (https://fonts.google.com/)",
    "Icons: FontAwesome (https://fontawesome.com/)",
  ];

  return (
    <div>
      <PageMeta
        title="About | Dashboard"
        description="Overview of our web application, roles, and project highlights"
      />
      <PageBreadcrumb pageTitle="About" />

      <div className="max-w-4xl mx-auto mt-6 space-y-6">
        <ComponentCard title="Work Distribution and Roles">
          <p>
            Our project tasks were carefully divided among group members to
            maximize efficiency and leverage individual strengths. Dhanraj
            Choudhary handled backend development including API creation and
            database management. Member 2 focused on frontend development,
            ensuring responsive design and integrating React components. Member
            3 was responsible for testing, debugging, and documentation to
            maintain quality and clarity throughout the project.
          </p>
          <p>
            Each member contributed to team meetings, brainstorming sessions,
            and code reviews to ensure smooth collaboration and timely
            completion of tasks. Roles were flexible enough to allow for peer
            support whenever someone faced challenges or needed assistance.
          </p>
        </ComponentCard>

        <ComponentCard title="Project Highlights">
          <p>
            One of the most exciting aspects of our project was the implementation
            of a dynamic events dashboard that allows real-time event management
            and interactive user experiences. We also integrated secure
            authentication using JWT and Zustand for state management, ensuring
            both security and efficiency.
          </p>
          <p>
            Another highlight was our responsive design, which ensures a
            seamless experience across multiple devices. The integration of
            date pickers, search filters, and sorting functionalities added
            professional-grade usability to the platform.
          </p>
        </ComponentCard>

        <ComponentCard title="Challenges Faced">
          <p>
            One primary challenge we faced was synchronizing backend API
            responses with frontend state in real-time while handling
            pagination, filters, and search simultaneously. Ensuring data
            consistency and reducing latency required careful planning and
            testing.
          </p>
          <p>
            Additionally, coordinating among multiple team members in a remote
            setup created challenges in communication and version control,
            which we overcame using Git and regular team meetings to align
            progress.
          </p>
        </ComponentCard>

        <ComponentCard title="Group Members">
          <ul className="list-disc list-inside space-y-1">
            {groupMembers.map((member) => (
              <li key={member.studentId}>
                {member.name} - ID: {member.studentId}
              </li>
            ))}
          </ul>
        </ComponentCard>

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
