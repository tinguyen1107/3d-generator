import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import ImageUploader from '../../utils/quill/quill.imageUploader';
import { QuillEditorPropsType } from './quillEditor';
// @ts-ignore
import MagicUrl from 'quill-magic-url';

export const useQuillEditor = (props: QuillEditorPropsType) => {
  const { id, placeholder, onChange, customRef, refQuill, defaultValue } = props;

  const modules: any = {
    toolbar: `#${id}`,
    clipboard: {
      matchVisual: false,
    },
    magicUrl: true,
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];
  useEffect(() => {
    const Quill = require('quill');

    Quill.register('modules/imageUploader', ImageUploader);
    Quill.register('modules/magicUrl', MagicUrl);
  }, []);

  const { quill, quillRef } = useQuill({
    theme: 'bubble',
    modules,
    formats,
    placeholder,
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta: any, oldDelta: any, source: any) => {
        onChange!(quill.root.innerHTML);
      });

      if (customRef) {
        customRef.current.clearContent = () => {
          quill.root.innerHTML = '';
        };
      }

      if (refQuill) refQuill.current = quill;

      if (defaultValue) quill.root.innerHTML = defaultValue;
    }
  }, [quill]);

  return {
    props: {
      quill,
      quillRef,
    },
    methods: {},
  };
};
