/**
 * Created by nan on 2018/4/16.
 */
Ext.syncRequire(['CGP.product.view.productconfig.productviewconfig.store.ViewConfigStore', 'CGP.product.view.productconfig.productviewconfig.controller.Controller'])
Ext.onReady(function () {
    var controller = Ext.create('CGP.product.view.productconfig.productviewconfig.controller.Controller');
    var data;
    var id = JSGetQueryString('id');
    var productViewConfigId = JSGetQueryString('productViewConfigId');
    var store = Ext.create("CGP.product.view.productconfig.productviewconfig.store.ViewConfigStore", {
        productConfigViewId: productViewConfigId
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'grid',
                store: store,
                columns: [
                    {
                        xtype: 'actioncolumn',
                        itemId: 'actioncolumn',
                        width: 60,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true,
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',
                                itemId: 'actionedit',
                                tooltip: 'Edit',
                                handler: function (view, rowIndex, colIndex) {
                                    var store = view.getStore();
                                    var record = store.getAt(rowIndex);
                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                                    var productId = builderConfigTab.productId;
                                    var isLock = JSCheckProductIsLock(productId);
                                    controller.editViewConfigWindow(store, record, 'edit',productViewConfigId,isLock);
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actionremove',
                                tooltip: 'Remove',
                                handler: function (view, rowIndex, colIndex, four, fire, record) {
                                    var store = view.getStore();
                                    var id = record.get('_id');
                                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确定删除？'), function (select) {
                                        if (select == 'yes') {
                                            Ext.Ajax.request({
                                                url: adminPath + 'api/viewConfigs/' + id,
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
                                    })
                                }
                            }
                        ]
                    },
                    {
                        text: i18n.getKey('id'),
                        sortable: false,
                        width: 180,
                        dataIndex: '_id',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('clazz'),
                        sortable: false,
                        width: 360,
                        dataIndex: 'clazz',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                            return value;
                        }
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                tbar: [
                    {
                        text: i18n.getKey('add'),
                        iconCls: 'icon_create',
                        handler: function () {
                            var store = this.ownerCt.ownerCt.getStore();
                            controller.editViewConfigWindow(store, null, 'new',productViewConfigId);
                        }
                    }
                ]
            }
        ],
        listeners:{
            afterrender:function (){
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        }
    })
});