import Editor from 'hugerte/core/api/Editor';

const fireFullscreenStateChanged = (editor: Editor, state: boolean): void => {
  editor.dispatch('FullscreenStateChanged', { state });
  editor.dispatch('ResizeEditor');
};

export {
  fireFullscreenStateChanged
};
