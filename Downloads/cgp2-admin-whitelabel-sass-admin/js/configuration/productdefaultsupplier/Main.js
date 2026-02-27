/**
 * Created by nan on 2018/4/20.
 */
Ext.syncRequire(['CGP.configuration.productdefaultsupplier.controller.Controller',
    'CGP.partner.store.PartnerStore',
    'CGP.configuration.productdefaultsupplier.store.ProductStore',
    'CGP.configuration.productdefaultsupplier.view.DialogSelectProductWindow'])
Ext.onReady(function (items) {
    items = items || [
        {
            xtype: 'textfield',
            isLike: false,
            itemId: '_id',
            name: '_id',
            fieldLabel: i18n.getKey('id')
        },
        {
            name: 'partnerId',
            xtype: 'combo',
            pageSize: 25,
            isLike: false,
            editable: false,
            store: Ext.create('CGP.order.store.PartnerStore'),
            displayField: 'name',
            valueField: 'id',
            fieldLabel: i18n.getKey('partner'),
            itemId: 'partnerId'
        },
        /* {
         xtype: 'numberfield',
         hideTrigger: true,
         isLike: false,
         itemId: 'partnerId',
         name: 'partnerId',
         fieldLabel: i18n.getKey('partner') + i18n.getKey('id')

         },*/
        {
            name: 'product',
            xtype: 'gridcombo',
            itemId: 'product',
            labelAlign: 'left',
            allowBlank: false,
            fieldLabel: i18n.getKey('product'),
            multiSelect: false,
            displayField: 'name',
            valueField: 'id',
            editable: false,
            labelWidth: 50,
            store: me.supportProductStore,
            matchFieldWidth: false,
            pickerAlign: 'bl',
            gridCfg: {
                height: 250,
                width: 600,
                viewConfig: {
                    enableTextSelection: true
                },
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 80,
                        dataIndex: 'id'
                    },
                    {
                        text: i18n.getKey('name'),
                        width: 150,
                        dataIndex: 'name'
                    },
                    {
                        text: i18n.getKey('type'),
                        width: 150,
                        dataIndex: 'type'
                    },
                    {
                        text: i18n.getKey('model'),
                        width: 150,
                        dataIndex: 'model'
                    }
                ],
                tbar: {
                    layout: {
                        type: 'column'
                    },
                    defaults: {
                        width: 170,
                        isLike: false,
                        padding: 2
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('id'),
                            name: 'id',
                            hideTrigger: true,
                            isLike: false,
                            labelWidth: 40
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            name: 'name',
                            isLike: true,
                            labelWidth: 40
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: i18n.getKey('search'),
                            websiteId: me.websiteId,
                            handler: me.searchFunction,
                            width: 80
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('clear'),
                            websiteId: me.websiteId,
                            handler: me.cleanFunction,
                            width: 80
                        }
                    ]
                },
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: me.supportProductStore,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ]
            }
        },

        {
            xtype: 'combo',
            isLike: false,
            pageSize: 25,
            hideTrigger: true,
            itemId: 'productId',
            name: 'productId',
            store: productStore,
            fieldLabel: i18n.getKey('product') + i18n.getKey('id')
        }
    ];
    var websiteId = JSGetQueryString('websiteId');
    var controller = Ext.create('CGP.configuration.productdefaultsupplier.controller.Controller');
    var store = Ext.create('CGP.configuration.productdefaultsupplier.store.ProductDefaultSupplierConfigStore', {
        websiteId: websiteId
    });
    var productStore = Ext.create('CGP.product.store.ProductStore', {
        params: {
            filter: '[{"name":"type","value":"%Sku%","type":"string"},{"name":"mainCategory.website.id","value":' + parseInt(websiteId) + ',"type":"number"}]'
        }
    })
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                itemId: 'btnAdd',
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                handler: function (view) {
                    var win = Ext.create('CGP.configuration.productdefaultsupplier.view.DialogSelectProductWindow', {
                        controller: controller,
                        websiteId: websiteId,
                        searchFunction: controller.searchProduct,
                        cleanFunction: controller.clearParams,
                        gridStore: store,
                        supportProductStore: Ext.create('CGP.configuration.productdefaultsupplier.store.ProductStore', {
                            params: {
                                filter: '[{"name":"mainCategory.website.id","value":' + websiteId + ',"type":"number"},{"name":"type","value":"%sku%","type":"number"}]'
                            }
                        })
                    })
                    win.show();
                }
            },
            {
                itemId: 'btnDelete',
                text: i18n.getKey('delete'),
                iconCls: 'icon_delete',
                handler: function (view) {
                    Ext.Msg.confirm(i18n.getKey('prompt'), '确定删除？', function (select) {
                            if (select === 'yes') {
                                myMask.show();
                                var recordArray = page.grid.getSelectionModel().getSelection();
                                var recordIdArray = [];
                                for (var i = 0; i < recordArray.length; i++) {
                                    recordIdArray.push(recordArray[i].get('_id'));
                                }
                                var successCount = 0;
                                for (var i = 0; i < recordIdArray.length; i++) {
                                    Ext.Ajax.request({
                                        url: adminPath + 'api/websites/' + websiteId + '/productDefaultProducerConfigs/' + recordIdArray[i],
                                        method: 'DELETE',
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        success: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            successCount++;
                                            if (successCount == recordIdArray.length) {
                                                myMask.hide();
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                                page.grid.store.load();
                                            }
                                            if (responseMessage.success) {

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
                    );
                }
            }
        ]
    })
    var page = Ext.create('Ext.ux.ui.GridPage', {
        gridCfg: {
            title: i18n.getKey('manager') + i18n.getKey('product') + i18n.getKey('default') + i18n.getKey('supplier') + i18n.getKey('config'),
            tbar: tbar,
            editAction: false,
            deleteAction: false,
            selType: 'checkboxmodel',
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            tooltip: 'Edit',
                            handler: function (grid, rowIndex, colIndex, a, b, record) {
                                var productId = record.get('product').id;
                                var win = Ext.create('CGP.configuration.productdefaultsupplier.view.DialogSelectPartnerWindow', {
                                    title: i18n.getKey('edit') + '_' + '产品(' + productId + ')的' + i18n.getKey('supplier'),
                                    productId: productId,
                                    websiteId: websiteId,
                                    gridStore: store,
                                    preWin: null,
                                    controller: controller,
                                    recordId: record.get('_id'),
                                    record: record,
                                    partnerStore: Ext.create('CGP.configuration.productdefaultsupplier.store.EnablePartnerStore', {
                                        productId: productId,
                                        listeners: {
                                            load: function (store) {
                                                store.hasLoad = true;
                                            }
                                        }
                                    })
                                });
                                win.show();
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            tooltip: 'Delete',
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var store = view.getStore();
                                var recordId = record.get('_id');
                                Ext.Msg.confirm('提示', '确定删除？', callback);
                                function callback(select) {
                                    if (select === 'yes') {
                                        Ext.Ajax.request({
                                            url: adminPath + 'api/websites/' + websiteId + '/productDefaultProducerConfigs/' + recordId,
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                                    page.grid.store.load();
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
                    renderer: function (value) {
                        return value
                    }
                },
                {
                    text: i18n.getKey('product'),
                    dataIndex: 'product',
                    width: 300,
                    xtype: 'componentcolumn',
                    renderer: function (value) {
                        if (!value) {
                            return null;
                        }
                        var resultValue = new Ext.Template(i18n.getKey('product') + i18n.getKey('id') + ' ：<a href="javascript:{handler}">' + value.id + '</a><br>').apply({
                            handler: "showProductDetail(" + value.id + ")"
                        });
                        resultValue += 'sku : ' + value.sku + '<br>';
                        resultValue += i18n.getKey('name') + ' : ' + value.name + '<br>'
                        return {
                            xtype: 'displayfield',
                            value: resultValue
                        }
                    }
                },
                {
                    text: i18n.getKey('supplier'),
                    dataIndex: 'partner',
                    width: 300,
                    xtype: 'componentcolumn',
                    renderer: function (value) {
                        if (!value) {
                            return null;
                        }
                        var resultValue = new Ext.Template(i18n.getKey('partner') + i18n.getKey('id') + ' ：<a href="javascript:{handler}">' + value.id + '</a><br>').apply({
                            handler: "showPartnerDetail(" + value.id + ")"
                        });
                        resultValue += i18n.getKey('name') + ' : ' + value.name + '<br>';
                        resultValue += i18n.getKey('email') + ' : ' + value.email + '<br>';
                        return {
                            xtype: 'displayfield',
                            value: resultValue
                        }
                    }
                }

            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                width: 350
            },
            items: [
                {
                    xtype: 'textfield',
                    isLike: false,
                    itemId: '_id',
                    name: '_id',
                    fieldLabel: i18n.getKey('id')
                },

                /* {
                 xtype: 'numberfield',
                 hideTrigger: true,
                 isLike: false,
                 itemId: 'partnerId',
                 name: 'partnerId',
                 fieldLabel: i18n.getKey('partner') + i18n.getKey('id')

                 },*/
                {
                    name: 'productId',
                    xtype: 'gridcombo',
                    itemId: 'productId',
                    labelAlign: 'left',
                    fieldLabel: i18n.getKey('product'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    labelWidth: 50,
                    store: productStore,
                    matchFieldWidth: false,
                    pickerAlign: 'bl',
                    gridCfg: {
                        height: 250,
                        width: 550,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                flex: 1,
                                dataIndex: 'id'
                            },
                            {
                                text: i18n.getKey('name'),
                                flex: 3,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('model'),
                                flex: 3,
                                dataIndex: 'model'
                            }
                        ],
                        tbar: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                width: 170,
                                isLike: false,
                                padding: 2
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('id'),
                                    name: 'id',
                                    hideTrigger: true,
                                    isLike: false,
                                    labelWidth: 40
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('name'),
                                    name: 'name',
                                    isLike: true,
                                    labelWidth: 40
                                },
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('search'),
                                    websiteId: websiteId,
                                    handler: function (view) {
                                        controller.searchAllProduct(websiteId, view);
                                    },
                                    width: 80
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    websiteId: websiteId,
                                    handler: function (view) {
                                        controller.clearAllProductParam(websiteId, view);
                                    },
                                    width: 80
                                }
                            ]
                        },
                        dockedItems: [
                            {
                                xtype: 'pagingtoolbar',
                                store: productStore,
                                dock: 'bottom',
                                displayInfo: true
                            }
                        ]
                    }
                },
                {
                    name: 'partnerId',
                    xtype: 'combo',
                    pageSize: 25,
                    isLike: false,
                    editable: false,
                    store: Ext.create('CGP.order.store.PartnerStore'),
                    displayField: 'name',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('partner'),
                    itemId: 'partnerId'
                }/*,
                 {
                 xtype: 'combo',
                 isLike: false,
                 pageSize: 25,
                 hideTrigger: true,
                 itemId: 'productId',
                 name: 'productId',
                 store: productStore,
                 fieldLabel: i18n.getKey('product') + i18n.getKey('id')
                 }*/
            ]
        }

    });
    var myMask = new Ext.LoadMask(page, {msg: "Please wait..."});
    window.showProductDetail = function (productId) {
        JSOpen({
            id: 'productpage',
            url: path + 'partials/product/product.html?id=' + productId,
            title: i18n.getKey('product'),
            refresh: true
        });
    };
    window.showPartnerDetail = function (partnerId) {
        JSOpen({
            id: 'partnerpage',
            url: path + 'partials/partner/main.html?id=' + partnerId,
            title: i18n.getKey('partner'),
            refresh: true
        });

    }
})
