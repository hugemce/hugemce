import Editor from 'hugerte/core/api/Editor';

const makeTooltipText = (editor: Editor, labelWithPlaceholder: string, value: string): string =>
  editor.translate([ labelWithPlaceholder, editor.translate(value) ]);

export {
  makeTooltipText
};
