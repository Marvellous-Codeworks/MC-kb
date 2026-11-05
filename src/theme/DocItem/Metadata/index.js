import React from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Metadata from '@theme-original/DocItem/Metadata';
import useActiveProject from '@site/src/hooks/useActiveProject';

// Adds the project to the browser tab title and social cards: every project has
// an "Overview" and a "FAQ", which are otherwise identical in a row of open tabs.
export default function MetadataWrapper(props) {
  const project = useActiveProject();
  const {metadata} = useDoc();
  return (
    <>
      <Metadata {...props} />
      {project && <PageMetadata title={`${metadata.title} - ${project.label}`} />}
    </>
  );
}
