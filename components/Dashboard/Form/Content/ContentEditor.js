'use client'

import React, { useEffect, useRef, useState, useCallback } from "react";

import { message } from "antd";
import MediaServices from "@/lib/services/media";

class ButtonImage extends React.Component {


  static key = 'imageFromFile';

  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.progress = -1;
  }

  onProgress = ({ progress }) => {

    this.progress = progress;
  };

  onResetProgress = () => {
    this.progress = -1;
  };


  render() {
    const inputSyle = { display: 'none' };

    return (
      <div>
        <button
          aria-label={AlloyEditor.Strings.image}
          className="ae-button"
          data-type="button-image"
          onClick={this.handleClick}
          tabIndex={this.props.tabIndex}
          title={AlloyEditor.Strings.image}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M14 9l-2.519 4-2.481-1.96-5 6.96h16l-6-9zm8-5v16h-20v-16h20zm2-2h-24v20h24v-20zm-20 6c0-1.104.896-2 2-2s2 .896 2 2c0 1.105-.896 2-2 2s-2-.895-2-2z" /></svg>

        </button>

        <input
          accept="image/*"
          onChange={this._onInputChange}
          ref={this.fileInput}
          style={inputSyle}
          type="file"
        />

        {this.progress >= 0 && (
          <div>
            <progress value={this.progress} max="100" />
          </div>
        )}
      </div>
    );
  }


  handleClick = () => {
    this.fileInput.current.click();
  };


  _onInputChange = async () => {
    const inputEl = this.fileInput.current;



    try {

      if (!inputEl.files.length)
        throw "Please Select File";



      const formData = new FormData();

      formData.append('file', inputEl.files[0]);


      const res = await MediaServices.upload('images', formData, this.onProgress)

      message.success('upload successfully.');


      if (res.media) {
        const editor = this.props.editor.get('nativeEditor');

        const el = window.CKEDITOR.dom.element.createFromHtml(
          `<img src="${res.media.src}" alt="${res.media.alt}" width="400" crossOrigin ="anonymous" >`
        );


        editor.insertElement(el);

        editor.fire('actionPerformed', this);

      }



    } catch (e) {
      message.error(e?.message || 'upload failed.');
    }
    finally {
      this.onResetProgress();
    }


    inputEl.value = '';
  };
}




function Selections(AlloyEditor) {

  if (!AlloyEditor)
    return [];

  return [{
    name: 'link',
    buttons: ['linkEdit'],
    test: AlloyEditor.SelectionTest.link
  }, {
    name: 'image',
    buttons: ['imageLeft', 'imageCenter', 'imageRight', 'removeImage'],
    test: AlloyEditor.SelectionTest.image
  }, {
    name: 'text',
    buttons: ['styles', , 'paragraphLeft', 'paragraphCenter', 'paragraphRight', 'paragraphJustify',
      'indentBlock', 'outdentBlock', 'bold', 'italic', 'underline', 'link', 'quote', 'strike', 'removeFormat'],
    test: AlloyEditor.SelectionTest.text
  }, {
    name: 'table',
    buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
    getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
    setPosition: AlloyEditor.SelectionSetPosition.table,
    test: AlloyEditor.SelectionTest.table
  }]
}




function createContentEditor() {


  const ContentEditor = {
    editor: null,
    domElement: null,
    AlloyEditor: {},
    init: function (body) {
      return new Promise(resolve => {
        import('alloyeditor').then(({ AlloyEditor }) => {
          this.AlloyEditor = AlloyEditor;
          this.AlloyEditor.Buttons['acimage'] = this.AlloyEditor.ButtonImage = ButtonImage;
          const selections = Selections(this.AlloyEditor);
          this.toolbars.styles.selections = selections;
          this.toolbars.styles.parent = body

          resolve();
        });
      });
    },

    toolbars: {
      add: {
        buttons: ['acimage', 'camera', 'hline', 'table', 'ul', 'ol'],
        tabIndex: 2
      },
      styles: {
        selections: [],
        tabIndex: 1
      },
    },
    start: function (domElement, body) {
      if (this.AlloyEditor) {
        const toolbars = this.toolbars;
        const enterMode = window.CKEDITOR.ENTER_BR;
        const shiftEnterMode = window.CKEDITOR.ENTER_BR;
        this.domElement = domElement;
        this.domElement.style.pointerEvents = null;

        this.editor = this.AlloyEditor.editable(this.domElement, {
          toolbars,
          enterMode,
          shiftEnterMode,
          uiNode: body,
        });
      }
    },
    destroy: function () {
      try {
        if (this.domElement)
          this.domElement.style.pointerEvents = 'none';
          
        if (this.editor) {

          if(!this.editor._destroyed)
          this.editor.destroy();
        

        }
      } catch (e) {
        console.log(e?.message)
      }
    },

    getCurrent: function () {
      return this.domElement;
    }
  };

  return ContentEditor;
}

const ContentEditor = createContentEditor();

export default ContentEditor;
