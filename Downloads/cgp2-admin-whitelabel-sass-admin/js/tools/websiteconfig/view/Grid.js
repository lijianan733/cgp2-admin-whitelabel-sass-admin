/**
 * @Description:
 * @author nan
 * @date 2023/2/24
 */
Ext.Loader.syncRequire([
    'CGP.tools.websiteconfig.store.Store',
    'CGP.tools.websiteconfig.config.Config'
])
Ext.define('CGP.tools.websiteconfig.view.Grid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.websiteconfiggrid',
    website: '',
    status: null,
    initComponent: function () {
        var me = this;
        var website = CGP.tools.websiteconfig.config.Config.website;
        var editWin = function (record, grid) {
            var win = Ext.create('Ext.window.Window', {
                modal: true,
                constrain: true,
                title: (record ? i18n.getKey('edit') : i18n.getKey('create')) + '配置',
                layout: 'fit',
                items: [
                    {
                        xtype: 'errorstrickform',
                        itemId: 'form',
                        defaults: {
                            xtype: 'textfield',
                            width: 450,
                            allowBlank: false,
                            margin: '5 25 5 25'
                        },
                        items: [{
                            xtype: 'combo',
                            name: 'website',
                            fieldLabel: i18n.getKey('website'),
                            itemId: 'website',
                            value: me.website,
                            readOnly: true,
                            editable: false,
                            valueField: 'value',
                            displayField: 'display',
                            fieldStyle: 'background-color: silver',
                            store: {
                                xtype: 'store',
                                fields: ['value', 'display'],
                                data: website
                            }
                        }, {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('网站状态'),
                            name: 'status',
                            itemId: 'status',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            readOnly: true,
                            fieldStyle: 'background-color: silver',
                            value: me.status,
                            store: {
                                xtype: 'store',
                                data: [{
                                    value: 'stage',
                                    display: '测试网站'
                                }, {
                                    value: 'release',
                                    display: '正式网站'
                                }],
                                fields: ['value', 'display']
                            }
                        }, {
                            xtype: 'textfield',
                            name: 'description',
                            fieldLabel: i18n.getKey('description'),
                            itemId: 'description',
                        }, {
                            xtype: 'booleancombo',
                            name: 'isGlobal',
                            value: false,
                            fieldLabel: i18n.getKey('是否全局变量'),
                            itemId: 'isGlobal',
                            tipInfo: 'true:即window[key名]能取到对应的配置值,false则放到window.'
                        }, {
                            xtype: 'hiddenfield',
                            fieldLabel: i18n.getKey('clazz'),
                            name: 'clazz',
                            value: 'com.qpp.cgp.domain.partner.cooperation.manufacture.WebSiteConfig',
                            itemId: 'clazz'
                        }, {
                            xtype: 'hiddenfield',
                            fieldLabel: i18n.getKey('_id'),
                            name: '_id',
                            itemId: '_id'
                        }, {

                            xtype: 'combo',
                            fieldLabel: i18n.getKey('值类型'),
                            name: 'valueType',
                            itemId: 'valueType',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            value: 'string',
                            store: {
                                xtype: 'store',
                                data: valueType,
                                fields: ['value', 'display']
                            }
                        }, {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('配置名'),
                            name: 'key',
                            itemId: 'key'
                        }, {
                            xtype: 'textarea',
                            fieldLabel: i18n.getKey('配置值'),
                            name: 'value',
                            height: 150,
                            itemId: 'value'
                        },]
                    }
                ],
                bbar: {
                    xtype: 'bottomtoolbar',
                    saveBtnCfg: {
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var form = win.getComponent('form');
                            if (form.isValid()) {
                                var data = form.getValue();
                                for (const dataKey in data) {
                                    if (Ext.isString(data[dataKey])) {
                                        data[dataKey] = data[dataKey].trim();
                                    }
                                }
                                console.log(data);
                                var url = adminPath + 'api/webSiteConfigs';
                                var method = 'POST';
                                if (record) {
                                    url = adminPath + 'api/webSiteConfigs/' + record.getId();
                                    method = 'PUT';
                                }
                                JSAjaxRequest(url, method, true, data, null, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        grid.store.load();
                                    }
                                    win.hide();
                                })
                            }
                        }
                    }
                }
            });
            win.show(null, function () {
                var form = win.getComponent('form');
                if (record) {
                    var data = record.getData();
                    for (const dataKey in data) {
                        if (Ext.isString(data[dataKey])) {
                            data[dataKey] = data[dataKey].trim();
                        }
                    }
                    form.setValue(record.getData());
                }
            });
        };
        website.map(function (item) {
            if (item.value == me.website) {
                me.title = item.display;
            }
        });
        var valueType = [
            {
                value: 'string',
                display: 'string'
            }, {
                value: 'array',
                display: 'array'
            }, {
                value: 'number',
                display: 'number'
            }, {
                value: 'object',
                display: 'object'
            }
        ];
        me.controller = Ext.create('CGP.buildercommonresource.controller.Controller');
        me.gridCfg = {
            tbar: {
                xtype: 'uxstandardtoolbar',
                disabledButtons: ['config', 'export', 'import'],
                hiddenButtons: ['read', 'clear'],
                btnCreate: {
                    handler: function (btn) {
                        console.log(btn);
                        var grid = btn.ownerCt.ownerCt;
                        editWin(null, grid);
                    }
                },
                btnDelete: {
                    handler: function (btn) {
                        var me = this;
                        var grid = me.ownerCt.ownerCt;
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                //获取批量删除项个数
                                //每次删除操作之前刨床当前store中的数据为最新数据，更新store
                                var store = grid.getStore();
                                var getSelection = grid.getSelectionModel().getSelection();
                                store.remove(getSelection);
                            }
                        });
                    }
                },
                btnExport: {
                    xtype: 'button',
                    disabled: false,
                    width: 150,
                    text: i18n.getKey('复制配置到目标网站'),
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var selection = grid.getSelectionModel().getSelection();
                        if (selection.length > 0) {
                            var win = Ext.create('Ext.window.Window', {
                                title: '复制配置',
                                modal: true,
                                constrain: true,
                                layout: 'fit',
                                items: [{
                                    xtype: 'errorstrickform',
                                    itemId: 'form',
                                    layout: {
                                        type: 'vbox',
                                        align: 'center',
                                        pack: 'center'
                                    },
                                    items: [
                                        {
                                            xtype: 'multicombobox',
                                            valueField: 'value',
                                            displayField: 'display',
                                            editable: false,
                                            multiSelect: true,
                                            name: 'website',
                                            itemId: 'website',
                                            width: 350,
                                            fieldLabel: '目标网站',
                                            margin: '10px 25px 10px 25px',
                                            allowBlank: false,
                                            store: {
                                                xtype: 'store',
                                                data: website,
                                                fields: ['value', 'display'],
/*
                                                filters: [
                                                    function (item) {
                                                        return item.get('value') != me.website;
                                                    }
                                                ]
*/
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'status',
                                            itemId: 'status',
                                            fieldLabel: i18n.getKey('网站状态'),
                                            valueField: 'value',
                                            width: 350,
                                            allowBlank: false,
                                            margin: '10px 25px 10px 25px',
                                            displayField: 'display',
                                            editable: false,
                                            store: {
                                                xtype: 'store',
                                                data: [{
                                                    value: 'stage',
                                                    display: '测试网站'
                                                }, {
                                                    value: 'release',
                                                    display: '正式网站'
                                                }],
                                                fields: ['value', 'display']
                                            }
                                        }
                                    ]
                                }],
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            var form = win.getComponent('form');
                                            if (form.isValid()) {
                                                var formData = form.getValue();
                                                var targetEnv = formData.website;
                                                var totalCount = formData.website.length * selection.length;
                                                var count = 0;
                                                JSSetLoading(true);
                                                for (var i = 0; i < selection.length; i++) {
                                                    var record = selection[i];
                                                    var data = record.getData();
                                                    targetEnv.map(function (env) {
                                                        var jsonData = Ext.clone(data);
                                                        jsonData._id = null;
                                                        jsonData.website = env;
                                                        jsonData.status = formData.status;
                                                        JSAjaxRequest(adminPath + 'api/webSiteConfigs', 'POST', true, jsonData, '', function (require, success, response) {
                                                            ++count;
                                                            if (count == totalCount) {
                                                                Ext.Msg.alert('prompt', '同步完成');
                                                                JSSetLoading(false);
                                                                win.close();
                                                            }
                                                        })
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                            win.show();
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择要复制的配置'));
                        }
                    }
                },
            },
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2
                })
            ],
            editActionHandler: function (gridView, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                editWin(record, gridView.ownerCt);
            },
            deleteActionHandler: function (gridView, rowIndex, colIndex, view, event, record, dom) {
                var store = gridView.ownerCt.getStore();
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        var getSelection = record;
                        store.remove(getSelection);
                    }
                })
            },
            store: Ext.create("CGP.tools.websiteconfig.store.Store", {
                autoSync: true,
                remoteSort: false,
                pageSize: 1000,
                sorters: [
                    {
                        property: 'key',
                        direction: 'ASC'
                    }
                ],
            }),
            frame: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 90,
                    dataIndex: '_id',
                    itemId: 'id',
                    isLike: false,
                    sortable: true
                },

                {
                    text: i18n.getKey('key'),
                    dataIndex: 'key',
                    width: 250,
                    itemId: 'key',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: i18n.getKey('value'),
                    dataIndex: 'value',
                    width: 450,
                    itemId: 'value',
                    editor: {
                        xtype: 'textarea',
                        minHeight: 80,
                        grow: true,
                        allowBlank: false
                    },
                    renderer: function (value) {
                        var me = this;
                        return JSAutoWordWrapStr(value);
                    },
                },
                {
                    text: i18n.getKey('valueType'),
                    dataIndex: 'valueType',
                    width: 100,
                    itemId: 'valueType',
                    editor: {
                        xtype: 'combo',
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        allowBlank: false,
                        store: {
                            xtype: 'store',
                            data: valueType,
                            fields: ['value', 'display']
                        }
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 200,
                    itemId: 'description',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    renderer: function (value) {
                        return JSAutoWordWrapStr(value);
                    }
                },
                {
                    text: i18n.getKey('是否全局变量'),
                    dataIndex: 'isGlobal',
                    width: 150,
                    itemId: 'isGlobal',
                    editor: {
                        xtype: 'booleancombo',
                        allowBlank: false
                    },
                    renderer: function (value) {
                        return value ? '<font color="red">全局属性</font>' : '<font color="green">私有属性</font>';
                    }
                },
                {
                    text: i18n.getKey('所属网站'),
                    dataIndex: 'website',
                    itemId: 'website',
                    width: 150,
                    editor: {
                        xtype: 'combo',
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        allowBlank: false,
                        store: {
                            xtype: 'store',
                            data: website,
                            fields: ['value', 'display']
                        }
                    },
                    renderer: function (value) {
                        var result = website.find(function (item) {
                            return item.value == value;
                        });
                        return result.display;
                    }
                },
                {
                    text: i18n.getKey('网站状态'),
                    dataIndex: 'status',
                    width: 150,
                    itemId: 'status',
                    sortable: false,
                    editor: {
                        xtype: 'combo',
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        allowBlank: false,
                        store: {
                            xtype: 'store',
                            data: [{
                                value: 'stage',
                                display: '测试网站'
                            }, {
                                value: 'release',
                                display: '正式网站'
                            }],
                            fields: ['value', 'display']
                        }
                    },
                    renderer: function (value) {
                        return value == 'release' ? '正式网站' : '测试网站'
                    }
                },
            ]
        };
        me.filterCfg = {
            items: [
                {
                    xtype: 'combo',
                    name: 'website',
                    itemId: 'website',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    readOnly: true,
                    isLike: false,
                    value: me.website,
                    fieldLabel: i18n.getKey('website'),
                    store: {
                        xtype: 'store',
                        data: website,
                        fields: ['value', 'display']
                    }
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    itemId: 'status',
                    fieldLabel: i18n.getKey('网站状态'),
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    value: me.status,
                    readOnly: true,
                    store: {
                        xtype: 'store',
                        data: [{
                            value: 'stage',
                            display: '测试网站'
                        }, {
                            value: 'release',
                            display: '正式网站'
                        }],
                        fields: ['value', 'display']
                    }
                },
                {
                    name: 'key',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('key'),
                    itemId: 'key'
                },

            ]
        };
        me.callParent();
    }
})