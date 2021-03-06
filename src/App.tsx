import React, { useEffect, useState } from 'react';
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
  const [paragraph, setParagrah] = useState('Hello world <span id="replace" class="bg-purple-500 text-white cursor-pointer" data-uuid="abcded" any="test">Here should be sth</span>');

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

        return <span id="replace" className="bg-purple-500 text-white cursor-pointer" data-uuid={attribs['data-uuid']} onClick={() => onClick(attribs['data-uuid'])}>{domToReact(children, options)}</span>
      }
    }
  }

  useEffect(() => {
    console.log('State: ', paragraph);
  }, [paragraph])

  const handleEditorChange = (content: string, editor: any) => {
    console.log('Content was updated:', content);
    setParagrah(content);
  }

  const onSelectText = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    console.log(e);

    const selection = window.getSelection();
    const selectedText = selection?.toString();
    if (selectedText) {
      setSelectedText(selectedText);
      const range = selection?.getRangeAt(0);

      if (!range) {
        return;
      }

      const surroundingElement = document.createElement('span');
      surroundingElement.id = 'replace';
      surroundingElement.className = "bg-purple-500 text-white cursor-pointer";
      surroundingElement.setAttribute('data-uuid', 'new_uuid');
      surroundingElement.onclick = () => onClick('new_uuid');
      range?.surroundContents(surroundingElement);
      const html = e.currentTarget.innerHTML;
      setTimeout(() => {
        setParagrah(html);
      }, 1000);
    } else {
      setSelectedText('');
    }
  }

  return (
    <div className="App">
     <div>
       <h3 className="font-bold">For display</h3>
        <p onMouseUp={e => onSelectText(e)}>{parse(paragraph, options)}</p>
        <br />

        <h3 className="font-bold">For editing</h3>
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
    </div>
  );
}

export default App;
