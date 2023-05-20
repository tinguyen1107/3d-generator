import React from 'react';
import classes from './editor.module.css';
import { useQuillEditor } from './useQuillEditor';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export type QuillEditorPropsType = {
  id?: string;
  placeholder?: string;
  onChange?: (value: string) => any;
  customRef?: any;
  refQuill?: any;
  mode?: 'create_post' | 'comment';
  headElement?: React.ReactElement;
  isMiniMode?: boolean;
  refInsertImage?: any;
  refInsertVideo?: any;
  refInsertNFT?: any;
  style?: any;
  defaultValue?: string;
};

export const QuillEditor = (props: QuillEditorPropsType) => {
  const { id, isMiniMode, refInsertImage, refInsertVideo, refInsertNFT, defaultValue } = props;
  const {
    props: { quill, quillRef },
    methods: {},
  } = useQuillEditor(props);

  const rootClassName =
    props.mode === 'create_post' ? [classes['root'], classes['create-post']].join(' ') : classes['root'];

  return (
    <div className={rootClassName} style={{ ...props.style }}>
      <div id={id}>
        {!isMiniMode && (
          <>
            <button className="ql-header" value="1" />
            <button className="ql-header" value="2" />
            <select className="ql-size">
              <option value="small" />
              <option selected />
              <option value="large" />
              <option value="huge" />
            </select>
            {/* <select className="ql-font">
                            <option value="sans-serif" selected>
                                Sans Serif
                            </option>
                            <option value="monospace">Monospace</option>
                        </select> */}
          </>
        )}
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <select className="ql-align">
          <option label="left" selected />
          <option label="center" value="center" />
          <option label="right" value="right" />
          <option label="justify" value="justify" />
        </select>
        <button className="ql-code-block" />
        <button className="ql-link" />
        <button className="ql-image" ref={refInsertImage} />
        <button className="ql-video" ref={refInsertVideo} />
      </div>
      {props.headElement}
      <div ref={quillRef} />
    </div>
  );
};

export default QuillEditor;
