var _0x5b99 = ['get', 'fly', 'isExpanded', 'getElementById', '复制Value', 'Phrase\x20not\x20found!', 'textPanel', '查找:',
    'getValue', 'getRemoveWhiteSpace', 'onReady', 'isVisible', 'title', 'toUpperCase', 'expandAllTreeNode', 'Window',
    'syncSize', './static/bejson/js/component/jsonview/ico1/blue.gif', 'Element', 'dom', 'text', 'tree', 'TextField',
    'replace', 'createStyleSheet', 'false', 'delay', 'form', 'init', 'replaceClass', 'getUI', 'substring', 'copyTxt',
    'length', 'searchInNode', 'override', '粘贴失败，请手动粘贴', 'parentNode', '#copyTxt',
    './static/bejson/js/component/jsonview/ico1/yellow.gif', 'display', '...', './static/bejson/js/component/jsonview/ico1/s.gif',
    'searchPrevious', 'DelayedTask', 'selectNode', 'TreeNodeUI', 'removeAllChildren', '复制Key+Value', '展开所有节点',
    'emptyIcon', 'getCmp', 'treebuild', 'copySuccess', 'CSS', 'ownerCt', 'space', 'styleSheets', 'newdep_images',
    'iconCls', 'contextmenu', 'none', './static/bejson/js/component/jsonview/ico1/arrow_up.png', 'appendChild',
    'copyItem', './static/bejson/js/component/jsonview/ico1/array.gif', '\x20:\x20null', 'grid', 'doLayout', 'feee',
    '\x20:\x20', 'Clipboard', 'object', 'childNodes', 'x-tree-node-inline-icon', 'iconNode', 'MessageBox',
    'getBottomToolbar', '展开所有子节点', '\x20:\x20\x22', 'searchFn', 'hide', 'addClass',
    'padding-left:10px;font-weight:bold', 'div.tab', 'setValue', 'getRootNode', 'style', 'charAt',
    'hasOwnProperty', 'fireEvent', 'set', '#ext-gen28', '下一个', 'textwwPanel', 'icon_', 'click', 'format',
    'first', 'innerHTML', 'each', 'removeZhuanyi', 'bbar', 'toFixed', 'hasChildNodes', 'searchNext', 'EventObject',
    'hideBbar', 'show', 'attributes', '\x20:\x20function', 'trim', 'searchTextField', 'Panel', 'setText', 'push',
    'split', 'hide_Item', 'showBbar', 'isArray', 'RowSelectionModel', '复制Key', 'isIE', 'border', 'href', 'select',
    'innerText', '{gabor}', 'setIcon', 'removeClass', 'util', 'hide_All', 'padding:\x205px;', '删除空格',
    'div', 'focus', 'join', 'block', 'expand', 'PropertyGrid', 'exp_Item', './static/bejson/js/component/jsonview/ico1/arrow_down.png',
    'collapse', 'number', 'center', 'jsondotcnprefix', 'fit', 'indexOf'];
var _0x5b84 = function (_0x5b9945, _0x5b8401) {
    _0x5b9945 = _0x5b9945 - 0x0;
    var _0x48f33f = _0x5b99[_0x5b9945];
    return _0x48f33f;
};
String['prototype']['trim'] = function () {
    return this[_0x5b84('0x17')](/(^\s*)|(\s*$)/g, '');
};
Ext['override'](Ext['tree']['TreeNode'], {
    'removeAllChildren': function () {
        while (this[_0x5b84('0x68')]()) {
            this['removeChild'](this['firstChild']);
        }
        return this;
    }, 'setIcon': function (_0x2c479e) {
        this['getUI']()['setIcon'](_0x2c479e);
    }, 'setIconCls': function (_0x5c3a94) {
        this[_0x5b84('0x1e')]()['setIconCls'](_0x5c3a94);
    }
});
Ext[_0x5b84('0x23')](Ext[_0x5b84('0x15')][_0x5b84('0x2e')], {
    'setIconCls': function (_0x503c6e) {
        if (this[_0x5b84('0x4b')]) {
            Ext['fly'](this[_0x5b84('0x4b')])[_0x5b84('0x1d')](this['node'][_0x5b84('0x6d')]['iconCls'], _0x503c6e);
        }
        this['node'][_0x5b84('0x6d')][_0x5b84('0x3b')] = _0x503c6e;
    }, 'setIcon': function (_0x1022b1) {
        if (this[_0x5b84('0x4b')]) {
            this[_0x5b84('0x4b')]['src'] = _0x1022b1 || this[_0x5b84('0x32')];
            Ext[_0x5b84('0x1')](this[_0x5b84('0x4b')])[_0x1022b1 ? _0x5b84('0x52') : _0x5b84('0x81')](_0x5b84('0x4a'));
        }
        this['node']['attributes']['icon'] = _0x1022b1;
    }
});
Ext[_0x5b84('0x23')](Ext[_0x5b84('0x71')], {
    'hideBbar': function () {
        if (!this[_0x5b84('0x66')]) {
            return;
        }
        this['bbar']['setVisibilityMode'](Ext[_0x5b84('0x12')]['DISPLAY']);
        this[_0x5b84('0x66')][_0x5b84('0x51')]();
        this[_0x5b84('0x4d')]()['hide']();
        this[_0x5b84('0x10')]();
        if (this['ownerCt']) {
            this[_0x5b84('0x37')][_0x5b84('0x44')]();
        }
    }, 'showBbar': function () {
        if (!this[_0x5b84('0x66')]) {
            return;
        }
        this[_0x5b84('0x66')]['setVisibilityMode'](Ext[_0x5b84('0x12')]['DISPLAY']);
        this[_0x5b84('0x66')][_0x5b84('0x6c')]();
        this['getBottomToolbar']()['show']();
        this['syncSize']();
        if (this['ownerCt']) {
            this['ownerCt'][_0x5b84('0x44')]();
        }
    }
});
Ext['ux'][_0x5b84('0x3b')] = function () {
    var _0x4bc1ad = 'styleSheetIconCls';
    var _0x4c129a = {};
    Ext['util'][_0x5b84('0x36')][_0x5b84('0x18')]('/*\x20Ext.ux.iconCls\x20*/', _0x4bc1ad);
    return {
        'get': function (_0x227717) {
            if (!_0x227717) {
                return null;
            }
            if (typeof _0x4c129a[_0x227717] === 'undefined') {
                _0x4c129a[_0x227717] = _0x5b84('0x5f') + Ext['id']();
                var _0x547e1f = '\x0a.' + _0x4c129a[_0x227717] + '\x20{\x20background-image:\x20url(' + _0x227717 + ')\x20!important;\x20}';
                if (Ext[_0x5b84('0x7a')]) {
                    document[_0x5b84('0x39')][_0x4bc1ad]['cssText'] += _0x547e1f;
                } else {
                    Ext['get'](_0x4bc1ad)[_0x5b84('0x13')]['sheet']['insertRule'](_0x547e1f, 0x0);
                }
            }
            return _0x4c129a[_0x227717];
        }
    };
}();
String['space'] = function (_0x271992) {
    var _0x1774c8 = [], _0x35e4cf;
    for (_0x35e4cf = 0x0; _0x35e4cf < _0x271992; _0x35e4cf++) {
        _0x1774c8[_0x5b84('0x73')]('\x20');
    }
    return _0x1774c8[_0x5b84('0x88')]('');
};

function aboutWindow() {
    var _0x1666cc = [];
    Ext['getBody']()[_0x5b84('0x7d')](_0x5b84('0x54'))[_0x5b84('0x64')](function (_0x17f4ba) {
        _0x1666cc[_0x5b84('0x73')]({
            'title': _0x17f4ba[_0x5b84('0x7d')]('h2')['first']()['dom'][_0x5b84('0x63')],
            'html': _0x17f4ba[_0x5b84('0x7d')](_0x5b84('0x86'))[_0x5b84('0x62')]()['dom'][_0x5b84('0x63')][_0x5b84('0x17')](_0x5b84('0x7f'), '如果觉得好用,请按Ctrl+D收藏！谢谢！')
        });
    });
    var _0x1f2903 = new Ext[(_0x5b84('0xf'))]({
        'title': document[_0x5b84('0xc')],
        'width': 0x280,
        'height': 0x190,
        'modal': !![],
        'layout': 'fit',
        'items': new Ext['TabPanel']({
            'defaults': {'autoScroll': !![], 'bodyStyle': _0x5b84('0x84')},
            'activeTab': 0x0,
            'items': _0x1666cc
        })
    });
    _0x1f2903[_0x5b84('0x6c')]();
}

function getSelectedItems(_0x5b79e4) {
    var _0x20e7e5 = _0x5b79e4[_0x5b84('0x6d')]['children'];
    for (var _0x569dba = 0x0; _0x569dba < _0x20e7e5['length']; _0x569dba++) {
        var _0x599252 = _0x20e7e5[_0x569dba];
        alert(_0x599252['text']);
        if (_0x599252['attributes']['children'][_0x5b84('0x21')] > 0x0) {
            findchildnode(_0x599252);
        }
    }
}

var copyTimer;
Ext[_0x5b84('0xa')](function () {
    Ext['BLANK_IMAGE_URL'] = _0x5b84('0x2a');
    Ext['QuickTips'][_0x5b84('0x1c')]();
    var _0x335695 = new Ext['KeyMap'](document, [{
        'key': Ext[_0x5b84('0x6a')]['F'],
        'ctrl': !![],
        'stopEvent': !![],
        'fn': function () {
            _0x1ce5b9['ctrlF']();
        }
    }, {
        'key': Ext['EventObject']['H'], 'ctrl': !![], 'stopEvent': !![], 'fn': function () {
            _0x1ce5b9['hideToolbar']();
        }
    }]);
    _0x335695['disable']();
    var _0x4a9215 = {
        'xtype': 'propertygrid',
        'id': 'grid',
        'title': '属性',
        hidden: true,
        'region': 'east',
        'width': 0x12c,
        'split': !![],
        'listeners': {
            'beforeedit': function () {
                return ![];
            }
        },
        'selModel': new Ext['grid'][(_0x5b84('0x78'))](),
        'onRender': Ext[_0x5b84('0x43')][_0x5b84('0x8b')]['superclass']['onRender']
    };
    var _0x7f3676 = {
        'id': 'tree',
        'xtype': 'treepanel',
        'region': _0x5b84('0x90'),
        'title': '视图',
        'loader': new Ext[(_0x5b84('0x15'))]['TreeLoader'](),
        'lines': !![],
        'root': new Ext[(_0x5b84('0x15'))]['TreeNode']({'text': 'JSON'}),
        'autoScroll': !![],
        'trackMouseOver': ![],
        viewConfig: {
            enableTextSelection: true,
        },
        'listeners': {
            'render': function (_0x15a531) {
                _0x15a531['getSelectionModel']()['on']('selectionchange', function (_0x4509ff, _0x5395ef) {
                    _0x1ce5b9['gridbuild'](_0x5395ef);
                });
                _0x15a531['on'](_0x5b84('0x3c'), function (_0x3136fa, _0x3d9c38) {
                    var _0x2b4816 = new Ext['menu']['Menu']({
                        'minWidth': 0x78,
                        'items': [{
                            'text': _0x5b84('0x79'),
                            'iconCls': 'newdep_images',
                            'id': _0x5b84('0x40'),
                            'handler': function () {
                                var _0x53eeee = _0x3136fa[_0x5b84('0x14')]['split'](':')[0x0] + '';
                                new ClipboardJS(_0x5b84('0x26'), {
                                    'text': function (_0x452827) {
                                        return _0x53eeee[_0x5b84('0x6f')]();
                                    }
                                });
                                document[_0x5b84('0x3')](_0x5b84('0x20'))[_0x5b84('0x60')]();
                                clearTimeout(copyTimer);
                                document[_0x5b84('0x3')](_0x5b84('0x35'))['style']['display'] = 'block';
                                document['getElementById'](_0x5b84('0x35'))[_0x5b84('0x7e')] = 'Key\x20复制成功';
                                copyTimer = setTimeout(function () {
                                    document[_0x5b84('0x3')](_0x5b84('0x35'))[_0x5b84('0x57')]['display'] = _0x5b84('0x3d');
                                }, 0x7d0);
                            }
                        }, {
                            'text': _0x5b84('0x4'), 'iconCls': _0x5b84('0x3a'), 'handler': function () {
                                var _0x2948b8 = _0x3136fa['text'];
                                _0x2948b8 = _0x2948b8[_0x5b84('0x1f')](_0x2948b8[_0x5b84('0x93')](':') + 0x1);
                                _0x2948b8 = _0x2948b8[_0x5b84('0x17')](/"/g, '');
                                new ClipboardJS(_0x5b84('0x26'), {
                                    'text': function (_0xd2833d) {
                                        return _0x2948b8['trim']();
                                    }
                                });
                                clearTimeout(copyTimer);
                                document['getElementById'](_0x5b84('0x20'))['click']();
                                document['getElementById'](_0x5b84('0x35'))[_0x5b84('0x57')][_0x5b84('0x28')] = _0x5b84('0x89');
                                document[_0x5b84('0x3')]('copySuccess')['innerText'] = 'Value\x20复制成功';
                                copyTimer = setTimeout(function () {
                                    document[_0x5b84('0x3')](_0x5b84('0x35'))['style']['display'] = 'none';
                                }, 0x7d0);
                            }
                        }, {
                            'text': _0x5b84('0x30'), 'iconCls': _0x5b84('0x3a'), 'handler': function () {
                                new ClipboardJS('#copyTxt', {
                                    'text': function (_0x2b56f8) {
                                        return _0x3136fa['text'];
                                    }
                                });
                                clearTimeout(copyTimer);
                                document[_0x5b84('0x3')](_0x5b84('0x20'))[_0x5b84('0x60')]();
                                document['getElementById']('copySuccess')['style'][_0x5b84('0x28')] = _0x5b84('0x89');
                                document[_0x5b84('0x3')](_0x5b84('0x35'))[_0x5b84('0x7e')] = 'Key+Value\x20复制成功';
                                copyTimer = setTimeout(function () {
                                    document['getElementById']('copySuccess')['style'][_0x5b84('0x28')] = _0x5b84('0x3d');
                                }, 0x7d0);
                            }
                        }, {
                            'text': _0x5b84('0x4e'),
                            'iconCls': 'newdep_images',
                            'id': _0x5b84('0x8c'),
                            'handler': function () {
                                _0x3136fa[_0x5b84('0x8a')](!![]);
                            }
                        }, {
                            'text': _0x5b84('0x31'),
                            'iconCls': 'newdep_images',
                            'id': 'exp_All',
                            'handler': function () {
                                _0x15a531['getRootNode']()[_0x5b84('0x8a')](!![]);
                            }
                        }, {
                            'text': '收起所有子节点',
                            'iconCls': 'newdep_images',
                            'id': _0x5b84('0x75'),
                            'handler': function () {
                                _0x3136fa[_0x5b84('0x8e')](!![]);
                            }
                        }, {
                            'text': '收起所有节点',
                            'iconCls': _0x5b84('0x3a'),
                            'id': _0x5b84('0x83'),
                            'handler': function () {
                                _0x15a531['getRootNode']()[_0x5b84('0x8e')](!![]);
                            }
                        }]
                    });
                    _0x2b4816['showAt'](_0x3d9c38['getPoint']());
                    var _0x18870a = '';
                });
            }
        },
        'tbar': [
            _0x5b84('0x7'), new Ext[(_0x5b84('0x1b'))][(_0x5b84('0x16'))]({
                'xtype': 'textfield',
                'id': 'searchTextField'
            }), new Ext['Button']({
                'text': 'GO!', 'handler': function () {
                    _0x1ce5b9['searchStart']();
                }
            }), new Ext[(_0x5b84('0x1b'))]['Label']({
                'id': 'searchResultLabel',
                'style': _0x5b84('0x53')
            }), {
                'iconCls': Ext['ux']['iconCls']['get'](_0x5b84('0x8d')),
                'text': _0x5b84('0x5d'),
                'handler': function () {
                    _0x1ce5b9[_0x5b84('0x69')]();
                }
            }, {
                'iconCls': Ext['ux'][_0x5b84('0x3b')]['get'](_0x5b84('0x3e')), 'text': '上一个', 'handler': function () {
                    _0x1ce5b9[_0x5b84('0x2b')]();
                }
            }, '-', {
                'text': '全部展开', 'handler': function () {
                    _0x1ce5b9[_0x5b84('0xe')]();
                }
            }, {
                'text': '全部收缩', 'handler': function () {
                    _0x1ce5b9['collapseAllTreeNode']();
                }
            }, '->']
    };
    var _0x757202 = {
        'id': 'edit',
        'xtype': 'textarea',
        'style': 'font-family:monospace',
        'emptyText': '将JSON数据粘贴到这里!',
        'selectOnFocus': !![],
        'listeners': {
            'change': function () {
                return _0x1ce5b9['check']();
            }
        }
    };
    var _0x486760 = {
        'id': _0x5b84('0x6'),
        'layout': _0x5b84('0x92'),
        'region': 'west',
        'width': 0x190,
        'split': !![],
        'title': 'JSON数据',
        'tbar': [{
            'text': '复制', 'handler': function () {
                _0x1ce5b9['copyText']();
            }
        }, '-', {
            'text': '格式化', 'handler': function () {
                _0x1ce5b9[_0x5b84('0x61')]();
            }
        }, '-', {
            'text': _0x5b84('0x85'), 'handler': function () {
                _0x1ce5b9['removeWhiteSpace']();
            }
        }, '-', {
            'text': '删除空格并转义', 'handler': function () {
                _0x1ce5b9['removeWhiteSpace2']();
            }
        }, '-', {
            'text': '去除转义', 'handler': function () {
                _0x1ce5b9[_0x5b84('0x65')]();
            }
        }],
        'items': _0x757202
    };
    var _0x1113f1 = new Ext['Viewport']({
        'layout': 'border',
        'items': [_0x486760, {
            'id': _0x5b84('0x5e'),
            'region': 'center',
            'layout': _0x5b84('0x7b'),
            'items': [_0x7f3676]
        }, _0x4a9215]
    });
    var _0x1ce5b9 = function () {
        var _0x8e19b3 = Ext['getCmp']('edit');
        var _0x56e403 = Ext['getCmp']('tree');
        var _0x5fce51 = _0x56e403[_0x5b84('0x56')]();
        var _0x47c055 = Ext['getCmp'](_0x5b84('0x43'));
        var _0x3dd45d = Ext[_0x5b84('0x33')](_0x5b84('0x70'));
        var _0x4edfbd = Ext[_0x5b84('0x33')]('searchResultLabel');
        var _0x2b4bb4 = {};
        var _0x15ae85 = null;
        var _0x2f588f = null;
        var _0x209bc9 = null;
        var _0x227249 = null;
        return {
            'check': function () {
                var _0x46ea20 = _0x8e19b3['getValue']()['split']('\x0a')['join']('\x20');
                try {
                    var _0x1e7bf5 = _0x46ea20[_0x5b84('0x17')](/([^\\]\"):\s*(\[)?([-+Ee0-9.]+)/g, '$1:\x20$2\x22jsondotcnprefix$3\x22');
                    _0x2b4bb4 = JSON['parse'](_0x1e7bf5, function (_0x1a74dc, _0x2ab26c) {
                        if (typeof _0x2ab26c !== 'string') return _0x2ab26c;
                        if (!_0x2ab26c['startsWith'](_0x5b84('0x91'))) return _0x2ab26c;
                        _0x2ab26c = _0x2ab26c['slice'](_0x5b84('0x91')['length']);
                        return new BigNumber(_0x2ab26c);
                    });
                } catch (_0x3a5929) {
                    Ext['MessageBox'][_0x5b84('0x6c')]({
                        'title': 'JSON\x20错误',
                        'msg': 'JSON\x20格式错误',
                        'icon': Ext['MessageBox']['ERROR'],
                        'buttons': Ext[_0x5b84('0x4c')]['OK'],
                        'closable': ![]
                    });
                    return ![];
                }
                if (_0x15ae85 === _0x46ea20) {
                    return;
                }
                _0x15ae85 = _0x46ea20;
                this[_0x5b84('0x34')]();
            }, 'treebuild': function () {
                _0x5fce51[_0x5b84('0x2f')]();
                _0x5fce51[_0x5b84('0x3f')](this['json2leaf'](_0x2b4bb4));
                _0x5fce51[_0x5b84('0x80')](Ext[_0x5b84('0x77')](_0x2b4bb4) ? './static/bejson/js/component/jsonview/ico1/array.gif' : './static/bejson/js/component/jsonview/ico1/object.gif');
                this['gridbuild'](_0x5fce51);
            }, 'gridbuild': function (_0x2d6bd5) {
                if (_0x2d6bd5['isLeaf']()) {
                    _0x2d6bd5 = _0x2d6bd5[_0x5b84('0x25')];
                }
                if (!_0x2d6bd5[_0x5b84('0x49')]['length']) {
                    _0x2d6bd5['expand'](![], ![]);
                    _0x2d6bd5['collapse'](![], ![]);
                }
                var _0x5a98a0 = {};
                for (var _0x27d0f9 = 0x0; _0x27d0f9 < _0x2d6bd5['childNodes']['length']; _0x27d0f9++) {
                    var _0x47c160 = _0x2d6bd5['childNodes'][_0x27d0f9][_0x5b84('0x14')]['split'](':');
                    if (_0x47c160[_0x5b84('0x21')] > 0x1) {
                        _0x5a98a0[_0x47c160[0x0]] = _0x47c160[0x1];
                    } else {
                        _0x5a98a0[_0x47c160[0x0]] = _0x5b84('0x29');
                    }
                }
                _0x47c055['setSource'](_0x5a98a0);
            }, 'json2leaf': function (_0x1a044f) {
                var _0x221040 = [];
                for (var _0x5649a7 in _0x1a044f) {
                    if (_0x1a044f[_0x5b84('0x59')](_0x5649a7)) {
                        if (_0x1a044f[_0x5649a7] === null) {
                            _0x221040['push']({
                                'text': _0x5649a7 + _0x5b84('0x42'),
                                'leaf': !![],
                                'icon': './static/bejson/js/component/jsonview/ico1/red.gif'
                            });
                        } else if (typeof _0x1a044f[_0x5649a7] === 'string') {
                            _0x221040['push']({
                                'text': _0x5649a7 + _0x5b84('0x4f') + _0x1a044f[_0x5649a7] + '\x22',
                                'leaf': !![],
                                'icon': _0x5b84('0x11')
                            });
                        } else if (typeof _0x1a044f[_0x5649a7] === _0x5b84('0x8f')) {
                            _0x221040[_0x5b84('0x73')]({
                                'text': _0x5649a7 + _0x5b84('0x46') + _0x1a044f[_0x5649a7],
                                'leaf': !![],
                                'icon': './static/bejson/js/component/jsonview/ico1/green.gif'
                            });
                        } else if (typeof _0x1a044f[_0x5649a7] === 'boolean') {
                            _0x221040[_0x5b84('0x73')]({
                                'text': _0x5649a7 + _0x5b84('0x46') + (_0x1a044f[_0x5649a7] ? 'true' : _0x5b84('0x19')),
                                'leaf': !![],
                                'icon': _0x5b84('0x27')
                            });
                        } else if (typeof _0x1a044f[_0x5649a7] === _0x5b84('0x48')) {
                            if (_0x1a044f[_0x5649a7] instanceof BigNumber) {
                                _0x221040['push']({
                                    'text': _0x5649a7 + _0x5b84('0x46') + _0x1a044f[_0x5649a7][_0x5b84('0x67')](),
                                    'leaf': !![],
                                    'icon': './static/bejson/js/component/jsonview/ico1/green.gif'
                                });
                            } else {
                                _0x221040['push']({
                                    'text': _0x5649a7,
                                    'children': this['json2leaf'](_0x1a044f[_0x5649a7]),
                                    'icon': Ext['isArray'](_0x1a044f[_0x5649a7]) ? _0x5b84('0x41') : './static/bejson/js/component/jsonview/ico1/object.gif'
                                });
                            }
                        } else if (typeof _0x1a044f[_0x5649a7] === 'function') {
                            _0x221040['push']({
                                'text': _0x5649a7 + _0x5b84('0x6e'),
                                'leaf': !![],
                                'icon': './static/bejson/js/component/jsonview/ico1/red.gif'
                            });
                        }
                    }
                }
                return _0x221040;
            }, 'copyText': function () {
                if (!_0x8e19b3[_0x5b84('0x8')]()) {
                    return;
                }
                try {
                    Ext['ux'][_0x5b84('0x47')][_0x5b84('0x5b')](_0x8e19b3['getValue']());
                } catch (_0x1780e3) {
                    new ClipboardJS(_0x5b84('0x5c'), {
                        'text': function (_0x1f853f) {
                            if (_0x8e19b3['getValue']()) {
                                return _0x8e19b3['getValue']();
                            } else {
                                return ![];
                            }
                        }
                    });
                }
            }, 'pasteText': function () {
                try {
                    _0x8e19b3['setValue'](Ext['ux'][_0x5b84('0x47')][_0x5b84('0x0')]());
                } catch (_0x77a5e0) {
                    alert(_0x5b84('0x24'));
                }
            }, 'searchStart': function () {
                if (!_0x2f588f) {
                    _0x2f588f = new Ext[(_0x5b84('0x82'))][(_0x5b84('0x2c'))](this[_0x5b84('0x50')], this);
                }
                _0x2f588f[_0x5b84('0x1a')](0x96);
            }, 'searchFn': function () {
                _0x209bc9 = [];
                if (!_0x3dd45d[_0x5b84('0x8')]()) {
                    return;
                }
                this[_0x5b84('0x22')](_0x5fce51, _0x3dd45d['getValue']());
                if (_0x209bc9['length']) {
                    _0x4edfbd[_0x5b84('0x72')]('');
                    _0x227249 = 0x0;
                    this[_0x5b84('0x2d')](_0x209bc9[_0x227249]);
                    _0x3dd45d[_0x5b84('0x87')]();
                } else {
                    _0x4edfbd[_0x5b84('0x72')](_0x5b84('0x5'));
                }
            }, 'searchInNode': function (_0x31a829, _0x36f62d) {
                if (_0x31a829[_0x5b84('0x14')]['toUpperCase']()[_0x5b84('0x93')](_0x36f62d[_0x5b84('0xd')]()) !== -0x1) {
                    _0x209bc9['push'](_0x31a829);
                }
                var _0x1e91b6 = _0x31a829[_0x5b84('0x2')]();
                _0x31a829[_0x5b84('0x8a')](![], ![]);
                for (var _0x20d623 = 0x0; _0x20d623 < _0x31a829['childNodes']['length']; _0x20d623++) {
                    if (this[_0x5b84('0x22')](_0x31a829[_0x5b84('0x49')][_0x20d623], _0x36f62d)) {
                    }
                }
                if (!_0x1e91b6) {
                    _0x31a829['collapse'](![], ![]);
                }
            }, 'selectNode': function (_0x57932b) {
                _0x57932b[_0x5b84('0x7d')]();
                _0x56e403[_0x5b84('0x5a')]('click', _0x57932b);
                while (_0x57932b !== _0x5fce51) {
                    _0x57932b = _0x57932b['parentNode'];
                    _0x57932b['expand'](![], ![]);
                }
            }, 'searchNext': function () {
                if (!_0x209bc9 || !_0x209bc9[_0x5b84('0x21')]) {
                    return;
                }
                _0x227249 = (_0x227249 + 0x1) % _0x209bc9['length'];
                this[_0x5b84('0x2d')](_0x209bc9[_0x227249]);
            }, 'searchPrevious': function () {
                if (!_0x209bc9 || !_0x209bc9['length']) {
                    return;
                }
                _0x227249 = (_0x227249 - 0x1 + _0x209bc9['length']) % _0x209bc9[_0x5b84('0x21')];
                this[_0x5b84('0x2d')](_0x209bc9[_0x227249]);
            }, 'ctrlF': function () {
                if (!_0x56e403[_0x5b84('0x4d')]()[_0x5b84('0xb')]()) {
                    _0x56e403[_0x5b84('0x76')]();
                }
                _0x3dd45d[_0x5b84('0x87')](!![]);
            }, 'hideToolbar': function () {
                _0x56e403[_0x5b84('0x6b')]();
            }, 'format': function () {
                var _0x52927b = _0x8e19b3[_0x5b84('0x8')]()[_0x5b84('0x74')]('\x0a')['join']('\x20');
                var _0x51cda8 = [];
                var _0x40c968 = 0x0;
                var _0x1dbd7d = ![];
                for (var _0x5031f9 = 0x0, _0x4065be = _0x52927b[_0x5b84('0x21')]; _0x5031f9 < _0x4065be; _0x5031f9++) {
                    var _0x49457a = _0x52927b['charAt'](_0x5031f9);
                    if (_0x1dbd7d && _0x49457a === _0x1dbd7d) {
                        if (_0x52927b[_0x5b84('0x58')](_0x5031f9 - 0x1) !== '\x5c') {
                            _0x1dbd7d = ![];
                        }
                    } else if (!_0x1dbd7d && (_0x49457a === '\x22' || _0x49457a === '\x27')) {
                        _0x1dbd7d = _0x49457a;
                    } else if (!_0x1dbd7d && (_0x49457a === '\x20' || _0x49457a === '\x09')) {
                        _0x49457a = '';
                    } else if (!_0x1dbd7d && _0x49457a === ':') {
                        _0x49457a += '\x20';
                    } else if (!_0x1dbd7d && _0x49457a === ',') {
                        _0x49457a += '\x0a' + String[_0x5b84('0x38')](_0x40c968 * 0x2);
                    } else if (!_0x1dbd7d && (_0x49457a === '[' || _0x49457a === '{')) {
                        _0x40c968++;
                        _0x49457a += '\x0a' + String[_0x5b84('0x38')](_0x40c968 * 0x2);
                    } else if (!_0x1dbd7d && (_0x49457a === ']' || _0x49457a === '}')) {
                        _0x40c968--;
                        _0x49457a = '\x0a' + String[_0x5b84('0x38')](_0x40c968 * 0x2) + _0x49457a;
                    }
                    _0x51cda8[_0x5b84('0x73')](_0x49457a);
                }
                _0x8e19b3['setValue'](_0x51cda8['join'](''));
            }, 'removeWhiteSpace': function () {
                _0x8e19b3['setValue'](_0x1ce5b9['getRemoveWhiteSpace']());
            }, 'getRemoveWhiteSpace': function () {
                var _0x2fde83 = _0x8e19b3['getValue']()[_0x5b84('0x74')]('\x0a')['join']('\x20');
                var _0x533177 = [];
                var _0x5b03b9 = ![];
                for (var _0x7dab18 = 0x0, _0x52fba3 = _0x2fde83['length']; _0x7dab18 < _0x52fba3; _0x7dab18++) {
                    var _0x41d5a5 = _0x2fde83['charAt'](_0x7dab18);
                    if (_0x5b03b9 && _0x41d5a5 === _0x5b03b9) {
                        if (_0x2fde83[_0x5b84('0x58')](_0x7dab18 - 0x1) !== '\x5c') {
                            _0x5b03b9 = ![];
                        }
                    } else if (!_0x5b03b9 && (_0x41d5a5 === '\x22' || _0x41d5a5 === '\x27')) {
                        _0x5b03b9 = _0x41d5a5;
                    } else if (!_0x5b03b9 && (_0x41d5a5 === '\x20' || _0x41d5a5 === '\x09')) {
                        _0x41d5a5 = '';
                    }
                    _0x533177['push'](_0x41d5a5);
                }
                return _0x533177['join']('');
            }, 'removeWhiteSpace2': function () {
                var _0x948445 = _0x1ce5b9[_0x5b84('0x9')]()[_0x5b84('0x17')](/\"/g, '\x5c\x22');
                _0x8e19b3['setValue'](_0x948445);
            }, 'removeZhuanyi': function () {
                var _0x177e42 = _0x8e19b3[_0x5b84('0x8')]()[_0x5b84('0x17')](/\\\\/g, '\x5c')['replace'](/\\\"/g, '\x22');
                _0x8e19b3[_0x5b84('0x55')](_0x177e42);
            }, 'expandAllTreeNode': function () {
                _0x5fce51[_0x5b84('0x8a')](!![]);
            }, 'collapseAllTreeNode': function () {
                _0x5fce51['collapse'](!![]);
            }
        };
    }();
});