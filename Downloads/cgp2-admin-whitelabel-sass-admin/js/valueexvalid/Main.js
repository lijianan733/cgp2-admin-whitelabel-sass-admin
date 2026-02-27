Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        bodyStyle: {
            paddingTop: 0,
        },
    });
    var form = Ext.create('Ext.form.Panel', {
        autoScroll: false,
        border: false,
        layout: 'border',
        allowBlank: false,
        bodyStyle: {
            backgroundColor: 'white',
            borderColor: 'silver',
            paddingTop: '10px',
        },
        // tree重置方法
        removeTree: function (treePanel) {
            treePanel.store.getRootNode().removeAll();
        },
        items: [
            {
                xtype: 'fieldset',
                region: 'west',
                flex: 1,
                height: 500,
                title: "<font style= 'font-size:15px;color:green;font-weight: bold;position:relative;bottom: 2px'>"
                    + i18n.getKey('Json') +
                    '</font>',
                border: false,
                itemId: 'requestInfo',
                layout: 'fit',
                name: 'requestInfo',
                items: [
                    Ext.create('Ext.ux.tree.JsonTreePanel', {
                        showValue: true,//默认只显示key
                        canAddNode: false,
                        autoScroll: true,
                        editable: true,
                        itemId: 'jsonTreePanel',
                        setValue: function (data) {
                            var me = this;
                            if (data) {
                                me.getStore().getRootNode().appendChild(JSJsonToTree(data).children);
                                me.value = data;
                                me.show();
                            }
                        },
                        keyColumnConfig: {
                            editable: true,
                            flex: 1,
                        },
                        valueColumnConfig: {
                            renderer: function (value) {
                                return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">'
                                    + value +
                                    '</div>'
                            },
                            flex: 3,
                        },
                        extraBtn: [
                            {
                                index: 0,
                                config: {
                                    xtype: 'button',
                                    text: i18n.getKey('reset'),
                                    iconCls: 'icon_reset',
                                    count: 0,//展开的次数
                                    expandableNode: [],//一个可展开的节点的数组
                                    handler: function (btn) {
                                        // 重置requestInfo
                                        var jsonTree = btn.ownerCt.ownerCt;
                                        form.removeTree(jsonTree)
                                    },
                                },
                            },
                            {
                                index: 4,
                                config: {
                                    xtype: 'button',
                                    text: i18n.getKey('import'),
                                    iconCls: 'icon_export',
                                    handler: function (btn) {
                                        var jsonTreePanel = btn.ownerCt.ownerCt;
                                        var value = jsonTreePanel.getValue();
                                        var win = Ext.create('Ext.ux.window.ShowJsonDataWindowV2', {
                                            height: 620,
                                            isHiddenRawDateForm: true,
                                            title: i18n.getKey('import'),
                                            rawData: Ext.clone(value),
                                            itemId: 'datawindow',
                                            bbar: {
                                                xtype: 'bottomtoolbar',
                                                saveBtnCfg: {
                                                    handler: function (btn) {
                                                        var win = btn.ownerCt.ownerCt;
                                                        var jsonData = win.getValue();

                                                        function objectIsNull(jsonData) {
                                                            for (let i in jsonData) {
                                                                return true;
                                                            }
                                                            return false;
                                                        };
                                                        if (objectIsNull(jsonData)) {
                                                            form.removeTree(jsonTreePanel);
                                                            jsonTreePanel.setValue(jsonData);
                                                            Ext.Msg.alert(
                                                                i18n.getKey('prompt'),
                                                                i18n.getKey('saveSuccess'),
                                                                function () {
                                                                    win.close();
                                                                },
                                                            );
                                                        } else {
                                                            Ext.Msg.alert(
                                                                i18n.getKey('prompt'),
                                                                i18n.getKey('contentcannotbeempty'),
                                                            );
                                                        }
                                                    },
                                                },
                                            },
                                        });
                                        win.show();
                                    },
                                },
                            },
                        ],
                    }),
                ],
            },
            {
                xtype: 'fieldset',
                flex: 1,
                height: 500,
                title: "<font style= 'font-size:15px;color:green;font-weight: bold;position:relative;bottom: 2px''>"
                    + i18n.getKey('Expression') +
                    '</font>',
                border: false,
                region: 'center',
                itemId: 'expression',
                name: 'expression',
                allowBlank: false,
                layout: 'fit',
                items: [
                    {
                        xtype: 'form',
                        layout: 'fit',
                        itemId: 'expressionItem',
                        bodyStyle: {
                            borderColor: 'silver',
                        },
                        functionValid: function (value) {
                            try {
                                eval('(' + value + ')');
                                return true;
                            } catch (e) {
                                return e
                            }
                        },
                        items: [
                            {
                                xtype: 'textarea',
                                itemId: 'expressionValue',
                                allowBlank: false,
                                checkChangeBuffer: 200,
                                value: '',
                                emptyText: 'function expression(args){' + '\n' +
                                    '      return args;' + '\n' +
                                    '}',
                            },
                        ],
                        tbar: [
                            {
                                xtype: 'button',
                                text: i18n.getKey('reset'),
                                iconCls: 'icon_reset',
                                handler: function (btn) {
                                    var formReset = btn.ownerCt.ownerCt;
                                    formReset.form.reset();
                                },
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('formatting'),
                                iconCls: 'icon_query',
                                handler: function (btn) {
                                    var form = btn.ownerCt.ownerCt;
                                    var expressionValue = form.getComponent('expressionValue');
                                    if (form.isValid()) {
                                        var fjs = js_beautify(
                                            expressionValue.getValue(),
                                            1,
                                            '\t',
                                        );
                                        expressionValue.setValue(fjs);
                                    }
                                },
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('isValid'),
                                handler: function (btn) {
                                    var form = btn.ownerCt.ownerCt;
                                    var expressionValue = btn.ownerCt.ownerCt.getComponent('expressionValue').getValue();
                                    if (form.isValid()) {
                                        var result = form.functionValid(expressionValue)
                                        if (result == true) {
                                            Ext.Msg.alert(
                                                i18n.getKey('prompt'),
                                                i18n.getKey('expression') + i18n.getKey('content') + i18n.getKey('valid'),
                                            );
                                        } else {
                                            Ext.Msg.alert(
                                                i18n.getKey('prompt'),
                                                result,
                                            );
                                        }
                                    }
                                },
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('addModel'),
                                iconCls: 'icon_create',
                                count: 0,//展开的次数
                                expandableNode: [],//一个可展开的节点的数组
                                handler: function (btn) {
                                    var expressionValue = btn.ownerCt.ownerCt.getComponent('expressionValue');
                                    expressionValue.setValue(
                                        'function expression(args){' + '\n' +
                                        '      return args;' + '\n' +
                                        '}',
                                    )
                                },
                            },
                        ],
                    },
                ],
            },
            {
                xtype: 'fieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>"
                    + i18n.getKey('Result') +
                    '</font>',
                border: '1 0 0 0 ',
                itemId: 'result',
                flex: 1,
                height: 500,
                name: 'result',
                region: 'south',
                collapsible: true,
                collapsed: true,
                readOnly: true,
                layout: 'fit',
                items: [
                    Ext.create('Ext.ux.tree.JsonTreePanel', {
                        showValue: true,//默认只显示key
                        canAddNode: false,
                        autoScroll: true,
                        editable: false,
                        readOnly: true,
                        expandAllWidth: 'auto',
                        itemId: 'resultTree',
                        setValue: function (data) {
                            var me = this;
                            if (data) {
                                me.getStore().getRootNode().appendChild(JSJsonToTree(data).children);
                                me.value = data;
                                me.show();
                            }
                        },
                        keyColumnConfig: {
                            editable: false,
                            flex: 1,
                        },
                        valueColumnConfig: {
                            renderer: function (value) {
                                return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">'
                                    + value +
                                    '</div>';
                            },
                            flex: 3,
                        },
                        extraBtn: [],
                    }),
                ],
            },
        ],
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('submit'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var expressionItem = form.getComponent('expression').getComponent('expressionItem');
                    if (expressionItem.isValid()) {
                        var expressionValue = expressionItem.getComponent('expressionValue').getValue();
                        // 判断内容是否有效
                        if (expressionItem.functionValid(expressionValue)) {
                            var treeValue = form.getComponent('requestInfo')
                                .getComponent('jsonTreePanel').getValue();
                            var jsonData = {
                                'expression': expressionValue,
                                'context': {
                                    'date': treeValue,
                                },
                            };
                            var url = adminPath + 'api/attributeProperty/runExpression';
                            JSAjaxRequest(
                                url,
                                'POST',
                                true, jsonData,
                                i18n.getKey('validsuccess'),
                                function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            // 由于tree的根节点只有一个 需要清空重新赋值
                                            var resultTree = form.getComponent('result').getComponent('resultTree');
                                            // 清除并赋值resulttree
                                            form.removeTree(resultTree);
                                            resultTree.setValue(responseText);
                                            var result = form.getComponent('result');
                                            result.expand();
                                        }
                                    }
                                });
                        } else {
                            Ext.Msg.alert(
                                i18n.getKey('prompt'),
                                i18n.getKey('expression') + i18n.getKey('content') + i18n.getKey('invalid'),
                            );
                        }
                    }
                },
            },
            {
                xtype: 'button',
                text: i18n.getKey('reset'),
                iconCls: 'icon_reset',
                handler: function (btn) {
                    // 重置expression
                    form.form.reset();
                    // 重置requestInfo
                    var jsonTree = form.getComponent('requestInfo').getComponent('jsonTreePanel')
                    form.removeTree(jsonTree);
                    // 重置resultTree
                    var resultTree = form.getComponent('result').getComponent('resultTree')
                    form.removeTree(resultTree);
                    // 控制result收展
                    var result = form.getComponent('result');
                    if (!result.collapsed) {
                        result.toggle();
                    }
                },
            },
        ],
    })
    page.add([form]);
})