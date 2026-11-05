import React from 'react';
import Link from '@docusaurus/Link';
import Home from '@theme-original/DocBreadcrumbs/Items/Home';
import useActiveProject from '@site/src/hooks/useActiveProject';

// Starts the breadcrumbs from the project: on mobile the sidebar is closed,
// so this is the only place that says which project a page belongs to.
export default function HomeWrapper(props) {
  const project = useActiveProject();
  if (!project) {
    return <Home {...props} />;
  }
  return (
    <li className="breadcrumbs__item">
      <Link className="breadcrumbs__link" to={project.href} data-project-breadcrumb>
        {project.label}
      </Link>
    </li>
  );
}
