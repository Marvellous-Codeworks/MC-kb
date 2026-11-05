import {useActivePlugin, useActiveVersion} from '@docusaurus/plugin-content-docs/client';
import projects from '@site/src/data/projects.json';

// The project being browsed, with the link to its main page in the active version.
// Returns null on docs pages that do not belong to a project (the Welcome page).
export default function useActiveProject() {
  const pluginId = useActivePlugin()?.pluginId;
  const version = useActiveVersion(pluginId);
  const project = projects.find(({name}) => name.toLowerCase() === pluginId);
  if (!project) {
    return null;
  }
  const mainDoc = version?.docs.find(({id}) => id === version.mainDocId);
  return {label: project.label, href: mainDoc?.path ?? version?.path};
}
