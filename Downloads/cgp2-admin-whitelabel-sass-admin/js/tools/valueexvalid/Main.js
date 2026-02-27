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
            'background-color': 'white'
        },
        // tree重置方法
        removeTree: function (treePanel) {
            treePanel.store.getRootNode().removeAll();
        },
        items: [
            {
                xtype: 'panel',
                region: 'west',
                flex: 1,
                height: 500,
                margin: '5 0 5 5',
                bodyStyle: {
                    'border-color': 'silver',
                    'border-width': '0px'
                },
                borderColor: 'silver',
                header: {
                    style: 'background-color:white;border-color:silver',
                    title: "<font color='green' style= 'font-size:15px;font-weight: bold;'>" + i18n.getKey('Json') + '</font>',
                },
                itemId: 'requestInfo',
                layout: 'fit',
                name: 'requestInfo',
                split: true,
                collapsible: false,
                items: [
                    Ext.create('Ext.ux.tree.JsonTreePanel', {
                        showValue: true,//默认只显示key
                        canAddNode: true,
                        autoScroll: true,
                        editable: true,
                        itemId: 'jsonTreePanel',
                        setValue: function (data) {
                            var me = this;
                            if (data) {
                                me.getStore().getRootNode().removeAll()
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
                                        var treePanel = btn.up('[xtype=jsontreepanel]');
                                        form.removeTree(treePanel)
                                    },
                                },
                            },
                            {
                                index: 4,
                                config: {
                                    xtype: 'fieldcontainer',
                                    text: 'text',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'caneter'
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            emptyText: 'PropertyModelId',
                                            name: 'propertyModelId',
                                            itemId: 'propertyModelId',
                                            width: 180,
                                            allowBlank: false,
                                            haveReset: true,
                                            valueField: 'value',
                                            displayField: 'display',
                                            store: {
                                                xtype: 'store',
                                                data: (function () {
                                                    var str = Ext.util.Cookies.get('propertyModelId');
                                                    console.log(str)
                                                    if (str) {
                                                        var arr = Ext.JSON.decode(str);
                                                        var newArr = arr.map(function (item) {
                                                            return {
                                                                value: item,
                                                                display: item
                                                            };
                                                        })
                                                        return newArr;
                                                    } else {
                                                        return [];
                                                    }
                                                })(),
                                                fields: [
                                                    {
                                                        type: 'string', name: 'value'
                                                    }, 'display'
                                                ]
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'icon_export',
                                            margin: '0px 1px',
                                            text: '导入',
                                            tooltip: '根据propertyModelId生成上下文',
                                            handler: function (btn) {
                                                var toolbar = btn.ownerCt.ownerCt;
                                                var propertyModelIdField = btn.ownerCt.getComponent('propertyModelId');
                                                if (propertyModelIdField.isValid()) {
                                                    JSSetLoading(true);

                                                    //存入cookie
                                                    var propertyModelId = propertyModelIdField.getValue();
                                                    var str = Ext.util.Cookies.get('propertyModelId');
                                                    var arr = (str ? Ext.JSON.decode(str) : []);
                                                    arr.indexOf(propertyModelId) == -1 ? arr.push(propertyModelId + '') : null;
                                                    console.log(Ext.JSON.encode(arr))
                                                    Ext.util.Cookies.set('propertyModelId', Ext.JSON.encode(arr));
                                                    var objectDataField = btn.up('[xtype=jsontreepanel]');
                                                    var url = adminPath + 'api/pagecontentschemapreprocessconfig/preprocess/' + propertyModelId + '/context';
                                                    JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                                                        JSSetLoading(false);
                                                        if (success) {
                                                            var responseText = Ext.JSON.decode(response.responseText);
                                                            var data = {
                                                                context: responseText.data,
                                                                params: {},
                                                                attrs: responseText?.data?.attrs
                                                            };
                                                            console.log(data);
                                                            var context = data || {};
                                                            objectDataField.setValue(context);
                                                        }
                                                    });
                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), '请输入propertyModelId');
                                                }
                                            }
                                        }
                                    ]
                                },
                            },
                            {
                                index: 5,
                                config: {
                                    xtype: 'button',
                                    text: i18n.getKey('当前JSON数据'),
                                    iconCls: 'icon_export',
                                    handler: function (btn) {
                                        var jsonTreePanel = btn.up('[xtype=jsontreepanel]');
                                        var value = jsonTreePanel.getValue();
                                        var win = Ext.create('Ext.ux.window.ShowJsonDataWindowV2', {
                                            height: 620,
                                            isHiddenRawDateForm: true,
                                            title: i18n.getKey('import'),
                                            rawData: Ext.clone(value),
                                            itemId: 'datawindow',
                                            showValue: true,
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
                                }
                            }
                        ],
                        initData: {
                            "context": {
                                "22236180": 22236181,
                                "22236909": 23516380,
                                "22236954": "300",
                                "22236957": 22236959,
                                "22236972": 22236977,
                                "22237275": 22237276,
                                "22237451": 22237452,
                                "22275105": "229.1",
                                "22275107": "165",
                                "22275109": "44",
                                "23402104": 23402105,
                                "23546024": 23546025,
                                "24377812": 26450271,
                                "attrs": {
                                    'builderUrl': 'nantest',
                                    "贴纸数量": 5,
                                    "QPSON_Puzzle_Number_of_Pieces": "300",
                                    "QPSON_Packaging_Height": "44",
                                    "QPSON_Puzzle_Print_Insert": "No",
                                    "QPSON_Puzzle_Board_Quality": "Professional",
                                    "QPSON_Puzzle_Number_of_Pieces非sku": "300",
                                    "QPSON_Puzzle_Print_Sides": "Single Side",
                                    "QPSON_Puzzle_packaging": "Custom Rigid box",
                                    "QPSON_Packaging_Length": "229.1",
                                    "QPSON_Puzzle_Upgrade_to_magnetic_puzzle": "False",
                                    "QPSON_Puzzle_print_type": "Traditional",
                                    "QPSON_Puzzle_Finish": "Matte standard",
                                    "QPSON_Packaging_Width": "165",
                                    "QPSON_Puzzle_Frame_add_on": "None"
                                }
                            },
                            "params": {},
                        }
                    }),
                ],
            },
            {
                xtype: 'panel',
                flex: 1,
                margin: '5 5 5 5',
                height: 500,
                bodyStyle: {
                    'border-color': 'silver',
                    'border-width': '0px'
                },
                header: {
                    style: 'background-color:white;border-color:silver',
                    title: "<font color='green' style= 'font-size:15px;font-weight: bold;'>" + i18n.getKey('Expression') + '</font>',
                },
                style: 'background-color:white;',
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
                                iconCls: 'icon_test',
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
                split: true,
                collapsible: true,
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
                                'context': treeValue.context,
                                'attrs': treeValue.context.attrs
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