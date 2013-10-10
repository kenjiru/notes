var NoteSerializer = {
    _nodeMap : {
        bold : 'b',
        italic : 'i',
        strikethrough : 'strike',
        highlight : {
            'element' : 'span',
            'background' : 'yellow'
        },
        small : {
            'element' : 'span',
            'font-size' : 'small'
        },
        large : {
            'element' : 'span',
            'font-size' : 'large'
        },
        huge : {
            'element' : 'span',
            'font-size' : 'xx-large'
        }
    },

    getHtml : function(noteText) {
        var xmlDoc = new DOMParser().parseFromString(noteText, "text/xml"),
            rootNode = xmlDoc.childNodes[0],
            fragment = document.createDocumentFragment(),
            paragraph = document.createElement('p'),
            node,
            nodeValue,
            textNode,
            newLinePos;

        for (var i=1; i<rootNode.childNodes.length; i++) {
            node = rootNode.childNodes[i];

            if (node.nodeType == 3) {
                nodeValue = node.nodeValue;
                newLinePos = nodeValue.indexOf('\n');

                if (newLinePos > -1) {
                    this._appendTextNode(paragraph, nodeValue.substring(0, newLinePos));

                    fragment.appendChild(paragraph);

                    paragraph = this._newParagraph();
                    this._appendTextNode(paragraph, nodeValue.substring(newLinePos));
                } else {
                    this._appendTextNode(paragraph, nodeValue);
                }
            } else {
                if (node.nodeName === 'list') {
                    if (paragraph.childNodes.length > 0) {
                        fragment.appendChild(paragraph);

                        paragraph = document.createElement('p');
                    }

                    fragment.appendChild(node);
                } else {
                    paragraph.appendChild(node);
                }
            }
        }
    },

    _appendTextNode : function(node, text) {
        var textNode = document.createTextNode(text);

        node.appendChild(textNode);
    },

    _newParagraph : function() {
        return document.createElement('p');
    }
};