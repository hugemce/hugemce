import Editor from 'hugerte/core/api/Editor';
import { Toolbar } from 'hugerte/core/api/ui/Ui';

import * as Options from '../api/Options';

const stateToggle = (editor: Editor) => (api: Toolbar.ToolbarButtonInstanceApi) => {
  const handler = () => {
    api.setEnabled(!Options.enableWhenDirty(editor) || editor.isDirty());
  };

  handler();
  editor.on('NodeChange dirty', handler);
  return () => editor.off('NodeChange dirty', handler);
};

const register = (editor: Editor): void => {
  editor.ui.registry.addButton('save', {
    icon: 'save',
    tooltip: 'Save',
    enabled: false,
    onAction: () => editor.execCommand('mceSave'),
    onSetup: stateToggle(editor),
    shortcut: 'Meta+S'
  });

  editor.ui.registry.addButton('cancel', {
    icon: 'cancel',
    tooltip: 'Cancel',
    enabled: false,
    onAction: () => editor.execCommand('mceCancel'),
    onSetup: stateToggle(editor)
  });

  editor.addShortcut('Meta+S', '', 'mceSave');
};

export {
  register
};
