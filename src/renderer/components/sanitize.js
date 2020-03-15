import sanitizeHtml from "sanitize-html";

const allowedTags = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "p",
    "a",
    "ul",
    "ol",
    "nl",
    "li",
    "b",
    "i",
    "strong",
    "em",
    "strike",
    "code",
    "hr",
    "br",
    "div",
    "table",
    "thead",
    "caption",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "iframe",
    "img",
    "main",
    "style"
];

export default function (content) {
    return sanitizeHtml(content, {
        allowedTags: allowedTags,
        disallowedTagsMode: "discard",
        allowedAttributes: {
            a: ["href", "name", "target", "class"],
            img: ["src"],
            h1: ["class"],
            h2: ["class"],
            p: ["class"]
        },
        selfClosing: [
            "img",
            "br",
            "hr",
            "area",
            "base",
            "basefont",
            "input",
            "link",
            "meta"
        ],
        allowedSchemes: ["http", "https", "ftp", "mailto"],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
        allowProtocolRelative: true
    });
}