import React from 'react';
import Link from '@docusaurus/Link';
import Content from '@theme-original/DocSidebar/Desktop/Content';
import useActiveProject from '@site/src/hooks/useActiveProject';

// Keeps the project name above the page tree, visible while scrolling.
export default function ContentWrapper(props) {
  const project = useActiveProject();
  return (
    <>
      {project && (
        <Link className="sidebar-project" to={project.href} data-project-sidebar>
          {project.label}
        </Link>
      )}
      <Content {...props} />
    </>
  );
}
