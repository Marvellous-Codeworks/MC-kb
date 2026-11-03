---
slug: tms-tooltips-translators
title: "Help tooltips in TMS 9.1.0: easier to translate, easier to reach"
description: "TMS 9.1.0, now in review on the Chrome Web Store, rewrites how the help tooltips on the Settings and Backup pages are stored and shown. Translators get one string per paragraph instead of hand-cut fragments, keyboard and screen reader users can reach every tooltip, and we are looking for a native Sinhala speaker to review a few sentences."
date: 2026-11-03T11:00:00+01:00
authors: [gioxx]
tags: [tms, feature, news]
---

The small ⓘ icons next to many options on the Settings and Backup pages are one of the less visible parts of TMS, and one of the most translated: 25 tooltips, available in 18 languages. [TMS 9.1.0](/blog/tms-9-1-0-on-its-way), [submitted to Google for review today](/blog/tms-9-1-0-submitted) and on its way to everyone as an automatic update, changes how their text is stored and how they are shown. Nothing is gone from them; what changes is the work it takes to translate them, and who can read them.

:::tip[TL;DR]
- **Part of 9.1.0, now in review on the Chrome Web Store.** On Crowdin the new strings are already live, so translators can work on them today.
- **For translators:** each tooltip paragraph is now a single string. No more sentences cut into 70-character pieces, no line breaks to place by hand. The number of strings per language went from 482 to 446.
- **For everyone:** tooltips wrap by themselves, open above their option instead of running off the edge of the page, and can be reached with the Tab key. Screen readers read their text.
- **Can you read Sinhala?** A few Sinhala tooltip sentences need a native speaker's eye. Details [below](/blog/tms-tooltips-translators#a-request-for-sinhala-speakers).
:::

{/* truncate */}

## What translators had to deal with

Until 9.0.3, a tooltip could not wrap its own text: every line was shown exactly as written. To keep tooltips at a readable width, the English text was split by hand into fragments of about 70 characters, each stored as its own string (`…_line1a`, `…_line1b`, `…_line1c`, and so on).

That meant translators on [Crowdin](https://crowdin.com/project/tms) received half sentences with no indication of where the rest was. A fragment like "If enabled, it will force a tab to suspend instead" makes little sense alone, and the translation had to be cut at the same points as the English one, even when the grammar of the language puts the words in a completely different order. Some languages coped by stuffing the whole sentence into the first fragment and leaving the others nearly empty; others ended up with sentences that only read correctly if you knew how they had been split.

## One string per paragraph

In 9.1.0 the tooltip wraps its own text within a maximum width, so the hand splitting is no longer needed. Each paragraph is now one string: the 66 old fragments became 30 complete paragraphs, and every language went from 482 to 446 strings.

We did not throw away any existing work. The translations already on Crowdin were joined back together, with a space between pieces (or without one, for Japanese and Chinese), and loaded onto the new strings, so every language kept its tooltips from day one. Two of those joins needed fixing by hand, and they have been.

The breaks between paragraphs live in the page itself, not in the strings, so **no translator ever has to add a `\n` or any other special character**. On Crowdin each of the 30 strings carries a short note saying exactly that: the text wraps by itself, write it as one paragraph.

## Easier to reach

The same change fixed how tooltips behave on the page:

- **They stay on screen.** A tooltip now opens above its option, starting from the left edge of the row, instead of centred on the small icon. Long tooltips used to run off the edge of the page, and in German and Japanese an invisible one even added a horizontal scrollbar.
- **They work from the keyboard.** Each ⓘ icon can now be reached with the Tab key, and the tooltip opens when it gets focus, not only on mouse hover.
- **Screen readers read them.** The icon is labelled with the tooltip's text, so a screen reader announces the explanation instead of an unnamed image.

None of this needs anything from you: Chrome installs 9.1.0 by itself when it is out, and the next time you open the Settings page the tooltips are there, in your language.

## A request for Sinhala speakers

The automatic joining works well when the pieces of a sentence were translated in the same order as the English. For Sinhala that was not always true: in a few tooltips, the joined sentence has its parts in an order that does not read naturally. One example is the help text of "Add The Marvellous Suspender to right-click context menu", whose two halves ended up swapped around the verb.

We do not speak Sinhala, and we would rather not guess. If you do, you can help in a few minutes:

1. Open the [TMS project on Crowdin](https://crowdin.com/project/tms) and join it (a free Crowdin account is enough).
2. Choose **Sinhala** and look for the strings whose identifier contains `tooltip`.
3. Fix any sentence that does not read well. Each one is a full paragraph now, so you can rewrite it freely.

Your corrections reach TMS through the next Crowdin sync, with no further step on your side. The same goes for any other language: if a tooltip reads oddly in yours, Crowdin is the place to fix it, and now a single paragraph at a time.
