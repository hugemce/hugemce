import { after, before, describe, it } from '@ephox/bedrock-client';
import { Arr, Fun } from '@ephox/katamari';
import { Attribute, ContentEditable, Css, Html, Insert, SelectorFilter, SelectorFind, SugarElement, SugarNode, Traverse } from '@ephox/sugar';
import { assert } from 'chai';

import DOMUtils from 'hugerte/core/api/dom/DOMUtils';
import { FakeCaret, isFakeCaretTarget } from 'hugerte/core/caret/FakeCaret';
import { isFakeCaretTableBrowser } from 'hugerte/core/keyboard/TableNavigation';
import * as Zwsp from 'hugerte/core/text/Zwsp';

import * as CaretAsserts from '../../module/test/CaretAsserts';
import * as ViewBlock from '../../module/test/ViewBlock';

describe('browser.hugerte.core.caret.FakeCaretTest', () => {
  const viewBlock = ViewBlock.bddSetup();
  let fakeCaret: FakeCaret;

  const getRoot = () => SugarElement.fromDom(viewBlock.get());

  before(() => {
    const mockEditor: any = {
      options: {
        get: Fun.constant('p')
      },
      dom: DOMUtils(document)
    };
    fakeCaret = FakeCaret(mockEditor, getRoot().dom, isBlock, Fun.always);
    viewBlock.get().contentEditable = 'true';
  });

  after(() => {
    fakeCaret.destroy();
  });

  const isBlock = (node: Node): node is HTMLDivElement => {
    return node.nodeName === 'DIV';
  };

  it('show/hide (before, block)', () => {
    Html.set(getRoot(), '<div>a</div>');

    const rng = fakeCaret.show(true, SelectorFind.descendant(getRoot(), 'div').getOrDie().dom) as Range;
    const fakeCaretElm = Traverse.children(getRoot())[0] as SugarElement<HTMLElement>;

    assert.equal(SugarNode.name(fakeCaretElm), 'p');
    assert.equal(Attribute.get(fakeCaretElm, 'data-mce-caret'), 'before');
    CaretAsserts.assertRange(rng, CaretAsserts.createRange(fakeCaretElm.dom, 0, fakeCaretElm.dom, 0));

    fakeCaret.hide();
    assert.lengthOf(SelectorFilter.descendants(getRoot(), '*[data-mce-caret]'), 0);
  });

  it('show/hide (after, block)', () => {
    Html.set(getRoot(), '<div>a</div>');

    const rng = fakeCaret.show(false, SelectorFind.descendant(getRoot(), 'div').getOrDie().dom) as Range;
    const fakeCaretElm = Traverse.children(getRoot())[1] as SugarElement<HTMLElement>;

    assert.equal(SugarNode.name(fakeCaretElm), 'p');
    assert.equal(Attribute.get(fakeCaretElm, 'data-mce-caret'), 'after');
    CaretAsserts.assertRange(rng, CaretAsserts.createRange(fakeCaretElm.dom, 0, fakeCaretElm.dom, 0));

    fakeCaret.hide();
    assert.lengthOf(SelectorFilter.descendants(getRoot(), '*[data-mce-caret]'), 0);
  });

  it('show/hide (before, inline)', () => {
    Html.set(getRoot(), '<span>a</span>');

    const rng = fakeCaret.show(true, SelectorFind.descendant(getRoot(), 'span').getOrDie().dom) as Range;
    const fakeCaretText = Traverse.children(getRoot());

    assert.equal(SugarNode.name(fakeCaretText[0]), '#text');
    assert.equal((fakeCaretText[0].dom as Text).data, Zwsp.ZWSP);
    CaretAsserts.assertRange(rng, CaretAsserts.createRange(fakeCaretText[0].dom, 1));

    fakeCaret.hide();
    assert.equal(Traverse.children(getRoot())[0].dom.nodeName, 'SPAN');
  });

  it('show/hide (after, inline)', () => {
    Html.set(getRoot(), '<span>a</span>');

    const rng = fakeCaret.show(false, SelectorFind.descendant(getRoot(), 'span').getOrDie().dom) as Range;
    const fakeCaretText = Traverse.children(getRoot());

    assert.equal(SugarNode.name(fakeCaretText[1]), '#text');
    assert.equal((fakeCaretText[1].dom as Text).data, Zwsp.ZWSP);
    CaretAsserts.assertRange(rng, CaretAsserts.createRange(fakeCaretText[1].dom, 1));

    fakeCaret.hide();
    assert.equal(Traverse.children(getRoot())[0].dom.nodeName, 'SPAN');
  });

  it('getCss', () => {
    assert.isAbove(fakeCaret.getCss().length, 10);
  });

  it('show before TD', () => {
    getRoot().dom.innerHTML = '<table><tr><td contenteditable="false">x</td></tr></table>';
    const rng = fakeCaret.show(false, SelectorFind.descendant(getRoot(), 'td').getOrDie().dom);
    assert.isNull(rng, 'Should be null since TD is not a valid caret target');
  });

  it('show before TH', () => {
    getRoot().dom.innerHTML = '<table><tr><th contenteditable="false">x</th></tr></table>';
    const rng = fakeCaret.show(false, SelectorFind.descendant(getRoot(), 'th').getOrDie().dom);
    assert.isNull(rng, 'Should be null since TH is not a valid caret target');
  });

  it('isFakeCaretTarget', () => {
    const createElement = (html: string, contentEditable: boolean = true) => {
      const parent = SugarElement.fromTag('div');
      const inner = SugarElement.fromHtml(html);
      Insert.append(parent, inner);
      ContentEditable.set(parent, contentEditable);
      return inner;
    };

    assert.isFalse(isFakeCaretTarget(createElement('<p></p>').dom), 'Should not need a fake caret');
    assert.isTrue(isFakeCaretTarget(createElement('<p contenteditable="false"></p>').dom), 'Should always need a fake caret');
    assert.isFalse(isFakeCaretTarget(createElement('<p contenteditable="false"></p>', false).dom), 'Should not have fake caret since context is noneditable');
    assert.equal(isFakeCaretTarget(createElement('<table></table>').dom), isFakeCaretTableBrowser(), 'Should on some browsers need a fake caret');
  });

  it('TINY-10314: fakeCaretContainer after/before a block should have caret-color set to `transparent` to avoid double caret in FireFox', () => {
    Arr.each([ true, false ], (before) => {
      Html.set(getRoot(), '<div>a</div><div id="nonEditable" contenteditable="false">b</div>');

      const rng = fakeCaret.show(before, SelectorFind.descendant(getRoot(), '#nonEditable').getOrDie().dom) as Range;
      const fakeCaretElm = Traverse.children(getRoot())[before ? 1 : 2] as SugarElement<HTMLElement>;

      assert.equal(SugarNode.name(fakeCaretElm), 'p');
      assert.equal(Attribute.get(fakeCaretElm, 'data-mce-caret'), before ? 'before' : 'after');
      assert.equal(fakeCaretElm.dom.style.getPropertyValue('caret-color'), 'transparent', `is not transparent for before: ${before}`);
      assert.equal(Css.getRaw(fakeCaretElm, 'caret-color').getOr(''), 'transparent', `is not transparent for before: ${before}`);
      CaretAsserts.assertRange(rng, CaretAsserts.createRange(fakeCaretElm.dom, 0, fakeCaretElm.dom, 0));

      fakeCaret.hide();
      assert.lengthOf(SelectorFilter.descendants(getRoot(), '*[data-mce-caret]'), 0);
    });
  });
});
