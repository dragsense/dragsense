const fs = require("fs");
const { wordToNumber } = require("./utils");

const longStrings = [
  "",
  "This is an example content for testing purposes.",
  "Another piece of sample text to represent node value.",
  "",
  "A dynamically generated content string for simulation.",
  "This text is generated as a test example.",
  "",
  "Some random sample content used for testing.",
  "Test string used in this simulation.",
  "",
];

const shortStrings = [
  "Short text",
  "",
  "Example text",
  "",
  "Node content",
  "Sample data",
  "",
  "Random value",
  "",
  "Test string",
  "",
  "Demo content",
];

// Function to generate a random string content for names, text, etc.
function getRandomString(tag) {
  return ["p", "blockquote"].includes(tag)
    ? longStrings[Math.floor(Math.random() * longStrings.length)]
    : shortStrings[Math.floor(Math.random() * shortStrings.length)];
}

const htmlTags = [
  {
    tag: "h1",
    names: [
      "h1",
      "H1",
      "Heading 1",
      "Main Title",
      "Primary Title",
      "Title 1",
      "Header 1",
      "h1s",
      "H1s",
      "Main Headings",
      "Top Heading",
    ],
  },
  {
    tag: "h2",
    names: [
      "h2",
      "H2",
      "Sub Heading",
      "Secondary Title",
      "Title 2",
      "Header 2",
      "h2s",
      "H2s",
      "Subheadings",
      "Level 2 Heading",
    ],
  },
  {
    tag: "h3",
    names: [
      "h3",
      "H3",
      "Section Title",
      "Tertiary Title",
      "Title 3",
      "Header 3",
      "h3s",
      "H3s",
      "Section Headings",
      "Level 3 Heading",
    ],
  },
  {
    tag: "h4",
    names: [
      "h4",
      "H4",
      "Subsection Title",
      "Quaternary Heading",
      "Title 4",
      "Header 4",
      "h4s",
      "H4s",
      "Subsection Headings",
      "Level 4 Heading",
    ],
  },
  {
    tag: "h5",
    names: [
      "h5",
      "H5",
      "Fifth Level Title",
      "Quinary Heading",
      "Title 5",
      "Header 5",
      "h5s",
      "H5s",
      "Fifth Level Headings",
      "Level 5 Heading",
    ],
  },
  {
    tag: "h6",
    names: [
      "h6",
      "H6",
      "Sixth Level Title",
      "Senary Heading",
      "Title 6",
      "Header 6",
      "h6s",
      "H6s",
      "Sixth Level Headings",
      "Level 6 Heading",
    ],
  },
  {
    tag: "p",
    names: [
      "p",
      "P",
      "Paragraph",
      "Text Block",
      "Body Text",
      "Phrases",
      "Sentences",
      "ps",
      "Paragraphs",
      "Text Content",
    ],
  },
  {
    tag: "div",
    names: [
      "div",
      "Div",
      "Container",
      "Division",
      "divs",
      "Divs",
      "Containers",
      "Div Blocks",
      "Content Area",
    ],
  },
  {
    tag: "span",
    names: [
      "span",
      "Span",
      "Inline Text",
      "Small Text",
      "spans",
      "Spans",
      "Inline Elements",
      "Text Span",
    ],
  },
  {
    tag: "ul",
    names: [
      "ul",
      "UL",
      "Unordered List",
      "List Block",
      "uls",
      "ULs",
      "Lists",
      "Bullet Points",
    ],
  },
  {
    tag: "ol",
    names: [
      "ol",
      "OL",
      "Ordered List",
      "Numbered List",
      "ols",
      "OLs",
      "Ordered Lists",
      "Numbered Items",
    ],
  },
  {
    tag: "li",
    names: [
      "li",
      "LI",
      "List Item",
      "Bullet Point",
      "Items",
      "List Elements",
      "lis",
      "LIs",
      "List Entries",
    ],
  },
  {
    tag: "button",
    names: [
      "button",
      "Button",
      "Action Button",
      "Clickable",
      "buttons",
      "Buttons",
      "Interactive Button",
    ],
  },
  {
    tag: "section",
    names: [
      "section",
      "Section",
      "Content Area",
      "Segment",
      "sections",
      "Sections",
      "Content Segments",
    ],
  },
  {
    tag: "article",
    names: [
      "article",
      "Article",
      "Content Piece",
      "Entry",
      "articles",
      "Articles",
      "Content Entries",
    ],
  },
  {
    tag: "header",
    names: [
      "header",
      "Header",
      "Top Section",
      "Header Section",
      "headers",
      "Headers",
      "Top Headers",
    ],
  },
  {
    tag: "footer",
    names: [
      "footer",
      "Footer",
      "Bottom Section",
      "Footer Section",
      "footers",
      "Footers",
      "Bottom Headers",
    ],
  },
  {
    tag: "aside",
    names: [
      "aside",
      "Aside",
      "Sidebar",
      "Complementary Section",
      "asides",
      "Asides",
      "Sidebar Elements",
    ],
  },
  {
    tag: "blockquote",
    names: [
      "blockquote",
      "Blockquote",
      "Quote Block",
      "Citation",
      "blockquotes",
      "Blockquotes",
      "Citations",
    ],
  },
  {
    tag: "main",
    names: [
      "main",
      "Main",
      "Main Content",
      "Primary Content Area",
      "mains",
      "Mains",
      "Main Sections",
    ],
  },
  {
    tag: "video",
    names: [
      "video",
      "Video",
      "Video Clip",
      "Media",
      "videos",
      "Videos",
      "Video Player",
      "Multimedia",
    ],
  },
  {
    tag: "img",
    names: [
      "img",
      "Image",
      "Picture",
      "Photo",
      "images",
      "Imgs",
      "Pics",
      "Photos",
      "Image Elements",
      "Graphics",
    ],
  },
  {
    tag: "audio",
    names: [
      "audio",
      "Audio",
      "Sound Clip",
      "Sound",
      "audio clips",
      "Audios",
      "Audio Player",
      "Soundtrack",
      "Audios",
    ],
  },
  {
    tag: "input",
    names: [
      "input",
      "Input",
      "Form Field",
      "Textbox",
      "Form Element",
      "inputs",
      "Input Fields",
      "Text Field",
      "Input Element",
      "Form Inputs",
    ],
  },
  {
    tag: "select",
    names: [
      "select",
      "Dropdown",
      "Select Box",
      "Selection Field",
      "Options Menu",
      "selects",
      "Drop-downs",
      "Selection Box",
      "Select Input",
      "Option Selector",
    ],
  },
];

// Function to generate a random HTML tag with uppercase variations and more options
function getRandomHtmlTag() {
  const randomTag = htmlTags[Math.floor(Math.random() * htmlTags.length)];
  return {
    tag: randomTag.tag,
    tagValue: randomTag.names[Math.floor(Math.random() * randomTag.names.length)],
  };
}

// Function to generate a random quantity for the tags (includes "many" with large numbers)
function getRandomQuantity() {
  const quantities = [
    { number: 1, word: "" },
    { number: Math.floor(Math.random() * 3) + 1, word: "one" },
    { number: Math.floor(Math.random() * 5) + 1, word: "two" },
    { number: 1, word: "" },
     { number: Math.floor(Math.random() * 10) + 1, word: "three" },
    { number: Math.floor(Math.random() * 20) + 1, word: "four" },
    { number: Math.floor(Math.random() * 50) + 1, word: "five" },
    { number: Math.floor(Math.random() * 100) + 1, word: "six" },
    { number: 1, word: "" },
    /*{ number: Math.floor(Math.random() * 500) + 1, word: "seven" },
    { number: Math.floor(Math.random() * 1000) + 1, word: "" },
    { number: Math.floor(Math.random() * 3000) + 1, word: "eight" },
    { number: Math.floor(Math.random() * 5000) + 1, word: "nine" },
    { number: 1, word: "" },
    { number: Math.floor(Math.random() * 10000) + 1, word: "ten" },
    { number: 1, word: "" }, */
  ];

  const randomQuantity =
    quantities[Math.floor(Math.random() * quantities.length)];
  return {
    quantity: randomQuantity.number,
    quantityValue:
      randomQuantity.word === "" ? randomQuantity.word : randomQuantity.number,
  };
}

// Function to generate random child phrases and quantities (includes random child tag names)
function getRandomChildQuantity() {
  const childQuantities = [
    { number: 0, word: "" }, // 0 children
    { number: 1, word: "one" }, // 1 child
    { number: 0, word: "" }, // 0 children
    { number: 1, word: "1" }, // 1 child (alternative)
    { number: 2, word: "two" }, // 2 children
    { number: 0, word: "" }, // 0 children
    { number: 2, word: "2" }, // 2 children (numeric, alternative)
    { number: 3, word: "three" }, // 3 children
    { number: 0, word: "" }, // 0 children
    { number: 3, word: "3" }, // 3 children (numeric, alternative)
    { number: 4, word: "four" }, // 4 children
    { number: 0, word: "" }, // 0 children
    { number: 4, word: "4" }, // 4 children (numeric, alternative)
    { number: 5, word: "five" }, // 5 children
    { number: 0, word: "" }, // 0 children
    { number: 5, word: "5" }, // 5 children (numeric, alternative)
    { number: 6, word: "six" }, // 6 children
    { number: 0, word: "" }, // 0 children
    { number: 6, word: "6" }, // 6 children (numeric, alternative)
    { number: 7, word: "seven" }, // 7 children
    { number: 7, word: "7" }, // 7 children (numeric, alternative)
    { number: 8, word: "eight" }, // 8 children
    { number: 0, word: "" }, // 0 children
    { number: 8, word: "8" }, // 8 children (numeric, alternative)
    { number: 9, word: "nine" }, // 9 children
    { number: 9, word: "9" }, // 9 children (numeric, alternative)
    { number: 10, word: "ten" }, // 10 children
    { number: 0, word: "" }, // 0 children
    { number: 10, word: "10" }, // 10 children (numeric, alternative)
    { number: 12, word: "a dozen" },
    { number: 0, word: "" }, // 0 children
    { number: 12, word: "dozen" },
    { number: 0, word: "" }, // 0 children
    { number: Math.floor(Math.random() * 3) + 3, word: "several" }, // Random 3-5
    { number: Math.floor(Math.random() * 3) + 2, word: "a few" }, // Random 2-4
    { number: 0, word: "" }, // 0 children
    { number: Math.floor(Math.random() * 3) + 2, word: "few" }, // Random 2-4
    { number: Math.floor(Math.random() * 3) + 10, word: "many" }, // Random 10-12
    { number: 2, word: "a couple" },
    { number: 0, word: "" }, // 0 children
    { number: 2, word: "couple" },
    { number: 0, word: "" }, // 0 children
  ];

  const randomChildQuantity =
    childQuantities[Math.floor(Math.random() * childQuantities.length)];
  return {
    childQuantity: randomChildQuantity.number,
    childQuantityValue: randomChildQuantity.word,
  };
}

function getNthRandomChildQuantity() {
  const random1 = Math.floor(Math.random() * 3) + 3;
  const random2 = Math.floor(Math.random() * 5) + 3;
  const random3 = Math.floor(Math.random() * 10) + 3;
  const random4 = Math.floor(Math.random() * 20) + 3;
  const random5 = Math.floor(Math.random() * 50) + 3;
  const random6 = Math.floor(Math.random() * 100) + 3;
  const random7 = Math.floor(Math.random() * 200) + 3;
  const random8 = Math.floor(Math.random() * 500) + 3;
  const random9 = Math.floor(Math.random() * 1000) + 3;
  const random10 = Math.floor(Math.random() * 5000) + 3;
  const random11 = Math.floor(Math.random() * 10000) + 3;

  const childPositions = [
    { value: "i", word: "" },
    { value: "i", word: "every" }, // First child (alternative)
    { value: "1", word: "first" }, // First child (alternative)
    { value: "2", word: "second" }, // Second child (alternative)
    { value: "3", word: "third" }, // Third child (alternative)
    { value: "4", word: "fourth" }, // Fourth child (alternative)
    { value: "i", word: "" },
    { value: "5", word: "fifth" }, // Fifth child (alternative)
    { value: "6", word: "sixth" }, // Sixth child (alternative)
    { value: "7", word: "seventh" }, // Seventh child (alternative)
    { value: "i", word: "" },
    { value: "8", word: "eighth" }, // Eighth child (alternative)
    { value: "9", word: "ninth" }, // Ninth child (alternative)
    { value: "10", word: "tenth" }, // Last child (generic)
    { value: "i", word: "every" }, // First child (alternative)
    { value: "i", word: "" },
    { value: "i", word: "every first" }, // First child (alternative)
    { value: "i+2", word: "every second" }, // Second child (alternative)
    { value: "i+3", word: "every third" }, // Third child (alternative)
    { value: "i", word: "" },
    { value: "i+4", word: "every fourth" }, // Fourth child (alternative)
    { value: "i+5", word: "every fifth" }, // Fifth child (alternative)
    { value: "i+6", word: "every sixth" }, // Sixth child (alternative)
    { value: "i", word: "" },
    { value: "i+7", word: "every seventh" }, // Seventh child (alternative)
    { value: "i+8", word: "every eighth" }, // Eighth child (alternative)
    { value: "i+9", word: "every ninth" }, // Ninth child (alternative)
    { value: "i", word: "" },
    { value: "i+10", word: "every tenth" }, // Last child (generic)
    { value: "i", word: "every 1st" }, // First child (alternative)
    { value: "i+2", word: "every 2nd" }, // Second child (alternative)
    { value: "i+3", word: "every 3rd" }, // Third child (alternative)
    { value: `i+${random1}`, word: `every ${random1}th}` },
    { value: `i+${random2}`, word: `every ${random2}th}` },
    { value: "i", word: "" },
    { value: `i+${random3}`, word: `every ${random3}th}` },
    { value: `i+${random4}`, word: `every ${random4}th}` },
    { value: "i", word: "" },
    { value: `i+${random5}`, word: `every ${random5}th}` },
    { value: `i+${random6}`, word: `every ${random6}th}` },
    { value: "i", word: "" },
    { value: `i+${random7}`, word: `every ${random7}th}` },
    { value: "i", word: "" },
    { value: `i+${random8}`, word: `every ${random8}th}` },
    { value: `i+${random9}`, word: `every ${random9}th}` },
    { value: "i", word: "" },
    { value: `i+${random10}`, word: `every ${random10}th}` },
    { value: `i+${random11}`, word: `every ${random11}th}` },
    { value: "i", word: "" },
  ];

  const randomChildPosition =
    childPositions[Math.floor(Math.random() * childPositions.length)];
  return {
    childPosition: randomChildPosition.value,
    childPositionValue: randomChildPosition.word,
  };
}

// Function to shuffle elements of an array
function shuffleArray(array) {
  return array; //array.sort(() => Math.random() - 0.5);
}

const names = [
  "",
  "My Heading",
  "Your Title",
  "",
  "The Section",
  "Content Block",
  "Intro Paragraph",
  "Overview",
  "",
  "Summary",
  "Detailed Explanation",
  "Key Points",
  "",
  "Main Topic",
  "Discussion",
  "",
];

// Function to generate random names (titles, labels)
function getRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}

const classNames = [
  "",
  "class1 class2",
  "class1, class2",
  "",
  "class1 class2 class3",
  "class1, class2, class3",
  "my-class",
  "",
  "main-class",
  "main-class sec-class",
  "main-class, sec-class",
  "",
];

function getRandomClassName() {
  return classNames[Math.floor(Math.random() * classNames.length)];
}

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


const possibleAttributes = [
  "data-id",
  "aria-label",
  "href",
  "src",
  "alt",
  "title",
  "class",
  "id",
  "role",
  "name",
  "placeholder",
  "value",
  "type",
  "width",
  "height",
];

// Generate random attributes with various connectors
function getRandomAttributes() {
  const connectors = [" = ", " : "]; // Different connectors to use
  const quoteStyles = ['"', "'", "", "()"]; // Different quote styles to use
  const randomNumber = Math.floor(Math.random() * 3) + 1; // Ensure at least one attribute is generated

  let attributes = [];

  const connector = getRandomFromArray(connectors);
  const quoteStyle = getRandomFromArray(quoteStyles);

  // Loop to generate random attributes
  for (let i = 0; i < randomNumber; i++) {
    // Generate random value using the selected quote style
    let value;
    if (quoteStyle === "()") {
      value = `( value )`; // Enclose value in parentheses
    } else {
      value = `${quoteStyle}value${quoteStyle}`;
    }

    // Create the final attribute string with a possible space after the attribute (except for the last one)
    let space = i === randomNumber - 1 ? "" : " ";
    const attribute = `${getRandomFromArray(
      possibleAttributes
    )}${connector}${value}${space}`;

    attributes.push(attribute);
  }

  return attributes;
}

const attrPhrases = [
  "properties",
  "fields",
  "parameters",
  "options",
  "settings",
  "specs",
  "props",
  "args",
  "descriptors",
  "characteristics",
  "qualifiers",
  "values",
  "flags",
  "keys",
  "params",
  "attrs",
  "arguments",
  "modifiers",
  "aspects",
  "variables",
  "traits",
  "vars",
  "identifiers",
  "details",
  "opts",
  "values",
  "ids",
  "id",
  "qualifiers",
  "attributes",
  "tags",
  "data",
  "elements",
  "propsList",
  "features",
  "inputs",
];

const namePhrases = [
  "named",
  "labeled",
  "called",
  "entitled",
  "titled as",
  "designated",
  "referred to as",
  "tagged",
  "marked as",
  "identified as",
  "denoted",
  "known as",
  "alias",
];

const contentPhrases = [
  "with content",
  "containing",
  "having",
  "with text as",
  "comprising",
  "holding",
  "filled with",
  "including",
  "consisting of",
  "featuring",
  "embedding",
  "populated by",
  "loaded with",
];

const classPhrases = [
  "have class",
  "with class",
  "ClassNames",
  "ClassName",
  "classes",
  "Classname",
  "classnames",
  "classname",
  "className",
  "classNames",
  "with CSS class",
  "styled by class",
  "with classNames",
];

const childPhrases = [
  "has",
  "with",
  "containing",
  "having",
  "including",
  "comprising",
  "hosting",
  "featuring",
  "accommodating",
  "encapsulating",
  "surrounding",
];

const childLabels = [
  "childs",
  "children",
  "nested elements",
  "sub-elements",
  "descendants",
  "sub-items",
  "nodes",
  "child elements",
  "child nodes",
  "inner elements",
];

const actionVerbs = [
  "create",
  "insert",
  "",
  "add",
  "define",
  "generate",
  "set",
  "build",
  "initialize",
  "render",
  "append",
  "construct",
  "",
  "compose",
  "assign",
  "establish",
  "develop",
  "append element",
  "create tag",
  "create tags",
  "append tag",
  "",
  "append tags",
  "add element",
  "add tag",
  "insert element",
  "insert tag",
  "",
  "define tag",
  "define element",
  "initialize tag",
  "initialize element",
  "render element",
  "",
  "render tag",
  "build element",
  "build tag",
  "compose element",
  "compose tag",
  "construct tag",
  "construct element",
  "generate tag",
  "",
  "generate element",
  "set element",
  "set tag",
  "establish tag",
  "",
  "establish element",
  "build structure",
  "compose structure",
  "create element",
  "create elements",
  "",
  "insert elements",
  "append elements",
  "add elements",
  "",
  "define elements",
  "render elements",
  "initialize elements",
  "generate elements",
  "set elements",
  "establish elements",
  "construct elements",
  "tag",
  "element",
  "tags",
  "elements", 
  ""
];

function generateTags(number, maxDepth = 5, currentDepth = 0) {
  // Base case: Stop recursion when max depth is reached
  if (currentDepth >= maxDepth) {
    return [];
  }

  // Generate the tags
  return Array.from({ length: number }, (_, index) => {
      const childQuantity = getRandomChildQuantity();

/*     const childs =
      childQuantity.childQuantity > 0
        ? {
            childTags: generateTags(
              childQuantity.childQuantity,
              2,
              currentDepth + 1
            ), // Increment the depth
            childQuantity,
            childPosition: getNthRandomChildQuantity(),
          }
        : null; */ 

    return {
      quantity: getRandomQuantity(),
      tag: getRandomHtmlTag(),
      childs: null,
      index: index + "" + currentDepth,
    };
  });
}

function prepareTagInput(tag) {
  const tagsWrappers = [
    "",
    `[${tag.tag.tag}]`,
    "",
    "",
    `(${tag.tag.tag})`,
    "",
    "",
    "",
    "",
  ];
  const tagWrapper = tagsWrappers[Math.floor(Math.random() * tagsWrappers.length)];

  const randomName = '';//getRandomName();
  const randomContent = '';//getRandomString(tag);
  const randomClassName = '';//getRandomClassName();
  const randomAttributes = [];//getRandomAttributes();

  // const quantityValue = wordToNumber(tag.quantity.quantityValue);

  return {
    tagValue: tag.tag.tagValue,
    tag: tag.tag.tag,
    quantity: tag.quantity.quantity || 1,
    quantityValue: tag.quantity.quantityValue,
    tagWrapper,
    randomName,
    randomContent,
    randomClassName,
    randomAttributes,
    childs: tag.childs,
    tagIndex: tag.index,
  };
}

function generateChilds(parentId, child) {
  const { childTags, childPosition, childQuantity } = child;

  const tags = childTags.map((tag) => {
    const preparedInput = prepareTagInput(tag);

    const childId = parentId + ":" + childPosition.childPosition;

    return { ...preparedInput, childId };
  });

  const childLabel =
    childLabels[Math.floor(Math.random() * childLabels.length)];

  const childPharase = ` ${
    childPhrases[Math.floor(Math.random() * childPhrases.length)]
  } ${childQuantity.childQuantityValue} ${childLabel} ${
    childPosition.childPositionValue
      ? ` ${childPosition.childPositionValue}`
      : ""
  }`;

  return { tags, childPharase };
}

function generateResults(processedTags) {
  const connecters = [", "];

  const formates = [
    () => {
      const inputParts = [];
      const outputParts = [];

      let connecter = connecters[Math.floor(Math.random() * connecters.length)];

      let q = [];
      let tag = [];
      let c = [];
      let n = [];
      let cont = [];
      let a = [];

      const tags = processedTags.reduce((prev, curr, index) => {
        let con = connecter;
        let sep = "|";

        if (
          index === processedTags.length - 1 &&
          processedTags.length > 1
        ) {
          con = " and ";
          sep = ''
        }

        if (prev) prev = prev + con;

        let tagWrapper = "";
        if (curr.tagWrapper) tagWrapper = " " + curr.tagWrapper;

        let quantityValue = "";
        if (curr.quantityValue) quantityValue = curr.quantityValue + " ";

        q.push(curr.quantity);
        tag.push(curr.tag);
        n.push("( "+curr.randomName+" )");
        c.push("( "+curr.randomClassName+")");
        cont.push("( "+curr.randomContent+" )");
        a.push("( "+curr.randomAttributes.join(" ")+" )");

        return prev + quantityValue + curr.tagValue + " " + tagWrapper + " ";
      }, "");


      /* outputParts.push(
        `quantity : ${q.join(" ")} | tag : ${tag.join(" ")} | name: ${n.join(" ")} | content: ${cont.join(" ")} | classes: ${c.join(" ")} | attributes: ${a.join(" ")}`
      ); */

      outputParts.push(
        `{ quantity : ${q.join(" ")} , tag : ${tag.join(" ")} }`
      );

      let randomVerb = getRandomFromArray(actionVerbs);

      if (randomVerb) randomVerb = randomVerb + " ";

      const namePhrase = getRandomFromArray(namePhrases);

      const contentPhrase = getRandomFromArray(contentPhrases);

      const classPhrase = getRandomFromArray(classPhrases);

      const attrPhrase = getRandomFromArray(attrPhrases);

      let randomNames = processedTags.filter((item, index) => {
        return item.randomName !== "";
      });

      let randomContents = processedTags.filter((item, index) => {
        return item.randomContent !== "";
      });

      let randomClasses = processedTags.filter((item, index) => {
        return item.randomClassName !== "";
      });

      let randomAttrs = processedTags.filter((item, index) => {
        return item.randomAttributes.length > 0;
      });

      let randomChilds = processedTags.filter((item, index) => {
        return item.childs !== null;
      });

      connecter = connecters[Math.floor(Math.random() * connecters.length)];
      const _randomNames = randomNames.map((item, index) => {
        let con = connecter;
        if (
          con === ", " &&
          index === randomNames.length - 2 &&
          randomNames.length > 1
        )
          con = " and ";

        //outputParts.push(`| named : ${item.randomName}`);

        return `${item.randomName}${
          index > 0 && index < randomNames.length - 1 ? con : ""
        }`;
      });

      connecter = connecters[Math.floor(Math.random() * connecters.length)];
      const _randomContents = randomContents.map((item, index) => {
        let con = connecter;

        if (
          con === ", " &&
          index === randomContents.length - 2 &&
          randomContents.length > 1
        )
          con = " and ";

        //outputParts.push(`| content : ${item.randomContent}`);

        return `${item.randomContent}${
          index > 0 && index < randomContents.length - 1 ? con : ""
        }`;
      });

      connecter = connecters[Math.floor(Math.random() * connecters.length)];
      const _randomClasses = randomClasses.map((item, index) => {
        let con = connecter;

        if (
          con === ", " &&
          index === randomClasses.length - 2 &&
          randomClasses.length > 1
        )
          con = " and ";

        //outputParts.push(`| classes : (${item.randomClassName})`);

        return `${item.randomClassName}${
          index > 0 && index < randomClasses.length - 1 ? con : ""
        }`;
      });

      connecter = connecters[Math.floor(Math.random() * connecters.length)];
      const _randomAttrs = randomAttrs.map((item, index) => {
        let con = connecter;

        if (
          con === ", " &&
          index === randomAttrs.length - 2 &&
          randomAttrs.length > 1
        )
          con = " and ";

        // outputParts.push(
        //   `| attributes : (${item.randomAttributes.join(" ")})`
        // );

        return `${item.randomAttributes.join("")}${
          index > 0 && index < randomAttrs.length - 1 ? con : ""
        }`;
      });

      const names =
        _randomNames.length > 0
          ? namePhrase + " " + _randomNames.join(" ")
          : "";
      const contents =
        _randomContents.length > 0
          ? contentPhrase + " " + _randomContents.join(" ")
          : "";

      const classes =
        _randomClasses.length > 0
          ? classPhrase + " " + _randomClasses.join(" ")
          : "";

      const attributes =
        _randomAttrs.length > 0
          ? attrPhrase + " " + _randomAttrs.join(" ")
          : "";

      inputParts.push(`${randomVerb}${tags}`);
      inputParts.push(names);
      inputParts.push(contents);
      inputParts.push(classes);
      inputParts.push(attributes);

      const childsInputs = [];

      for (const item of randomChilds) {
        const { tags: childtags, childPharase } = generateChilds(
          item.tag + item.tagIndex,
          item.childs
        );

        if (tags.length > 0) {
          const { inputParts: inputs, outputParts: outputs } =
            generateResults(childtags);

          childsInputs.push(childPharase + " " + inputs.join(" "));
          outputParts.push(...outputs);
        }
      }

      inputParts.push(childsInputs.join(" "));

      return { inputParts, outputParts };
    },
    /*   () => {
      const inputParts = [];
      const outputParts = [];

      let connecter = connecters[Math.floor(Math.random() * connecters.length)];

      let tags = processedTags.map((item, index) => {
        let randomVerb =
          actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

        let tagWrapper = "";
        if (item.tagWrapper) tagWrapper = " " + item.tagWrapper;

        let quantityValue = "";
        if (item.quantityValue) quantityValue = item.quantityValue + " ";

        if (randomVerb) randomVerb = randomVerb + " ";

        
      const namePhrase = getRandomFromArray(namePhrases);

      const contentPhrase = getRandomFromArray(contentPhrases);

      const classPhrase = getRandomFromArray(classPhrases);

      const attrPhrase = getRandomFromArray(attrPhrases);

        let name = item.randomName
          ? ` ${namePhrase} ${item.randomName || "Unknown"}`
          : "";

        let content = item.randomContent
          ? ` ${contentPhrase} ${item.randomContent || "add content here"}`
          : "";

        let className = item.randomClassName
          ? ` ${classPhrase} ${item.randomClassName}`
          : "";

          let attributes = item.randomAttributes.length > 0
          ? ` ${attrPhrase} ${item.randomAttributes.join("")}`
          : "";


          outputParts.push(
            `<<id : ${item.tagIndex}> <count : ${item.quantity}> <child : ${
              item.childId ? item.childId : "null"
            }> <tag : ${item.tag}>>`);

        if (item.randomName)
           outputParts.push(
          `named ${item.tagIndex} (${item.randomName})`
        );

        if (item.randomContent)
          outputParts.push(
            `content ${item.tagIndex} (${item.randomContent})`
          );

        if (item.randomClassName)
          outputParts.push(
          `classes ${item.tagIndex} (${item.randomClassName})`
        );

        if (item.randomAttributes.length > 0)
          outputParts.push(
          `attributes ${
            item.tagIndex
          } (${item.randomAttributes.join(" ")})`
        );

        const childsInputs = [];
        if (item.childs) {
          const { tags: childtags, childPharase } = generateChilds(
            item.tag + item.tagIndex,
            item.childs
          );
          if (childtags.length > 0) {
            const { inputParts: inputs, outputParts: outputs } =
              generateResults(childtags);

            childsInputs.push(childPharase + " " + inputs.join(" "));
            outputParts.push(...outputs);
          }
        }

        labels = shuffleArray([
          name,
          content,
          className,
          attributes,
          childsInputs.join(" "),
        ]);

        return (
          randomVerb +
          quantityValue +
          item.tagValue  + " " +
          tagWrapper + " " +
          labels[0] +
          labels[1] +
          labels[2] +
          labels[3] +
          labels[4]
        );
      });

      tags = shuffleArray(tags).reduce((prev, curr, index) => {
        let con = connecter;
        if (con === ", " && index === tags.length - 2 && tags.length > 1)
          con = " and ";

        if (prev) prev = prev + con;
        return prev + curr;
      }, "");

      inputParts.push(`${tags}`);
      return { inputParts, outputParts };
    },
    () => {
      const inputParts = [];
      const outputParts = [];

      const namePhrase = getRandomFromArray(namePhrases);

      const contentPhrase = getRandomFromArray(contentPhrases);

      const classPhrase = getRandomFromArray(classPhrases);

      const attrPhrase = getRandomFromArray(attrPhrases);

      let connecter = connecters[Math.floor(Math.random() * connecters.length)];

      let tags = processedTags.map((item, index) => {
        let randomVerb =
          actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

        let tagWrapper = "";
        if (item.tagWrapper) tagWrapper = " " + item.tagWrapper;

        let quantityValue = "";
        if (item.quantityValue) quantityValue = item.quantityValue + " ";

        if (randomVerb) randomVerb = randomVerb + " ";

        outputParts.push(
          `<<id : ${item.tagIndex}> <count : ${item.quantity}> <child : ${
            item.childId ? item.childId : "null"
          }> <tag : ${item.tag}>>`);

        let name = item.randomName
          ? ` ${namePhrase} ${item.randomName || "Unknown"}`
          : "";

        let content = item.randomContent
          ? ` ${contentPhrase} ${item.randomContent || "add content here"}`
          : "";

        let className = item.randomClassName
          ? ` ${classPhrase} ${item.randomClassName}`
          : "";

          let attributes = item.randomAttributes.length > 0
          ? ` ${attrPhrase} ${item.randomAttributes.join("")}`
          : "";

        if (item.randomName)
           outputParts.push(
          `named ${item.tagIndex} (${item.randomName})`
        );

        if (item.randomContent)
          outputParts.push(
            `content ${item.tagIndex} (${item.randomContent})`
          );

        if (item.randomClassName)
          outputParts.push(
          `classes ${item.tagIndex} (${item.randomClassName})`
        );

          if (item.randomAttributes.length > 0)
            outputParts.push(
              `attributes ${
                item.tagIndex
              } (${item.randomAttributes.join(" ")})`
            );
  

        const childsInputs = [];
        if (item.childs) {
          const { tags: childtags, childPharase } = generateChilds(
            item.tag + item.tagIndex,
            item.childs
          );
          if (childtags.length > 0) {
            const { inputParts: inputs, outputParts: outputs } =
              generateResults(childtags);

            childsInputs.push(childPharase + " " + inputs.join(" "));
            outputParts.push(...outputs);
          }
        }

        labels = shuffleArray([
          name,
          content,
          className,
          attributes,
          childsInputs.join(" "),
        ]);

        return (
          randomVerb +
          quantityValue +
          item.tagValue  + " " +
          tagWrapper + " " +
          labels[0] +
          labels[1] +
          labels[2] +
          labels[3] +
          labels[4]
        );
      });

      tags = shuffleArray(tags).reduce((prev, curr, index) => {
        let con = connecter;
        if (con === ", " && index === tags.length - 2 && tags.length > 1)
          con = " and ";

        if (prev) prev = prev + con;
        return prev + curr;
      }, "");

      inputParts.push(`${tags}`);
      return { inputParts, outputParts };
    },
    () => {
      const inputParts = [];
      const outputParts = [];

      let randomVerb =
        actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

      if (randomVerb) randomVerb = randomVerb + " ";

      let connecter = connecters[Math.floor(Math.random() * connecters.length)];

      let tags = processedTags.map((item, index) => {
        let tagWrapper = "";
        if (item.tagWrapper) tagWrapper = " " + item.tagWrapper;

        let quantityValue = "";
        if (item.quantityValue) quantityValue = item.quantityValue + " ";

        outputParts.push(
          `<<id : ${item.tagIndex}> <count : ${item.quantity}> <child : ${
            item.childId ? item.childId : "null"
          }> <tag : ${item.tag}>>`);

        const namePhrase = getRandomFromArray(namePhrases);

      const contentPhrase = getRandomFromArray(contentPhrases);

      const classPhrase = getRandomFromArray(classPhrases);

      const attrPhrase = getRandomFromArray(attrPhrases);

        let name = item.randomName
          ? ` ${namePhrase} ${item.randomName || "Unknown"}`
          : "";

        let content = item.randomContent
          ? ` ${contentPhrase} ${item.randomContent || "add content here"}`
          : "";

        let className = item.randomClassName
          ? ` ${classPhrase} ${item.randomClassName}`
          : "";

          let attributes = item.randomAttributes.length > 0
          ? ` ${attrPhrase} ${item.randomAttributes.join("")}`
          : "";

        if (item.randomName)
           outputParts.push(
          `named ${item.tagIndex} (${item.randomName})`
        );

        if (item.randomContent)
          outputParts.push(
            `content ${item.tagIndex} (${item.randomContent})`
          );

        if (item.randomClassName)
          outputParts.push(
          `classes ${item.tagIndex} (${item.randomClassName})`
        );

          if (item.randomAttributes.length > 0)
            outputParts.push(
              `attributes ${
                item.tagIndex
              } (${item.randomAttributes.join(" ")})`
            );
  

        const childsInputs = [];
        if (item.childs) {
          const { tags: childtags, childPharase } = generateChilds(
            item.tag + item.tagIndex,
            item.childs
          );
          if (childtags.length > 0) {
            const { inputParts: inputs, outputParts: outputs } =
              generateResults(childtags);

            childsInputs.push(childPharase + " " + inputs.join(" "));
            outputParts.push(...outputs);
          }
        }

        labels = shuffleArray([
          name,
          content,
          className,
          attributes,
          childsInputs.join(" "),
        ]);

        return (
          randomVerb +
          quantityValue +
          item.tagValue  + " " +
          tagWrapper + " " +
          labels[0] +
          labels[1] +
          labels[2] +
          labels[3] +
          labels[4]
        );
      });

      tags = shuffleArray(tags).reduce((prev, curr, index) => {
        let con = connecter;
        if (con === ", " && index === tags.length - 2 && tags.length > 1)
          con = " and ";

        if (prev) prev = prev + con;
        return prev + curr;
      }, "");

      inputParts.push(`${tags}`);
      return { inputParts, outputParts };
    },
    () => {
      const inputParts = [];
      const outputParts = [];

      let randomVerb =
        actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

      if (randomVerb) randomVerb = randomVerb + " ";

      let connecter = connecters[Math.floor(Math.random() * connecters.length)];

      const namePhrase = getRandomFromArray(namePhrases);

      const contentPhrase = getRandomFromArray(contentPhrases);

      const classPhrase = getRandomFromArray(classPhrases);

      const attrPhrase = getRandomFromArray(attrPhrases);

      let tags = processedTags.map((item, index) => {
        let tagWrapper = "";
        if (item.tagWrapper) tagWrapper = " " + item.tagWrapper;

        let quantityValue = "";
        if (item.quantityValue) quantityValue = item.quantityValue + " ";

        outputParts.push(
          `<<id : ${item.tagIndex}> <count : ${item.quantity}> <child : ${
            item.childId ? item.childId : "null"
          }> <tag : ${item.tag}>>`);

        let name = item.randomName
          ? ` ${namePhrase} ${item.randomName || "Unknown"}`
          : "";

        let content = item.randomContent
          ? ` ${contentPhrase} ${item.randomContent || "add content here"}`
          : "";

        let className = item.randomClassName
          ? ` ${classPhrase} ${item.randomClassName}`
          : "";

          let attributes = item.randomAttributes.length > 0
          ? ` ${attrPhrase} ${item.randomAttributes.join("")}`
          : "";

        if (item.randomName)
           outputParts.push(
          `named ${item.tagIndex} (${item.randomName})`
        );

        if (item.randomContent)
          outputParts.push(
            `content ${item.tagIndex} (${item.randomContent})`
          );

        if (item.randomClassName)
          outputParts.push(
          `classes ${item.tagIndex} (${item.randomClassName})`
        );

          if (item.randomAttributes.length > 0)
            outputParts.push(
              `attributes ${
                item.tagIndex
              } (${item.randomAttributes.join(" ")})`
            );
  

        const childsInputs = [];
        if (item.childs) {
          const { tags: childtags, childPharase } = generateChilds(
            item.tag + item.tagIndex,
            item.childs
          );
          if (childtags.length > 0) {
            const { inputParts: inputs, outputParts: outputs } =
              generateResults(childtags);

            childsInputs.push(childPharase + " " + inputs.join(" "));
            outputParts.push(...outputs);
          }
        }

        labels = shuffleArray([
          name,
          content,
          className,
          attributes,
          childsInputs.join(" "),
        ]);

        return (
          randomVerb +
          quantityValue +
          item.tagValue + " " +
          tagWrapper + " " +
          labels[0] +
          labels[1] +
          labels[2] +
          labels[3] +
          labels[4]
        );
      });

      tags = shuffleArray(tags).reduce((prev, curr, index) => {
        let con = connecter;
        if (con === ", " && index === tags.length - 2 && tags.length > 1)
          con = " and ";

        if (prev) prev = prev + con;

        return prev + curr;
      }, "");

      inputParts.push(`${tags}`);
      return { inputParts, outputParts };
    }, */
  ];

  return formates[Math.floor(Math.random() * formates.length)]();
}

// Function to generate random input and output strings with shuffled elements
function generateInputOutput(number, numberOfDepth) {
  
  let tags = generateTags(number, numberOfDepth);
  tags = tags.map((tag) => {
    return prepareTagInput(tag);
  });

  let { inputParts, outputParts } = generateResults(tags); // Input text

  inputParts = shuffleArray(inputParts);
  const input = inputParts
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/ ,/g, ",")
    .trim(); // Final input text
  const output = outputParts.join(" ").replace(/\s+/g, " ").trim(); // Final structured output

  return { input, output };
}

function generateBalancedDataset(numberOfData, numberOfTags, applyRandomRange, numberOfDepth, callback) {

  const data = [];

  for (let i = 0; i < numberOfData; i++) {
    const numberOfBlocks = applyRandomRange ? Math.floor(Math.random() * numberOfTags) + 1 : numberOfTags; // 1 to 3 blocks randomly
    const { input, output } = generateInputOutput(numberOfBlocks, numberOfDepth);
    data.push({ input, output });
  }

  // Save the generated dataset to a JSON file
  fs.writeFile(
    "api-helper/ai/training_data/data.json",
    JSON.stringify(data, null, 2),
    (err) => {
      if (err) {
        callback("Error writing file: " + err);
      } else {
        callback("Balanced dataset successfully generated!");
      }
    }
  );
}

/* const combinedArray = [
  ...attrPhrases,
  ...names,
  ...shortStrings,
  ...longStrings,
  ...classNames,
  ...namePhrases,
  ...contentPhrases,
  ...classPhrases,
  ...childPhrases,
  ...childLabels,
  ...actionVerbs,
  ...possibleAttributes,
  ...htmlTags.flatMap(tagObj => tagObj.names) // Extract names from htmlTags array
];

// Split any phrases with spaces into individual words
const splitWords = combinedArray.flatMap(phrase => phrase.split(" "));

// Create a unique array by using a Set
const uniqueArray = [...new Set(splitWords)]; */



module.exports = {
  generateBalancedDataset
}