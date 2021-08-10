import { App, Notice, Plugin, PluginSettingTab, Setting, parseFrontMatterAliases, Vault, TFile } from 'obsidian';
import mdify from 'mdify'

interface OAMSettings {
	indexRegex: string;
}

const DEFAULT_SETTINGS: OAMSettings = {
	indexRegex: String.raw`\d{1,}\.\d{1,}`
}

export default class OAM extends Plugin {
	settings: OAMSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.addRibbonIcon('dice', 'Sample Plugin', () => {
			new Notice('This is a notice!');
		});

		this.addCommand({
			id: 'update-aliases',
			name: 'Update Aliases',
			callback: async () => {
				this.updateAllFiles()
			},
		});

		this.addSettingTab(new OAMSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			// console.log('codemirror', cm);
		});

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			// console.log(this.app)
		});

		const regex = new RegExp(this.settings.indexRegex)
		this.app.vault.on("create", file => {
			if (file instanceof TFile) {
				this.updateFileAliases(this.app, file, regex)
			} else {
				console.log("File is TAbstractFile, not TFile, can't handle event")
			}
		})

		await this.updateAllFiles()
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async updateAllFiles() {
		const vault = this.app.vault
		const files: [TFile] = (vault as any).fileMap
		const regex = new RegExp(this.settings.indexRegex)
		await Promise.all(Object.values(files).map((file: TFile) => this.updateFileAliases(this.app, file, regex)))
	}

	async updateFileAliases(app: App, file: TFile, regex: RegExp) {
		const fileContent = await app.vault.read(file)

		const nameWithoutIndex = file
			.basename
			.replace(regex, "")
			.trim()

		if (file.basename == nameWithoutIndex) return

		const parsedFile = mdify.parse(fileContent)
		let aliases: string[] = []

		if (parsedFile.metadata && parsedFile.metadata.aliases) {
			aliases = aliases.concat(parsedFile.metadata.aliases)

			if (!parsedFile.metadata.aliases.includes(nameWithoutIndex)) {
				aliases.push(nameWithoutIndex)
			}
		} else {
			// Add frontmatter and aliases since there isn't any
			aliases = [nameWithoutIndex]
		}

		const newContent = mdify.stringify({ aliases }, parsedFile.markdown)
		await app.vault.modify(file, newContent)
	}
}

class OAMSettingTab extends PluginSettingTab {
	plugin: OAM;

	constructor(app: App, plugin: OAM) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings' });

		new Setting(containerEl)
			.setName('Index Regex')
			.setDesc("Index for parsing your index system. By default, this is the Johnny Decimal system, such as '12.34'.")
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.indexRegex)
				.setValue('')
				.onChange(async (value) => {
					this.plugin.settings.indexRegex = value;
					await this.plugin.saveSettings();
				}));
	}
}
