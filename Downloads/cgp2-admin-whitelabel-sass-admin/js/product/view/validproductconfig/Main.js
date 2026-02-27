/**
 * @Description:
 * @author nan
 * @date 2022/3/31
 */

Ext.Loader.syncRequire([])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var productId = JSGetQueryString('product');
    var LanguageStore = Ext.create('CGP.language.store.LanguageStore');
    var panel = Ext.create('Ext.panel.Panel', {
        autoScroll: true,
        frame: false,
        border: false,
        margin: 10,
        layout: 'vbox',
        items: [
            {
                xtype: 'uxfieldset',
                itemId: 'general',
                autoScroll: true,
                width: '100%',
                margin: '10 0 0 0',
                border: '1 0 0 0 ',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('general') + '</font>',
                defaultType: 'displayfield',
                extraButtons: [{
                    xtype: 'button',
                    margin: '0 15 0 15',
                    ui: 'default-toolbar-small',
                    text: i18n.getKey('校验配置'),
                    handler: function (btn) {
                        var fieldSet = btn.ownerCt.ownerCt;
                        var form = fieldSet.items.items[0];
                        var data = form.getValue();
                        if (form.isValid()) {
                            JSSetLoading(true);
                            setTimeout(function () {
                                var mapping = null;
                                if (data.version == 'v2') {
                                    mapping = {
                                        bom: adminPath + 'api/productConfigDesigns/runtime/node/latest?propertyModelId=' + data.propertyModelId + '&version=v1',
                                        navigation: adminPath + 'api/navigations/runtime/latest/test?propertyModelId=' + data.propertyModelId + '&version=v1',
                                        view: adminPath + 'api/productConfigs/runtime/latest/test/v1.1?propertyModelId=' + data.propertyModelId
                                    };
                                } else if (data.version == 'v3') {
                                    mapping = {
                                        bom: adminPath + 'api/productConfigDesigns/runtime/node/latest/v3?propertyModelId=' + data.propertyModelId + '&version=v1',
                                        navigation: adminPath + 'api/navigations/runtime/latest/test?propertyModelId=' + data.propertyModelId +
                                            '&version=v1&languageCode=' + data.language.code.code + (data.language.locale ? ('&regionCode=' + data.language.locale.code) : ''),
                                        view: adminPath + 'api/productInstances/propertyModel/' + data.propertyModelId + '/' + data.language.code.code + '/latest/test'
                                    };
                                }
                                var url = mapping[data.type];
                                JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                                    JSSetLoading(false);
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success == true && data.version == 'v3' && data.type == 'view') {
                                            console.log(responseText.data)
                                            var url2 = adminPath + 'api/builderViewRuntimes/' + responseText.data.builderViewRuntimeId;
                                            JSAjaxRequest(url2, 'GET', false, null, null, function (require, success, response) {
                                                var responseText = Ext.JSON.decode(response.responseText);
                                                if (responseText.success == false) {
                                                    Ext.Msg.close();
                                                }
                                                form.ownerCt.ownerCt.setResult(responseText.data, data.type);
                                            })
                                        } else {
                                            if (responseText.success == false) {
                                                Ext.Msg.close();
                                            }
                                            form.ownerCt.ownerCt.setResult(responseText.data, data.type);
                                        }
                                    }
                                })
                                JSSetLoading(false);
                            }, 100);
                        }
                    }

                }],
                items: [
                    {
                        xtype: 'errorstrickform',
                        border: false,
                        width: '100%',
                        defaults: {
                            padding: '2 5 0 5',
                            width: 350,
                            labelWidth: 150
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'version',
                                itemId: 'version',
                                fieldLabel: i18n.getKey('config') + i18n.getKey('version'),
                                editable: false,
                                valueField: 'value',
                                displayField: 'display',
                                value: 'v3',
                                store: {
                                    xtype: 'store',
                                    fields: [
                                        'value', 'display'
                                    ],
                                    data: [
                                        {
                                            value: 'v2',
                                            display: 'v2'
                                        },
                                        {
                                            value: 'v3',
                                            display: 'v3'
                                        }
                                    ]
                                },
                                listeners: {
                                    change: function (combo, newValue, oldValue) {
                                        var language = combo.ownerCt.getComponent('language');
                                        language.setVisible(newValue == 'v3');
                                        language.setDisabled(!(newValue == 'v3'));
                                    }
                                }
                            },
                            {
                                xtype: 'combo',
                                name: 'type',
                                itemId: 'type',
                                fieldLabel: i18n.getKey('type'),
                                editable: false,
                                valueField: 'value',
                                displayField: 'display',
                                value: 'bom',
                                store: {
                                    xtype: 'store',
                                    fields: [
                                        'value', 'display'
                                    ],
                                    data: [
                                        {
                                            value: 'bom',
                                            display: '简易Bom结构'
                                        },
                                        {
                                            value: 'navigation',
                                            display: '导航配置'
                                        },
                                        {
                                            value: 'view',
                                            display: 'view配置'
                                        }
                                    ]
                                }
                            },
                            {
                                name: 'language',
                                xtype: 'gridcombo',
                                fieldLabel: i18n.getKey('builder') + i18n.getKey('language'),
                                allowBlank: false,
                                itemId: 'language',
                                displayField: 'name',
                                valueField: 'id',
                                msgTarget: 'side',
                                store: LanguageStore,
                                matchFieldWidth: false,
                                editable: false,
                                valueType: 'recordData',
                                gridCfg: {
                                    height: 280,
                                    width: 600,
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            dataIndex: 'id',
                                            xtype: 'gridcolumn',
                                            itemId: 'id',
                                        }, {
                                            text: i18n.getKey('name'),
                                            dataIndex: 'name',
                                            xtype: 'gridcolumn',
                                            itemId: 'name',
                                        }, {
                                            text: i18n.getKey('locale'),
                                            dataIndex: 'locale',
                                            xtype: 'gridcolumn',
                                            itemId: 'locale',
                                            renderer: function (v) {
                                                if (v) {
                                                    return v.name + '(' + v.code + ')';
                                                }
                                            }
                                        }, {
                                            text: i18n.getKey('code'),
                                            dataIndex: 'code',
                                            xtype: 'gridcolumn',
                                            itemId: 'code',
                                            renderer: function (v) {
                                                return v.code;
                                            }
                                        }, {
                                            text: i18n.getKey('image'),
                                            dataIndex: 'image',
                                            xtype: 'gridcolumn',
                                            itemId: 'image',
                                            flex: 1,
                                            renderer: function (v) {
                                                var url = imageServer + v + '/64/64/png';
                                                return '<img src="' + url + '" />';
                                            }
                                        }
                                    ],
                                    bbar: Ext.create('Ext.PagingToolbar', {
                                        store: LanguageStore,
                                        displayInfo: true,
                                        width: 275,
                                        displayMsg: '',
                                        emptyMsg: i18n.getKey('noData')
                                    })
                                },
                                value: {
                                    clazz: "com.qpp.cgp.domain.common.Language",
                                    code: {
                                        clazz: "com.qpp.cgp.domain.common.LanguageCode",
                                        code: "en",
                                        id: 8914054,
                                        name: "英语"
                                    },
                                    id: 9,
                                    name: "English"

                                }
                            },
                            {
                                xtype: 'textfield',
                                name: 'propertyModelId',
                                itemId: 'propertyModelId',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('propertyModelId'),
                            },
                        ]
                    }
                ]
            },
            {
                xtype: 'uxfieldset',
                autoScroll: true,
                width: '100%',
                margin: '10 0 0 0',
                border: '1 0 0 0 ',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('结果') + '</font>',
            },
            {
                xtype: 'container',
                width: '100%',
                itemId: 'container',
                height: '100%',
                flex: 1,
                layout: 'border',
                style: {
                    backgroundColor: 'white'
                },
                defaults: {
                    split: true,
                    collapseMode: 'mini',
                    flex: 1,
                    layout: 'fit',
                    border: false,
                    xtype: 'fieldset',
                },
                items: [
                    {

                        minWidth: 350,
                        region: 'center',
                        setValue: function (data) {
                            var me = this;
                            if (data) {
                                try {
                                    data.body = JSON.parse(data.body);
                                } catch (e) {

                                }
                                me.items.items[0].value = Ext.clone(data);
                                me.items.items[0].getStore().getRootNode().appendChild(JSJsonToTree(data).children);
                                me.show();
                            } else {
                                me.hide();
                            }
                        },
                        itemId: 'bomPanel',
                        title: i18n.getKey('简易Bom结构运行结果'),
                        header: {
                            style: 'background-color:silver;',
                            title: '<font color="green">' + i18n.getKey('简易Bom结构运行结果'),
                            border: '0 0 0 0'
                        },
                        name: 'requestInfo',
                        items: [
                            Ext.create('Ext.ux.tree.JsonTreePanel', {
                                showValue: true,//默认只显示key
                                canAddNode: false,
                                autoScroll: true,
                                editable: false,
                                store: Ext.create('Ext.data.TreeStore', {
                                    autoLoad: true,
                                    fields: [
                                        'text', 'value'
                                    ],
                                    proxy: {
                                        type: 'memory'
                                    },
                                    root: {
                                        expanded: true,
                                        children: []
                                    }
                                }),
                                keyColumnConfig: {
                                    editable: false,
                                    flex: 1
                                },
                                valueColumnConfig: {
                                    renderer: function (value) {
                                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                                    },
                                    flex: 3
                                },
                                extraBtn: [
                                    {
                                        index: 0,
                                        config: {
                                            xtype: 'button',
                                            text: i18n.getKey('展开子节点'),
                                            iconCls: 'icon_expand',
                                            count: 0,//展开的次数
                                            expandableNode: [],//一个可展开的节点的数组
                                            handler: function (btn) {
                                                var treePanel = btn.ownerCt.ownerCt;
                                                if (btn.count == 0) {
                                                    var rootNode = treePanel.getRootNode();
                                                    rootNode.eachChild(function (item) {
                                                        if (item.isLeaf() == true) {
                                                        } else {
                                                            item.expand();
                                                            btn.expandableNode.push(item);
                                                        }
                                                    })
                                                    btn.count++;
                                                } else {
                                                    var expandableNode = [];
                                                    for (var i = 0; i < btn.expandableNode.length; i++) {
                                                        var itemNode = btn.expandableNode[i];
                                                        itemNode.eachChild(function (item) {
                                                            if (item.isLeaf() == true) {
                                                            } else {
                                                                item.expand();
                                                                expandableNode.push(item);
                                                            }
                                                        })
                                                    }
                                                    btn.expandableNode = expandableNode;
                                                    btn.count++;
                                                }

                                            }
                                        }
                                    },
                                    {
                                        index: 2,
                                        config: {
                                            xtype: 'button',
                                            text: i18n.getKey('check') + i18n.getKey('源JSON'),
                                            iconCls: 'icon_check',
                                            handler: function (btn) {
                                                var treePanel = btn.ownerCt.ownerCt;
                                                var valueString = JSON.stringify(treePanel.value, null, "\t");
                                                var win = Ext.create("Ext.window.Window", {
                                                    id: "pageContentInstanceRange",
                                                    modal: true,
                                                    layout: 'fit',
                                                    title: i18n.getKey('check') + i18n.getKey('源JSON'),
                                                    items: [
                                                        {
                                                            xtype: 'textarea',
                                                            fieldLabel: false,
                                                            width: 600,
                                                            height: 400,
                                                            value: valueString
                                                        }
                                                    ]
                                                });
                                                win.show();
                                            }
                                        }
                                    }
                                ]
                            })
                        ],
                        split: {
                            style: {
                                backgroundColor: 'silver'
                            }
                        }

                    },
                    {
                        title: i18n.getKey('导航配置运行结果'),
                        region: 'east',
                        header: {
                            style: 'background-color:silver;',
                            title: '<font color="green">' + i18n.getKey('导航配置运行结果'),
                            border: '0 0 0 0'
                        },
                        setValue: function (data) {
                            var me = this;
                            if (data) {
                                me.items.items[0].value = Ext.clone(data);
                                me.items.items[0].getStore().getRootNode().appendChild(JSJsonToTree(data).children);
                                me.show();
                            } else {
                                me.hide();
                            }
                        },
                        layout: 'fit',
                        hidden: true,
                        itemId: 'navigationPanel',
                        name: 'result',
                        items: [
                            Ext.create('Ext.ux.tree.JsonTreePanel', {
                                showValue: true,//默认只显示key
                                canAddNode: false,
                                editable: false,
                                store: Ext.create('Ext.data.TreeStore', {
                                    autoLoad: true,
                                    fields: [
                                        'text', 'value'
                                    ],
                                    proxy: {
                                        type: 'memory'
                                    },
                                    root: {
                                        expanded: true,
                                        children: []
                                    }
                                }),
                                keyColumnConfig: {
                                    editable: false,
                                    flex: 1
                                },
                                valueColumnConfig: {
                                    renderer: function (value) {
                                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                                    },
                                    flex: 3
                                },
                                extraBtn: [
                                    {
                                        index: 0,
                                        config: {
                                            xtype: 'button',
                                            text: i18n.getKey('expand子节点'),
                                            iconCls: 'icon_expand',
                                            count: 0,//展开的次数
                                            expandableNode: [],//一个可展开的节点的数组
                                            handler: function (btn) {
                                                var treePanel = btn.ownerCt.ownerCt;
                                                if (btn.count == 0) {
                                                    var rootNode = treePanel.getRootNode();
                                                    rootNode.eachChild(function (item) {
                                                        if (item.isLeaf() == true) {
                                                        } else {
                                                            item.expand();
                                                            btn.expandableNode.push(item);
                                                        }
                                                    })
                                                    btn.count++;
                                                } else {
                                                    var expandableNode = [];
                                                    for (var i = 0; i < btn.expandableNode.length; i++) {
                                                        var itemNode = btn.expandableNode[i];
                                                        itemNode.eachChild(function (item) {
                                                            if (item.isLeaf() == true) {
                                                            } else {
                                                                item.expand();
                                                                expandableNode.push(item);
                                                            }
                                                        })
                                                    }
                                                    btn.expandableNode = expandableNode;
                                                    btn.count++;
                                                }

                                            }
                                        }
                                    },
                                    {
                                        index: 2,
                                        config: {
                                            xtype: 'button',
                                            text: i18n.getKey('check') + i18n.getKey('源JSON'),
                                            iconCls: 'icon_check',
                                            handler: function (btn) {
                                                var treePanel = btn.ownerCt.ownerCt;
                                                var valueString = JSON.stringify(treePanel.value, null, "\t");
                                                var win = Ext.create("Ext.window.Window", {
                                                    id: "pageContentInstanceRange",
                                                    modal: true,
                                                    layout: 'fit',
                                                    title: i18n.getKey('check') + i18n.getKey('源JSON'),
                                                    items: [
                                                        {
                                                            xtype: 'textarea',
                                                            fieldLabel: false,
                                                            width: 600,
                                                            height: 400,
                                                            value: valueString
                                                        }
                                                    ]
                                                });
                                                win.show();


                                            }
                                        }
                                    }
                                ]
                            })
                        ],
                        split: {
                            style: {
                                backgroundColor: 'silver'
                            }
                        }
                    },
                    {
                        title: i18n.getKey('view配置运行结果'),
                        layout: 'fit',
                        region: 'east',
                        hidden: true,
                        itemId: 'viewPanel',
                        header: {
                            style: 'background-color:silver;',
                            title: '<font color="green">' + i18n.getKey('view配置运行结果'),
                            border: '0 0 0 0'
                        },
                        split: {
                            style: {
                                backgroundColor: 'silver'
                            }
                        },
                        setValue: function (data) {
                            var me = this;
                            if (data) {
                                me.items.items[0].getStore().getRootNode().removeAll();
                                me.items.items[0].value = Ext.clone(data);
                                me.items.items[0].getStore().getRootNode().appendChild(JSJsonToTree(data).children);
                                me.show();
                            } else {
                                me.hide();
                            }
                        },
                        name: 'result',
                        items: [
                            Ext.create('Ext.ux.tree.JsonTreePanel', {
                                showValue: true,//默认只显示key
                                canAddNode: false,
                                store: Ext.create('Ext.data.TreeStore', {
                                    autoLoad: true,
                                    fields: [
                                        'text', 'value'
                                    ],
                                    proxy: {
                                        type: 'memory'
                                    },
                                    root: {
                                        expanded: true,
                                        children: []
                                    }
                                }),
                                editable: false,//字段是否可以编辑,
                                keyColumnConfig: {
                                    editable: false,
                                    flex: 1
                                },
                                valueColumnConfig: {
                                    renderer: function (value) {
                                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                                    },
                                    flex: 3
                                },
                                extraBtn: [
                                    {
                                        index: 0,
                                        config: {
                                            xtype: 'button',
                                            text: i18n.getKey('expand子节点'),
                                            iconCls: 'icon_expand',
                                            count: 0,//展开的次数
                                            expandableNode: [],//一个可展开的节点的数组
                                            handler: function (btn) {
                                                var treePanel = btn.ownerCt.ownerCt;
                                                if (btn.count == 0) {
                                                    var rootNode = treePanel.getRootNode();
                                                    rootNode.eachChild(function (item) {
                                                        if (item.isLeaf() == true) {
                                                        } else {
                                                            item.expand();
                                                            btn.expandableNode.push(item);
                                                        }
                                                    })
                                                    btn.count++;
                                                } else {
                                                    var expandableNode = [];
                                                    for (var i = 0; i < btn.expandableNode.length; i++) {
                                                        var itemNode = btn.expandableNode[i];
                                                        itemNode.eachChild(function (item) {
                                                            if (item.isLeaf() == true) {
                                                            } else {
                                                                item.expand();
                                                                expandableNode.push(item);
                                                            }
                                                        })
                                                    }
                                                    btn.expandableNode = expandableNode;
                                                    btn.count++;
                                                }

                                            }
                                        }
                                    },
                                    {
                                        index: 2,
                                        config: {
                                            xtype: 'button',
                                            text: i18n.getKey('check') + i18n.getKey('源JSON'),
                                            iconCls: 'icon_check',
                                            handler: function (btn) {
                                                var treePanel = btn.ownerCt.ownerCt;
                                                var valueString = JSON.stringify(treePanel.value, null, "\t");
                                                var win = Ext.create("Ext.window.Window", {
                                                    id: "pageContentInstanceRange",
                                                    modal: true,
                                                    layout: 'fit',
                                                    title: i18n.getKey('check') + i18n.getKey('源JSON'),
                                                    items: [
                                                        {
                                                            xtype: 'textarea',
                                                            fieldLabel: false,
                                                            width: 600,
                                                            height: 400,
                                                            value: valueString
                                                        }
                                                    ]
                                                });
                                                win.show();
                                            }
                                        }
                                    }
                                ]
                            })
                        ]
                    }
                ]
            }

        ],
        setResult: function (data, type) {
            var me = this;
            var container = me.getComponent('container');
            var panel = null;
            if (type == 'bom') {
                panel = container.getComponent('bomPanel');

            } else if (type == 'navigation') {
                panel = container.getComponent('navigationPanel');
            } else if (type == 'view') {
                panel = container.getComponent('viewPanel');
            }
            panel.setValue(data);
            panel.expand();
        }
    });
    page.add([panel]);
});
