/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
    plugins: [
        "@ianvs/prettier-plugin-sort-imports"
    ],
    importOrder: [
        "<TYPES>",
        "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
        "<THIRD_PARTY_MODULES>",
        "",
        "<TYPES>^@repo",
        "^@repo/(.*)$",
        "",
        "<TYPES>^[.|..|~]",
        "^~/",
        "^[../]",
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "5.0.0",
    overrides: [
        {
            files: "*.json.hbs",
            options: {
                parser: "json",
            },
        },
        {
            files: "*.ts.hbs",
            options: {
                parser: "babel",
            },
        },
    ],
};

export default config;