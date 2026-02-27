Ext.namespace("editController");
Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
]);
Ext.onReady(function () {
    /*
        var store = Ext.data.StoreManager.lookup('MailTemplateStore');
    */
    var store = Ext.create('CGP.configuration.customeromt.store.CustomerOmtStore', {
        type: 'customer'
    });
    // JS的去url的参数的方法，用来页面间传参
    var webId = JSGetQueryString("websiteId") || 11;
    var mask;
    var OrderStatuses = Ext.create('CGP.common.store.OrderStatuses');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('mailtemplate'),
        block: 'mailtemplate',
        // 编辑页面
        editPage: 'edit.html',
        height: '100%',
        listeners: {
            render: function (component) {
                //mask = component.setLoading('Loading');
            }
        },
        tbarCfg: {
            btnCreate: {
//				disabled : true,
                handler: function () {
                    var id = null;
                    window.parent.addCustEditTab(id, i18n.getKey('user') + i18n.getKey('notifyEmailConfig'));
                }
            },
            btnDelete: {
                handler: function (view) {
                    var grid = this.ownerCt.ownerCt;
                    Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (btn) {
                        if (btn == 'yes') {
                            grid.getView().loadMask.show();
                            var selectItems = grid.getSelectionModel().getSelection();
                            var deleteArray = [];
                            for (var i = 0; i < selectItems.length; i++) {
                                deleteArray.push(selectItems[i].getId())
                            }
                            Ext.Ajax.request({
                                url: adminPath + 'api/orderStatusChangeMailConfigs?configIds=' + deleteArray,
                                method: 'DELETE',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        grid.getView().loadMask.hide();
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                        store.load();
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            });
                        }
                    })
                }
            }
        },

        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            bodyStyle: 'overflow-x:hidden;',
            deleteAction: false,
            editAction: false,
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    width: 60,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('edit'),
                            handler: function (gridview, recordIndex, cellIndex, fun, button, record) {
                                var id = record.getId();
                                window.parent.addCustEditTab(id, i18n.getKey('user') + i18n.getKey('notifyEmailConfig'));
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('destroy'),
                            handler: function (view, rowIndex, colIndex) {
                                Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (btn) {
                                    var selected = view.getSelectionModel().getSelection();
                                    var store = view.getStore();
                                    var record = store.getAt(rowIndex);
                                    var recordId = record.getId();
                                    if (btn == 'yes') {
                                        view.loadMask.show();
                                        Ext.Ajax.request({
                                            url: adminPath + 'api/orderStatusChangeMailConfigs/' + recordId,
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    view.loadMask.hide();
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                                    store.load();
                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                }
                                            },
                                            failure: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('fromStatus'),
                    dataIndex: 'preStatusId',
                    itemId: 'preStatusId',
                    sortable: true,
                    width: 150,
                    renderer: function (value) {
                        var record = OrderStatuses.findRecord('id', value);
                        if (record) {
                            return record.get('name')
                        } else {
                            return null
                        }

                    }
                },
                {
                    text: i18n.getKey('toStatus'),
                    dataIndex: 'curStatusId',
                    itemId: 'curStatusId',
                    sortable: true,
                    width: 150,
                    renderer: function (value) {
                        var record = OrderStatuses.findRecord('id', value);
                        if (record) {
                            return record.get('name')
                        } else {
                            return null
                        }
                    }
                },
                {
                    text: i18n.getKey('notifyEmailConfig'),
                    dataIndex: 'mailTemplateConfig',
                    itemId: 'mailTemplateConfig',
                    xtype: "componentcolumn",
                    width: 200,
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            value.clazz = value.clazz.substring(value.clazz.lastIndexOf('.') + 1, value.clazz.length);
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('notifyEmailConfig') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            var controller = Ext.create('CGP.configuration.customeromt.controller.Controller');
                                            controller.showMailTemplateConfigDetail(value);
                                        });
                                    }
                                }
                            }
                        } else {
                            return null;
                        }
                    }
                }
            ]
        },
        filterCfg: {
            minHeight: 120,
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    isLike: false
                },
                {
                    name: 'preStatusId',
                    xtype: 'combo',
                    itemId: 'fromStatus',
                    editable: false,
                    fieldLabel: i18n.getKey('fromStatus'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    labelAlign: 'right',
                    store: OrderStatuses,
                    queryMode: 'remote',
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            if (!combo.getValue())
                                combo.select(store.getAt(0));
                        }
                    }
                },
                {
                    name: 'curStatusId',
                    xtype: 'combo',
                    itemId: 'toStatus',
                    editable: false,
                    fieldLabel: i18n.getKey('toStatus'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    labelAlign: 'right',
                    store: OrderStatuses,
                    queryMode: 'remote',
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            if (!combo.getValue())
                                combo.select(store.getAt(0));
                        }
                    }
                },
                {
                    id: 'websiteSearchField',
                    name: 'websiteId',
                    itemId: 'website',
                    xtype: 'websitecombo',
                    hidden: true,
                    value: parseInt(webId) || 11

                }
            ],
            listeners: {
                afterrender: function (combo) {
                    store.load({
                        callback: function (records, options, success) {
                        }
                    });
                }
            }
        }
    });
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute("download", fileName);
        a.click();
    };
});