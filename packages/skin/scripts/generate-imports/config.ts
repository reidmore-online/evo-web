export interface ConfigModules {
    [key: string]: string[];
}

export interface Config {
    modules: ConfigModules;
    skip: string[];
    skipIndex: string[];
    overrideFile: {
        [key: string]: string;
    };
    addModules: ConfigModules;
    nested: {
        [key: string]: ConfigModules;
    };
}

const config: Config = {
    modules: {
        core: ["global", "utility"],
        combo: ["core", "lightbox-dialog", "form", "progress-spinner"],
        form: [
            "button",
            "checkbox",
            "field",
            "radio",
            "select",
            "switch",
            "textbox",
        ],
    },
    skip: [
        "bundles",
        "gh",
        "mixins",
        "tokens",
        "svg",
        "icon-large",
        "variables",
    ],
    skipIndex: ["dark-mode", "rounded-off", "variables"],
    overrideFile: {},
    addModules: {
        calendar: ["icon-button"],
        "drawer-dialog": ["icon-button"],
        "date-textbox": ["calendar", "textbox"],
        "fullscreen-dialog": ["icon-button"],
        infotip: ["icon-button"],
        "lightbox-dialog": ["icon-button"],
        "listbox-button": ["button"],
        "menu-button": ["button"],
        "number-input": ["textbox"],
        "page-notice": ["button"],
        pagination: ["icon-button"],
        "panel-dialog": ["icon-button"],
        "section-notice": ["button"],
        "split-button": ["button", "menu-button"],
        "toast-dialog": ["icon-button"],
        "toggle-button-group": ["toggle-button"],
        tourtip: ["icon-button"],
    },
    nested: {
        tokens: {
            index: ["evo-core", "evo-light"],
            tokens: ["tokens/evo-core", "tokens/evo-light"],
        },
    },
};
export default config;
