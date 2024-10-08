import Editor from 'hugerte/core/api/Editor';

const fireVisualBlocks = (editor: Editor, state: boolean): void => {
  editor.dispatch('VisualBlocks', { state });
};

export {
  fireVisualBlocks
};
