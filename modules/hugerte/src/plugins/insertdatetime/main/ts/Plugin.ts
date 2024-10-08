import PluginManager from 'hugerte/core/api/PluginManager';

import * as Commands from './api/Commands';
import * as Options from './api/Options';
import * as Buttons from './ui/Buttons';

export default (): void => {
  PluginManager.add('insertdatetime', (editor) => {
    Options.register(editor);
    Commands.register(editor);
    Buttons.register(editor);
  });
};
