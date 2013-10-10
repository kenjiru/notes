var NoteSerializer = Y.Base.create('noteSerializer', Y.Base, [], {
    _nodeMap : {
        'note-content' : '',
        bold : 'b',
        italic : 'i',
        strikethrough : 'strike',
        highlight : {
            'element' : 'span',
            'style' : 'background: yellow'
        },
        'size:small' : {
            'element' : 'span',
            'style' : 'font-size: small'
        },
        'size:large' : {
            'element' : 'span',
            'style' : 'font-size: large'
        },
        'size:huge' : {
            'element' : 'span',
            'style' : 'font-size: xx-large'
        },
        'list' : 'ul',
        'list-item' : 'li'
    },

    convertToHtml : function(text) {
        text = this._replaceTitle(text);
        text = this._replaceNewLines(text);
        text = this._replaceAllTags(text);

        return text;
    },

    _replaceTitle : function(text) {
        text = text.replace(/<(\/)?note-content[^>]*>/g,'');
        return text.replace(/^(.*)[\r\n]+(.*)/, "<h1>$1</h1>$2");
    },

    _replaceNewLines : function(text) {
        return text.replace(/[\r\n]+/g, '<br/>');
    },

    _replaceAllTags : function(text) {
        for(var key in this._nodeMap) {
            text = this._replaceTag(text, key, this._nodeMap[key]);
        }

        return text;
    },

    _replaceTag : function(text, initialTag, finalTag) {
        var bothTags = "<(\/)?" + initialTag + "( [^>]*)*>",
            startTag = "<" + initialTag + "( [^>]*)*>",
            endTag = "</" + initialTag + ">",
            regExp;

        if (typeof finalTag == 'string') {
            regExp = new RegExp(bothTags, 'g');
            text = text.replace(regExp, "<$1" + finalTag + ">");
        } else {
            regExp = new RegExp(startTag, 'g');
            text = text.replace(regExp, "<" + finalTag.element + " style='" + finalTag.style + "'>");

            regExp = new RegExp(endTag, 'g');
            text = text.replace(regExp, "</" + finalTag.element + ">");
        }

        return text;
    }
});

Y.namespace('notes').NoteSerializer = NoteSerializer;