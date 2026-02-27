/**
 * Created by nan on 2018/8/28.
 */
Ext.define('CGP.useableauthoritymanage.view.LeftPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.leftpanel',
    permissionId: null,//权限id
    itemId: 'leftPanel',
    split: true,
    region: 'east',
    collapsible: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.useableauthoritymanage.store.UseableAuthorityManageStore', {});
        var controller = Ext.create('CGP.useableauthoritymanage.controller.Controller');
        var interPanel = Ext.create('CGP.common.commoncomp.QueryGrid', {
            destorySelected: function () {
                var me = this,
                    view = me.getView();
                Ext.MessageBox.confirm(me.gridText.comfirmCaption, me.gridText.deleteSelectedComfirm, function (btn) {
                    if (btn == 'yes') {
                        var selected = me.getSelectionModel().getSelection();
                        var keys = Ext.Array.slice(me.getSelectionModel().selected.keys);
                        if (!Ext.isEmpty(keys))
                            view.loadMask.show();
                        var store = me.getStore();
                        Ext.each(keys, function (key) {
                            store.remove(store.getById(key));
                        }, this);
                        store.sync({
                            callback: function (o, m) {
                                view.loadMask.hide();
                                if (o.proxy.reader.rawData.success) {
                                    var msg = Ext.ux.util.getMsg(o);
                                    //if (msg) Ext.ux.util.prompt(msg);
                                    Ext.ux.util.prompt('删除成功！');
                                } else {
                                    Ext.ux.util.prompt(o.proxy.reader.rawData.message);
                                    store.reload({
                                        callback: function () {
                                            me.getSelectionModel().select(selected);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            },
            gridCfg: {
                store: store,
                frame: false,
                editAction: true,//是否启用edit的按钮
                deleteAction: true,//是否启用delete的按钮
                columnDefaults: {
                    width: 200
                },
                editActionHandler: function (view, rowIndex, colIndex, button, event, record) {
                    var id = record.getId();
                    JSOpen({
                        id: 'useableAuthorityManage_edit',
                        url: path + "partials/useableauthoritymanage/edit.html?id=" + id,
                        title: i18n.getKey('edit') + i18n.getKey('permission'),
                        refresh: true
                    });
                },
                tbar: {
                    xtype: 'uxstandardtoolbar',
                    btnRead: {
                        hidden: true,
                        handler: function () {
                            me.grid.getStore().loadPage(1);
                        }
                    },
                    btnClear: {
                        hidden: true,
                        handler: function () {
                            me.filter.reset();
                        }
                    },
                    btnCreate: {
                        handler: function (view) {
                            controller.gridShowSelctTypeWin(view);

                        }
                    },
                    btnDelete: {
                        handler: function (view) {
                            view.ownerCt.ownerCt.destorySelected();


                        }
                    },
                    btnExport: {
                        width: 80,
                        text: i18n.getKey('切换视图'),
                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/switch.png',
                        handler: function () {
                            var rightPanel = me.ownerCt.getComponent('rightPanel');
                            me.collapse();
                            rightPanel.expand();
                        }
                    },
                    disabledButtons: ['import', 'help', 'config'],
                    hiddenButtons: ['read', 'clear']
                },

                columns: [
                    {
                        dataIndex: '_id',
                        text: i18n.getKey('id')
                    },
                    {
                        dataIndex: 'name',
                        text: i18n.getKey('permission') + i18n.getKey('name')
                    },
                    {
                        dataIndex: 'description',
                        text: i18n.getKey('description')
                    },
                    {
                        dataIndex: 'clazz',
                        text: i18n.getKey('type'),
                        renderer: function (value, metadata, record) {
                            var type = value == 'com.qpp.security.domain.privilege.AtomPrivilege' ? 'atomPrivilege' : 'combinationPrivilege'
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey(type);
                            return i18n.getKey(type);
                        }
                    },
                    {
                        dataIndex: 'privileges',
                        valueField: '_id',
                        xtype: 'componentcolumn',
                        text: i18n.getKey('permission') + i18n.getKey('content'),
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('permission');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('permission') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var data = [];
                                            if (record.get('clazz') == 'com.qpp.security.domain.privilege.AtomPrivilege') {
                                                data.push({
                                                    resource: record.get('resource').name,
                                                    id: record.get('resource')._id,
                                                    operation: record.get('operation').description
                                                })
                                            } else {
                                                var resourceSort = record.get('resourceSort');
                                                for (var item in resourceSort) {
                                                    var first = resourceSort[item][0];
                                                    var second = resourceSort[item][1];
                                                    if (first.clazz == 'com.qpp.security.domain.operation.Operation') {
                                                        data.push({
                                                            resource: second.name,
                                                            id: second._id,
                                                            operation: first.description
                                                        })
                                                    } else {
                                                        data.push({
                                                            resource: first.name,
                                                            id: first._id,
                                                            operation: second.description
                                                        })
                                                    }
                                                }
                                            }
                                            var win = Ext.create('CGP.useableauthoritymanage.view.CheckPermission', {
                                                data: data
                                            });
                                            win.show();
                                        });
                                    }
                                }
                            };
                        }

                    }
                ]
            },
            filterCfg: {
                height: 80,
                frame: false,
                header: false,
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id',
                        value: me.permissionId,
                        isLike: false
                    },
                    {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name'

                    },
                    {
                        name: 'description',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description'),
                        itemId: 'description'
                    },
                    {
                        name: 'clazz',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('type'),
                        itemId: 'clazz',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: i18n.getKey('atomPrivilege'),
                                    value: 'com.qpp.security.domain.privilege.AtomPrivilege'
                                },
                                {
                                    name: i18n.getKey('combinationPrivilege'),
                                    value: 'com.qpp.security.domain.privilege.combinationPrivilege'
                                }
                            ]
                        }),
                        displayField: 'name',
                        valueField: 'value'
                    },
                    {
                        name: 'resource._id',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('resources') + i18n.getKey('id'),
                        itemId: 'resource',
                        isLike: false
                    }
                ]
            }
        });
        me.items = [interPanel];
        me.callParent();

    }
})