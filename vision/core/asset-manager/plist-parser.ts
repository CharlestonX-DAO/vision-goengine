
import { EDITOR } from 'internal:constants';
import { warnID } from '../platform/debug';

/**
 * A SAX Parser
 * @class saxParser
 */
export class SAXParser {
    private _parser: DOMParser | null = null;
    constructor () {
        if (window.DOMParser) {
            this._parser = new DOMParser();
        }
    }

    /**
     * @method parse
     * @param {String} xmlTxt
     * @return {Document}
     */
    public parse (xmlTxt: string): Document {
        return this._parseXML(xmlTxt);
    }

    protected _parseXML (textxml: string): Document {
        // get a reference to the requested corresponding xml file
        if (this._parser) {
            return this._parser.parseFromString(textxml, 'text/xml');
        }
        throw new Error('Dom parser is not supported in this platform!');
    }
}

/**
 *
 * plistParser is a singleton object for parsing plist files
 * @class plistParser
 * @extends SAXParser
 */
class PlistParser extends SAXParser {
    /**
     * @en parse a xml string as plist object.
     * @zh 将xml字符串解析为plist对象。
     * @param {String} xmlTxt - plist xml contents
     * @return {*} plist object
     */
    public parse (xmlTxt): any {
        const xmlDoc = this._parseXML(xmlTxt);
        const plist = xmlDoc.documentElement;
        if (plist.tagName !== 'plist') {
            warnID(5100);
            return {};
        }

        // Get first real node
        let node: HTMLElement | null = null;
        for (let i = 0, len = plist.childNodes.length; i < len; i++) {
            node = plist.childNodes[i] as HTMLElement;
            if (node.nodeType === 1) {
                break;
            }
        }
        return this._parseNode(node!);
    }

    private _parseNode (node: HTMLElement): unknown {
        let data: any = null;
        const tagName = node.tagName;
        if (tagName === 'dict') {
            data = this._parseDict(node);
        } else if (tagName === 'array') {
            data = this._parseArray(node);
        } else if (tagName === 'string') {
            if (node.childNodes.length === 1) {
                data = node.firstChild!.nodeValue;
            } else {
                // handle Firefox's 4KB nodeValue limit
                data = '';
                for (let i = 0; i < node.childNodes.length; i++) {
                    data += node.childNodes[i].nodeValue;
                }
            }
        } else if (tagName === 'false') {
            data = false;
        } else if (tagName === 'true') {
            data = true;
        } else if (tagName === 'real') {
            data = parseFloat(node.firstChild!.nodeValue!);
        } else if (tagName === 'integer') {
            data = parseInt(node.firstChild!.nodeValue!, 10);
        }
        return data;
    }

    private _parseArray (node: HTMLElement): unknown[] {
        const data: any[] = [];
        for (let i = 0, len = node.childNodes.length; i < len; i++) {
            const child = node.childNodes[i];
            if (child.nodeType !== 1) {
                continue;
            }
            data.push(this._parseNode(child as HTMLElement));
        }
        return data;
    }

    private _parseDict (node: HTMLElement): Record<string, any> {
        const data = {};
        let key = '';
        for (let i = 0, len = node.childNodes.length; i < len; i++) {
            const child = node.childNodes[i] as HTMLElement;
            if (child.nodeType !== 1) {
                continue;
            }

            // Grab the key, next noe should be the value
            if (child.tagName === 'key') {
                key = child.firstChild!.nodeValue!;
            } else {
                data[key] = this._parseNode(child);
            }                 // Parse the value node
        }
        return data;
    }
}

/**
 * @type {PlistParser}
 * @name plistParser
 * A Plist Parser
 */
const plistParser = new PlistParser();

export default plistParser;
