// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Marvellous Codeworks',
  tagline: 'Documentation, FAQs, and changelogs for Marvellous Codeworks projects.',
  favicon: 'img/MarvellousCodeworks_Logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://kb.marvellouscode.works',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Marvellous-Codeworks',
  // projectName: 'MarvellousSuspender',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          blogTitle: 'Blog - Marvellous Codeworks',
          blogDescription: 'Updates about The Marvellous Suspender project',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All posts',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/MarvellousCodeworks_Logo.png',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Marvellous Codeworks',
        logo: {
          alt: 'Marvellous Codeworks Logo',
          src: 'img/MarvellousCodeworks_Logo.png',
          href: '/docs/intro',
        },
        items: [
          {
            href: 'https://marvellouscode.works',
            label: 'Home',
            position: 'left',
          },
          {
            type: 'html',
            value: '<span class="navbar-separator" aria-hidden="true"></span>',
            position: 'left',
          },
          {
            // Clicking "Docs" lands on the Welcome page; hovering lists each
            // project's Overview. The activeBaseRegex on the dropdown keeps
            // "Docs" highlighted on every docs page, the ones on the items
            // highlight the current project's section.
            type: 'dropdown',
            label: 'Docs',
            to: '/docs/intro',
            activeBaseRegex: '^/docs/',
            position: 'left',
            items: [
              {
                label: 'Welcome',
                to: '/docs/intro',
                activeBaseRegex: '^/docs/intro',
              },
              {
                label: 'The Great-er Tab Discarder',
                to: '/docs/TGD/overview',
                activeBaseRegex: '^/docs/TGD/',
              },
              {
                label: 'The Marvellous Suspender',
                to: '/docs/TMS/overview',
                activeBaseRegex: '^/docs/TMS/',
              },
              {
                label: 'logdrop',
                to: '/docs/logdrop/overview',
                activeBaseRegex: '^/docs/logdrop/',
              },
            ],
          },
          { to: '/blog', label: "What's New", position: 'left' },
          {
            type: 'dropdown',
            label: 'Download',
            position: 'left',
            items: [
              {
                label: 'The Great-er Tab Discarder',
                href: 'https://www.marvellouscode.works/tgd',
              },
              {
                label: 'The Marvellous Suspender',
                href: 'https://www.marvellouscode.works/tms',
              },
            ],
          },
          {
            type: 'html',
            value: '<span class="navbar-separator" aria-hidden="true"></span>',
            position: 'left',
          },
          {
            href: 'pathname:///blog/rss.xml',
            position: 'right',
            className: 'header-rss-link',
            'aria-label': 'RSS feed',
          },
          {
            href: 'https://github.com/Marvellous-Codeworks',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          // {
          //   href: '/docs/download',
          //   position: 'right',
          //   className: 'header-chrome-link',
          //   'aria-label': 'Chrome Web Store',
          // },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Marvellous Codeworks',
            items: [
              {
                label: 'Who We Are',
                to: '/docs/intro',
              },
              {
                label: 'Contributing',
                to: '/docs/intro#contributing-',
              },
              {
                label: 'License',
                to: '/docs/intro#license-',
              },
              {
                label: 'Something Missing?',
                to: '/docs/intro#something-missing-%EF%B8%8F%EF%B8%8F',
              },
              {
                label: 'Support',
                to: '/docs/intro#support-',
              },
              {
                label: 'Blog RSS feed',
                href: 'pathname:///blog/rss.xml',
              },
              {
                label: 'Blog Atom feed',
                href: 'pathname:///blog/atom.xml',
              },
            ],
          },
          {
            title: 'The Great-er Tab Discarder (TGD)',
            items: [
              {
                label: 'Download TGD',
                href: 'https://www.marvellouscode.works/tgd',
              },
              {
                label: 'Overview',
                to: '/docs/TGD/overview',
              },
              {
                label: 'FAQ',
                href: '/docs/TGD/faq',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/rkodey/the-great-er-discarder-er/discussions',
              },
              {
                label: 'Open an issue',
                href: 'https://github.com/rkodey/the-great-er-discarder-er/issues/new',
              },
            ],
          },
          {
            title: 'The Marvellous Suspender (TMS)',
            items: [
              {
                label: 'Download TMS',
                href: 'https://www.marvellouscode.works/tms',
              },
              {
                label: 'Overview',
                to: '/docs/TMS/overview',
              },
              {
                label: 'FAQ',
                href: '/docs/TMS/faq',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/gioxx/MarvellousSuspender/discussions',
              },
              {
                label: 'Open an issue',
                href: 'https://github.com/gioxx/MarvellousSuspender/issues/new',
              },
            ],
          },
          {
            title: 'logdrop',
            items: [
              {
                label: 'About logdrop',
                href: 'https://www.marvellouscode.works/logdrop',
              },
              {
                label: 'Overview',
                to: '/docs/logdrop/overview',
              },
              {
                label: 'FAQ',
                to: '/docs/logdrop/faq',
              },
              {
                label: 'Self-hosting',
                to: '/docs/logdrop/self-hosting',
              },
              {
                label: 'Open an issue',
                href: 'https://github.com/Marvellous-Codeworks/logdrop/issues/new',
              },
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} The Marvellous Suspender.`,
        copyright: `<div style="padding-top: 18px;padding-bottom: 9px; text-align: right; font-size: 0.8em;">
        <p>© ${new Date().getFullYear()} Marvellous Codeworks</p>
        <p>All trademarks mentioned are the property of their respective owners. Third-party trademarks, product names, trade names, corporate names and companies mentioned may be trademarks of their respective owners or registered trademarks of other companies and have been used for explanatory purposes only and for the benefit of the owner, without any intent to infringe existing copyright.</p>
        </div>`
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
