import Editor from 'hugerte/core/api/Editor';

import * as Actions from '../core/Actions';
import * as Options from './Options';

const register = (editor: Editor): void => {
  editor.addCommand('mceInsertDate', (_ui, value) => {
    Actions.insertDateTime(editor, value ?? Options.getDateFormat(editor));
  });

  editor.addCommand('mceInsertTime', (_ui, value) => {
    Actions.insertDateTime(editor, value ?? Options.getTimeFormat(editor));
  });
};

export {
  register
};
