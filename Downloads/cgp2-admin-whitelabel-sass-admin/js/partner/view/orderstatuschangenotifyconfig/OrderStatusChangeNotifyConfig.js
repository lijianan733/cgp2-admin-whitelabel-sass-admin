/**
 * Created by nan on 2018/6/15.
 */
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var type = JSGetQueryString('type');
    var store = Ext.create('CGP.partner.view.orderstatuschangenotifyconfig.store.OrderStatusChangeNotifyConfigStore', {
        partnerId: partnerId,
        type: type
    });
    var orderStatusStore = parent.Ext.StoreManager.get('allOrderStatus');
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('orderstatuschangenotifyconfig'),
        block: 'partner/orderstatuschangenotifyconfig',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (view) {
                    JSOpen({
                        id: 'orderstatuschangenotifyconfigedit',
                        url: path + 'partials/partner/orderstatuschangenotifyconfig/edit.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&createOrEdit=create' + '&type=' + type,
                        title: i18n.getKey('create') + '_' + i18n.getKey('orderStatusChangeEmailNotifyConfig'),
                        refresh: true
                    })
                }
            },
            btnDelete: {
                handler: function (view) {
                    var grid = view.ownerCt.ownerCt;
                    var recordArray = grid.getSelectionModel().getSelection();
                    Ext.Msg.confirm('提示', '确定删除？', callback);
                    function callback(id) {
                        if (id === 'yes') {
                            for (var i = 0; i < recordArray.length; i++) {
                                var recordId = recordArray[i].getId();
                                Ext.Ajax.request({
                                    url: adminPath + 'api/partners/' + partnerId + '/orderStatusChangeNotifyConfigs/' + recordId,
                                    method: 'DELETE',
                                    headers: {
                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                    },
                                    success: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        if (responseMessage.success) {
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
                                })
                            }
                        }
                    }
                }
            }
        },
        gridCfg: {
            store: store,
            id: 'orderstatuschangenotifyconfigGrid',
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                width: 150
            },
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                            tooltip: 'Edit',
                            handler: function (grid, rowIndex, colIndex, a, b, record) {
                                var type = record.get('targetType');
                                var recordId = record.get('_id');
                                JSOpen({
                                    id: 'orderstatuschangenotifyconfigedit',
                                    url: path + 'partials/partner/orderstatuschangenotifyconfig/edit.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&createOrEdit=edit' + '&type=' + type + '&recordId=' + recordId,
                                    title: i18n.getKey('edit') + '_' + i18n.getKey('orderStatusChangeEmailNotifyConfig'),
                                    refresh: true
                                })
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            tooltip: 'Delete',
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var store = view.getStore();
                                var constraintId = record.getId();
                                Ext.Msg.confirm('提示', '确定删除？', callback);
                                function callback(id) {
                                    if (id === 'yes') {
                                        Ext.Ajax.request({
                                            url: adminPath + 'api/partners/' + partnerId + '/orderStatusChangeNotifyConfigs/' + constraintId,
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
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
                                }
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id'
                },
                {
                    text: i18n.getKey('fromStatus'),
                    dataIndex: 'preStatusId',
                    itemId: 'preStatusId',
                    renderer: function (value) {
                        var record = orderStatusStore.findRecord('id', value);
                        if (record) {
                            return record.get('name')
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('toStatus'),
                    dataIndex: 'postStatusId',
                    itemId: 'postStatusId',
                    renderer: function (value) {
                        var record = orderStatusStore.findRecord('id', value);
                        if (record) {
                            return record.get('name')
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('APIRequestConfig'),
                    dataIndex: 'notifyTemplates',
                    itemId: 'restHttpRequestConfigs',
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        var restHttpRequestConfigsArray = [];
                        for (var i = 0; i < value.length; i++) {
                            if (value[i].clazz == 'com.qpp.cgp.domain.partner.order.config.ApiNotifyTemplate') {
                                restHttpRequestConfigsArray.push(value[i]);
                            }
                        }
                        if (!Ext.isEmpty(restHttpRequestConfigsArray)) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('APIRequestConfig') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];
                                        var ela = Ext.fly(a);
                                        var type = record.get('targetType');
                                        var recordId = record.get('_id');
                                        ela.on("click", function () {
                                            JSOpen({
                                                id: 'orderstatuschangenotifyconfigedit',
                                                url: path + 'partials/partner/orderstatuschangenotifyconfig/edit.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&createOrEdit=edit' + '&type=' + type + '&recordId=' + recordId + '&activeTab=1',
                                                title: i18n.getKey('edit') + '_' + i18n.getKey('sendMailCfg'),
                                                refresh: true
                                            })
                                        });
                                    }
                                }
                            }
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('check') + i18n.getKey('notifyEmailConfig'),
                    dataIndex: 'notifyTemplates',
                    itemId: 'userNotifyEmailConfig',
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        var notifyEmailConfigArray = [];
                        for (var i = 0; i < value.length; i++) {
                            if (value[i].clazz == 'com.qpp.cgp.domain.partner.order.config.EmailNotifyTemplate') {
                                notifyEmailConfigArray.push(value[i]);
                            }
                        }
                        if (!Ext.isEmpty(notifyEmailConfigArray)) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('notifyEmailConfig') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];
                                        var ela = Ext.fly(a);
                                        var type = record.get('targetType');
                                        var recordId = record.get('_id');
                                        ela.on("click", function () {
                                            JSOpen({
                                                id: 'orderstatuschangenotifyconfigedit',
                                                url: path + 'partials/partner/orderstatuschangenotifyconfig/edit.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&createOrEdit=edit' + '&type=' + type + '&recordId=' + recordId + '&activeTab=2',
                                                title: i18n.getKey('edit') + '_' + i18n.getKey('sendMailCfg'),
                                                refresh: true
                                            })
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
        // 搜索框
        filterCfg: {
            hidden: true,
            items: [
                {
                    name: 'preStatusId',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('fromStatus'),
                    itemId: 'preStatusId',
                    editable: false,
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    forceSelection: true,
                    labelAlign: 'left',
                    store: orderStatusStore,
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
                    fieldLabel: i18n.getKey('toStatus'),
                    itemId: 'curStatusId',
                    editable: false,
                    forceSelection: true,
                    multiSelect: false,
                    displayField: 'name',
                    pickerAlign: 'tl-bl',
                    valueField: 'id',
                    labelAlign: 'left',
                    store: orderStatusStore,
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
                    id: '_id',
                    name: 'notifications._id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    id: 'statusName',
                    name: 'notifications.statusName',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('CGP.orderlineitem.store.OrderItemStatus'),
                    fieldLabel: i18n.getKey('orderStatus'),
                    valueField: 'name',
                    displayField: 'name',
                    itemId: 'statusName'
                }
            ]
        }
    });
})