/**

 * Created by nan on 2019/6/27.
 */
Ext.Loader.syncRequire(['CGP.operationlog.model.OperationLogModel']);
Ext.onReady(function () {
    var recordId = JSGetQueryString('id');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var date = JSGetQueryString('date');
    var form2 = Ext.create('Ext.form.Panel', {
        autoScroll: true,
        frame: false,
        border: false,
        padding: 10,
        layout: 'anchor',
        listeners: {
            afterrender: function () {
                var me = this
                var url = operationLogPath + 'api/operation_logs/' + recordId + '/date/' + date
                JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var data = responseText.data;
                        me.setValue(data);
                    }
                })
            }
        },
        setValue: function (data) {
            var me = this;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.itemId == 'general') {
                    item.setValue(data);
                } else {
                    item.setValue(data[item.itemId]);
                }
            }
        },
        items: [
            {
                xtype: 'fieldset',
                itemId: 'general',
                autoScroll: true,
                border: '1 0 0 0 ',
                defaults: {
                    padding: '2 5 0 5',
                    width: '99%',
                    labelWidth: 150
                },
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('general') + '</font>',
                defaultType: 'displayfield',
                addFieldItem: function (data) {
                    var me = this;
                    var result = [];
                    var attributes = ["tags", "extra"];
                    for (var i = 0; i < attributes.length; i++) {
                        var attribute = attributes[i];
                        var subItems = [];
                        if (attribute == 'tags' || attribute == 'extra') {
                            var title = 'tags';
                            if (attribute == 'extra') {
                                title = '额外信息'
                            }
                            for (var j in data[attribute]) {
                                var item = {
                                    xtype: 'displayfield',
                                    readOnly: true,
                                    labelWidth: 160,
                                    padding: '0 0 0 20',
                                    value: data[attribute][j],
                                    fieldLabel: j
                                };
                                subItems.push(item);
                            }
                            item = {
                                xtype: 'fieldset',
                                title: i18n.getKey(title),
                                border: false,
                                padding: '0 0 0 5',
                                hidden: subItems.length == 0,
                                collapsible: false,
                                defaultType: 'textfield',
                                defaults: {
                                    anchor: '100%',
                                    width: 700
                                },
                                layout: 'anchor',
                                items: subItems
                            }
                        }
                        result.push(item)
                    }
                    me.add(result);
                },
                setValue: function (data) {
                    var me = this;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.getName() == 'time') {
                            value = Ext.Date.format(new Date(data[item.getName()]), 'Y/m/d H:i');
                            item.setValue(value);
                        } else {
                            item.setValue(data[item.getName()]);

                        }
                    }
                    me.addFieldItem(data);
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                    }
                    me.show();
                },
                items: [
                    {
                        itemId: 'ip',
                        fieldLabel: i18n.getKey('IP地址'),
                        name: 'ip'
                    },
                    {
                        itemId: 'user',
                        fieldLabel: i18n.getKey('user'),
                        name: 'user'
                    },
                    {
                        itemId: 'time',
                        fieldLabel: i18n.getKey('请求开始时间'),
                        name: 'time'
                    },

                    {
                        itemId: 'level',
                        fieldLabel: i18n.getKey('level'),
                        name: 'level'
                    },
                    {
                        itemId: 'message',
                        fieldLabel: i18n.getKey('message'),
                        name: 'message'
                    },
                    {
                        itemId: 'module',
                        fieldLabel: i18n.getKey('module'),
                        name: 'module'
                    },
                    {
                        itemId: 'operator',
                        fieldLabel: i18n.getKey('operator'),
                        name: 'operator'
                    },
                    {
                        itemId: 'applicationName',
                        fieldLabel: i18n.getKey('applicationName'),
                        name: 'applicationName'
                    },
                    {
                        itemId: 'duration',
                        fieldLabel: i18n.getKey('duration') + ('(ms)'),
                        name: 'duration'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('request') + '</font>',
                collapsible: true,
                collapsed: false,
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
                border: '1 0 0 0 ',
                itemId: 'requestInfo',
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
                ]
            },
            {
                xtype: 'fieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('result') + '</font>',
                collapsible: true,
                border: '1 0 0 0 ',
                collapsed: true,
                setValue: function (data) {
                    var me = this;
                    if (data && Ext.isObject(data)) {
                        me.items.items[0].value = Ext.clone(data);
                        me.items.items[0].getStore().getRootNode().appendChild(JSJsonToTree(data).children);
                        me.show();
                    } else {
                        me.hide();
                    }
                },
                hidden: true,
                layout: 'fit',
                itemId: 'result',
                name: 'result',
                defaultType: 'displayfield',
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
            },
            {
                xtype: 'fieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('params') + '</font>',
                collapsible: true,
                collapsed: true,
                border: '1 0 0 0 ',
                layout: 'fit',
                hidden: true,
                itemId: 'params',
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
                name: 'result',
                defaultType: 'displayfield',
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
    });
    page.add([form2]);
});
