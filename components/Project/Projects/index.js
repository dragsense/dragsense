import Projects from "./Projects";

export default function ProjectsComponent({ user }) {
  return (
    <>
      <Projects />
      <br />
      {!user.admin && <Projects shared={true} />}
    </>
  );
}
