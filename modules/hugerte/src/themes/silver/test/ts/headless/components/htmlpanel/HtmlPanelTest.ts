import { ApproxStructure, Assertions } from '@ephox/agar';
import { GuiFactory, TestHelpers } from '@ephox/alloy';
import { context, describe, it } from '@ephox/bedrock-client';

import { renderHtmlPanel } from 'hugerte/themes/silver/ui/general/HtmlPanel';

import TestBackstage from '../../../module/TestBackstage';

describe('headless.hugerte.themes.silver.components.htmlpanel.HtmlPanelTest', () => {
  context('Presentation', () => {
    const backstage = TestBackstage();
    const hook = TestHelpers.GuiSetup.bddSetup((_store, _doc, _body) => GuiFactory.build(
      renderHtmlPanel({
        html: '<br /><br /><hr />',
        presets: 'presentation'
      }, backstage.shared.providers)
    ));

    it('Check basic structure', () => {
      Assertions.assertStructure(
        'Checking initial structure',
        ApproxStructure.build((s, str, _arr) => s.element('div', {
          attrs: {
            role: str.is('presentation')
          },
          children: [
            s.element('br', {}),
            s.element('br', {}),
            s.element('hr', {})
          ]
        })),
        hook.component().element
      );
    });
  });

  context('Document', () => {
    const backstage = TestBackstage();
    const hook = TestHelpers.GuiSetup.bddSetup((_store, _doc, _body) => GuiFactory.build(
      renderHtmlPanel({
        html: '<br /><hr />',
        presets: 'document'
      }, backstage.shared.providers)
    ));

    it('Check basic structure', () => {
      Assertions.assertStructure(
        'Checking initial structure',
        ApproxStructure.build((s, str, _arr) => s.element('div', {
          attrs: {
            role: str.is('document')
          },
          children: [
            s.element('br', {}),
            s.element('hr', {})
          ]
        })),
        hook.component().element
      );
    });
  });
});
