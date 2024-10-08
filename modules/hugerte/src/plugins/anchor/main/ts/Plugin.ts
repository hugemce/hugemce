import PluginManager from 'hugerte/core/api/PluginManager';

import * as Commands from './api/Commands';
import * as Options from './api/Options';
import * as FilterContent from './core/FilterContent';
import * as Formats from './core/Formats';
import * as Buttons from './ui/Buttons';

export default (): void => {
  PluginManager.add('anchor', (editor) => {
    Options.register(editor);
    FilterContent.setup(editor);
    Commands.register(editor);
    Buttons.register(editor);

    editor.on('PreInit', () => {
      Formats.registerFormats(editor);
    });
  });
};
