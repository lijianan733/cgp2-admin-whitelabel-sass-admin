/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.controller.Controller',
    'partner.productSupplier.view.GridWindow'
])
Ext.define('partner.productSupplier.view.ProductOfManufacture', {
    extend: 'Ext.container.Container',
    alias: 'widget.product_of_manufacture',
    getValue: Ext.emptyFn,
    setValue: Ext.emptyFn,
    controller: null,
    initComponent: function () {
        var me = this;
        var partnerId = JSGetQueryString('partnerId');
        var websiteId = JSGetQueryString('websiteId');
        var store = Ext.create('partner.productSupplier.store.ProductOfManufacturesStore', {
            params: {
                id: partnerId
            },
            listeners: {
                load: function (store, records) {
                    //当该store没有旧数据时，该组件隐藏
                    if (records.length == 0) {
                        me.hide();
                    }
                }
            }
        });
        me.items = [
            {
                xtype: 'optionalconfigcontainerv3',
                allowBlank: false,
                title: me.title,
                name: 'monthImageConfig',
                width: '100%',
                status: 'FINISHED',
                titleFn: Ext.emptyFn,
                containerConfig: {
                    defaults: {
                        width: 500,
                        margin: '0 0 0 10',
                        allowBlank: true,
                    },
                },
                toolbarItems: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_add',
                        text: i18n.getKey('添加产品'),
                        handler: function (btn) {
                            var manufactureIdv2 = me.controller.queryDataId;
                            if (me.controller.isPOST) {
                                var editPanel = btn.ownerCt.ownerCt.ownerCt.ownerCt;
                                var value = editPanel.diyGetValue();
                                var url = adminPath + 'api/manufactures';
                                JSSetLoading(true);
                                JSAjaxRequest(url, 'POST', false, value, false, function (require, success, response) {
                                    JSSetLoading(false);
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        manufactureIdv2 = responseText.data._id;
                                        me.controller.isPOST = false;
                                        me.controller.queryDataId = manufactureIdv2;
                                        me.ownerCt.diySetValue(responseText.data);
                                    }
                                })
                            }
                            Ext.create('Ext.window.Window', {
                                height: 700,
                                width: 1000,
                                layout: 'fit',
                                modal: true,
                                title: i18n.getKey('add') + '_' + i18n.getKey('可支持产品'),
                                items: [
                                    Ext.create('partner.productSupplier.view.GridWindow', {
                                        itemId: 'gridWindow',
                                        partnerId: +partnerId,
                                        websiteId: +websiteId,
                                        manufactureId: manufactureIdv2,
                                    })
                                ],
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            var url = adminPath + 'api/productofmanufactures';
                                            var gridWindow = win.getComponent('gridWindow');
                                            var gridSelect = gridWindow.grid.getSelectionModel().getSelection();
                                            if (gridSelect.length > 0) {
                                                JSSetLoading(true);
                                                gridSelect.forEach((item, index) => {
                                                    var sku;
                                                    var data = item.data;
                                                    var id = data._id;
                                                    var type = data.type;
                                                    var isSku = type === 'SKU';
                                                    isSku && (sku = data.sku);
                                                    var skuModel = {
                                                        "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.ProductOfManufacture",
                                                        "productScope": {
                                                            "productId": id,
                                                            "clazz": "com.qpp.cgp.domain.product.scope.SkuProductSupportScope"
                                                        },
                                                        "manufacture": {
                                                            "_id": manufactureIdv2,
                                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.Manufacture"
                                                        },
                                                        "status": "DRAFT",
                                                        "manufactureProduct": {
                                                            "sku": sku,
                                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.SkuManufactureProduct"
                                                        },
                                                        "pmvtMapping": {
                                                            "name": "",
                                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.SimplePMVTMapping",
                                                            "materialPathMapping": []
                                                        }
                                                    };
                                                    var configModel = {
                                                        "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.ProductOfManufacture",
                                                        "productScope": {
                                                            "productId": id,
                                                            "clazz": "com.qpp.cgp.domain.product.scope.ConfigurableProductScope"
                                                        },
                                                        "manufacture": {
                                                            "_id": manufactureIdv2,
                                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.Manufacture"
                                                        },
                                                        "status": "DRAFT",
                                                        "manufactureProduct": {
                                                            "productId": "",
                                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.ConfigManufactureProduct",
                                                            "attributeMappings": []
                                                        },
                                                        "pmvtMapping": {
                                                            "name": "",
                                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.SimplePMVTMapping",
                                                            "materialPathMapping": []
                                                        }
                                                    };
                                                    var jsonData = isSku ? skuModel : configModel;
                                                    JSAjaxRequest(url, "POST", false, jsonData, null, function (require, success, response) {
                                                        gridSelect.length - 1 === index && JSSetLoading(false);
                                                        if (success) {
                                                            Ext.Msg.alert('提示', '添加成功!', function callback() {
                                                                store.load();
                                                            });
                                                        }
                                                    })
                                                });
                                                win.close();
                                            } else {
                                                Ext.Msg.alert('提示', '请选择一条数据!')
                                            }
                                        }
                                    },
                                }
                            }).show()
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_remove',
                        text: i18n.getKey('删除'),
                        handler: function (btn) {
                            me.controller.removeProductManagementBtn(btn, store);
                        }
                    }
                ],
                containerItems: [
                    {
                        xtype: 'grid',
                        store: store,
                        width: 1200,
                        maxHeight: 400,
                        itemId: 'grid',
                        selType: 'checkboxmodel',
                        columns: [
                            {
                                xtype: 'rownumberer',
                                align: 'left',
                                tdCls: 'vertical-middle',
                                width: 40
                            },
                            {
                                xtype: 'atagcolumn',
                                minWidth: 120,
                                align: 'center',
                                dataIndex: '_id',
                                text: i18n.getKey('供应商产品配置'),
                                getDisplayName: function () {
                                    return '<font color=blue style="text-decoration:underline">' + "<a>编辑</a>" + '</font>'
                                },
                                clickHandler: function (value, metaData, record) {
                                    var recordData = record.getData();
                                    var productId = record.get('product')._id;
                                    me.controller.editSupplierProductConfigBtn(recordData, store, productId);
                                }
                            },
                            {
                                flex: 1,
                                dataIndex: 'status',
                                text: i18n.getKey('配置状态'),
                                renderer: function (value) {
                                    var group = {
                                        RELEASE: '上线',
                                        TEST: '下线',
                                        DRAFT: '草稿',
                                    }
                                    return group[value];
                                }
                            },
                            {
                                width: 200,
                                dataIndex: 'product',
                                text: i18n.getKey('产品名称'),
                                renderer: function (value) {
                                    return value['name'];
                                }
                            },
                            {
                                flex: 1,
                                dataIndex: 'product',
                                text: i18n.getKey('产品编号'),
                                renderer: function (value) {
                                    return value['_id'];
                                }
                            },
                            {
                                flex: 1,
                                dataIndex: 'product',
                                text: i18n.getKey('产品类型'),
                                renderer: function (value) {
                                    return value['type'];
                                }
                            },
                            {
                                width: 200,
                                dataIndex: 'product',
                                text: i18n.getKey('产品型号'),
                                renderer: function (value) {
                                    return value['model'];
                                }
                            },
                            {
                                width: 200,
                                dataIndex: 'product',
                                text: i18n.getKey('SKU'),
                                renderer: function (value) {
                                    return value['sku'];
                                }
                            },
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: store
                        }
                    }
                ]
            }
        ];
        me.callParent();
    }
})