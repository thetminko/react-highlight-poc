import React, { useState } from 'react';
import parse, { DomElement, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';
import { Editor } from '@tinymce/tinymce-react';

function App() {
  const [paragraph, setParagrah] = useState('<p id="highlight-main">Hello world <span id="replace" class="bg-purple-500 text-white cursor-pointer" uuid="abcded" any="test">Here should be sth</span></p>');

  const [selectedText, setSelectedText] = useState('');

  const onClick = (uuid: string) => {
    alert('You clicked a commented text ' + uuid);
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode:  DomElement) => {
      const  { name, attribs, children } = domNode;
      if (!attribs) {
        return;
      }

      if (name === 'span' && attribs.id === 'replace') {
        if (!children) {
          return <span></span>;
        }

        return <span className="bg-purple-500 text-white cursor-pointer" onClick={() => onClick(attribs.uuid)}>{domToReact(children, options)}</span>
      }

      if (name === 'p' && attribs.id === "highlight-main") {
        if (children) {
          return <p id="highlight-main" onMouseUp={onSelectText}>{domToReact(children, options)}</p>
        }

        return <p></p>
      }
    }
  }

  const handleEditorChange = (content: string, editor: any) => {
    console.log('Content was updated:', content);
    setParagrah(content);
  }

  const onSelectText = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    if (selectedText) {
      setSelectedText(selectedText);
      const range = selection?.getRangeAt(0);
      const surroundingElement = document.createElement('span');
      surroundingElement.id= "replace";
      surroundingElement.className = "bg-purple-500 text-white cursor-pointer";
      surroundingElement.setAttribute('uuid', "abcded");
      range?.surroundContents(surroundingElement);
    } else {
      setSelectedText('');
    }
  }

  const markAsComment = () => {

  }

  return (
    <div className="App">
     <div>
       {parse(paragraph, options)}
        <br />
        <Editor initialValue={paragraph}
        init={{
          extended_valid_elements: "span[id|uuid|class|className|any]", 
          menubar: false,
          toolbar: '',
          content_css: '/App.css'
        }}
        onEditorChange={handleEditorChange} />
     </div>
     <p className="mt-4">You selected: {selectedText}</p>
     <button className="mt-4 bg-blue-500 p-4" onClick={markAsComment}>
       Mark as comment
     </button>
    </div>
  );
}

export default App;
