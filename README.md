# Obsidian Alias Manager

Obsidian Alias Manager (OAM) is a plugin for managing note aliases for notes in Obsidian categoried with the [Johnny Decimal system](https://johnnydecimal.com/).

## Installation

_This plugin isn't released yet, so installation isn't officially supported. If you're a developer working on Obsidian plugins, you'll know how to install this!_

## Usage

OAM will add a non-indexed alias to your note, allowing you to link to it in other notes naturally, without the index number as part of the title. The note in the below screenshot has the filename `40.00 Tornados`, as per Johnny Decimal convention. This plugin automatically adds the relevant YAML frontmatter and manages the alias `Tornados`, which is based on removing the Johnny Decimal index `40.00`:

![Example image](https://kmf.lol/2021/08/Obsidian_IfedraQyF4.png)

OAM will automatically run when a new file is created, and when your Obsidian application is initialized. If you'd like to run it manually, you can open the Command Palette (`CMD+P` on Mac, `Ctrl+P` on Windows), and run the "Update Aliases" command.

## Developer warning

**This plugin is not yet released or officially supported by the author. It can break your notes. Make backups!**

The YAML frontmatter aspect of this plugin is weird. Obsidian doesn't expose any sort of official API for managing frontmatter, so this plugin parses the Markdown content for a note, and rewrites the YAML as part of rewriting the file content. That means _all_ of the content in a note is parsed and rewritten back into the file, if the plugin determines that a new alias needs to be added. This plugin is working for my Obsidian vault, but I'm pretty new to the application, and there may be things you do in your vaults (or that plugins that you use do) that I haven't tested. **Be careful!**

## Known issues

- OAM may not run automatically on updates to notes. Manually running the "Update Aliases" command should fix this.
- OAM may have issues initializing while running through `npm run dev` (development workflow). Kill the process and run `npm run dev` again, which should fix it.
- The ability to set custom index patterns via the plugin settings page **has not been tested**, careful!