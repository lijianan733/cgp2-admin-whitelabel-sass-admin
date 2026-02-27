/**
 * @Description: 选择产品和属性版本的弹窗
 * 可配置产品可以指定某一属性版本，sku产品不需要
 * @author nan
 * @date 2025/4/9
 */

Ext.define('partner.productSupplier.view.SelectProductAndAttributeVersionWin', {
    extend: 'Ext.window.Window',
    height: 700,
    width: 1000,
    layout: 'fit',
    modal: true,
    title: i18n.getKey('add') + '_' + i18n.getKey('可支持产品'),
    outGrid: null,
    manufactureIdv2: '',
    partnerId: '',
    websiteId: '',
    initComponent: function () {
        var me = this;
        var partnerId = me.partnerId;
        var websiteId = me.websiteId;
        var manufactureIdv2 = me.manufactureIdv2;
        Ext.define('local_next_win', {
            extend: 'Ext.window.Window',
            title: '为产品指定属性版本',
            lastWin: null,
            winData: null,
            modal: true,
            constrain: true,
            layout: 'fit',
            width: 600,
            height: 350,
            outGrid: me.outGrid,
            initComponent: function () {
                var me = this;
                me.items = [
                    {
                        xtype: 'grid',
                        itemId: 'grid',
                        store: {
                            xtype: 'store',
                            fields: ['product', 'attributeVersion', 'selectResult'],
                            data: me.winData
                        },
                        columns: [
                            {
                                dataIndex: 'product',
                                text: '产品',
                                flex: 1,
                                renderer: function (value, metaData, record) {
                                    var info = [
                                        {
                                            title: '编号',
                                            value: value.id
                                        }, {
                                            title: 'SKU',
                                            value: value.sku
                                        }, {
                                            title: '类型',
                                            value: value.type
                                        }, {
                                            title: '名称',
                                            value: value.name
                                        }, {
                                            title: '型号',
                                            value: value.model
                                        }
                                    ];
                                    return JSCreateHTMLTable(info);
                                }
                            },
                            {
                                dataIndex: 'versionedProductAttribute',
                                text: '属性版本',
                                flex: 1,
                                xtype: 'componentcolumn',
                                renderer: function (value, metaData, record) {
                                    var productId = record.get('product').id;
                                    var type = record.get('product').type;
                                    if (type.toUpperCase() == 'SKU') {
                                        return '无属性版本配置';
                                    } else if (type.toUpperCase() == 'CONFIGURABLE') {
                                        var attributeVersionStore = Ext.create('CGP.cmsconfig.store.AttributeVersionStore', {
                                            params: {
                                                filter: Ext.JSON.encode([{
                                                    "name": "product._id",
                                                    "value": productId,
                                                    "type": "number"
                                                }, {
                                                    "name": "status",
                                                    "value": "(TEST|RELEASE)",
                                                    "type": "string"
                                                }])
                                            }
                                        })
                                        return {
                                            xtype: 'combo',
                                            itemId: 'versionProductAttribute',
                                            haveReset: true,
                                            name: 'versionProductAttribute',
                                            width: '100%',
                                            editable: false,
                                            valueField: 'id',
                                            displayField: 'id',
                                            store: attributeVersionStore,
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    var str = '<table style="line-height:normal">' +
                                                        '<td style="text-align:right;">编号:</td><td style="white-space:normal;"><text data-qtip="">{id}</text></td></tr>' +
                                                        '<td style="text-align:right;">version:</td><td style="white-space:normal;"><text data-qtip="">{version}</text></td></tr>' +
                                                        '<td style="text-align:right;">描述:</td><td style="white-space:normal;"><text data-qtip="">{remark}</text></td></tr>' +
                                                        '</table>'
                                                    return str;
                                                },
                                            },
                                            listeners: {
                                                change: function (field, newValue, oldValue) {
                                                    var lastSelection = field.lastSelection;
                                                    if (lastSelection.length == 0) {
                                                        record.raw.selectResult = null;
                                                    } else {
                                                        record.raw.selectResult = lastSelection[0].getData();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ];
                me.bbar = {
                    xtype: 'bottomtoolbar',
                    lastStepBtnCfg: {
                        hidden: false,
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            win.lastWin.show();
                            win.close();
                        }
                    },
                    saveBtnCfg: {
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var grid = win.getComponent('grid');
                            var data = grid.store.proxy.data;
                            win.lastWin.close();
                            console.log(data);
                            data.map((item, index) => {
                                var jsonData = null;
                                jsonData = {
                                    "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.ProductOfManufacture",
                                    "status": "DRAFT",
                                    "pmvtMappingV2":[],
                                    "manufacture": {
                                        "_id": manufactureIdv2,
                                        "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.Manufacture"
                                    },
                                };
                                if (item.product.type.toUpperCase() == 'SKU') {
                                    jsonData = Ext.Object.merge(jsonData, {
                                        "productScope": {
                                            product: item.product,
                                            "productId": item.product.id,
                                            "clazz": "com.qpp.cgp.domain.product.scope.SkuProductSupportScope"
                                        },
                                        "manufactureProduct": {
                                            "sku": item.product.sku,
                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.SkuManufactureProduct"
                                        },
                                    });
                                } else if (item.product.type.toUpperCase() == 'CONFIGURABLE') {
                                    jsonData = Ext.Object.merge(jsonData, {
                                        "productScope": {
                                            product: item.product,
                                            "productId": item.product.id,
                                            versionedProductAttribute: {_id: item.selectResult._id,clazz: item.selectResult.clazz},
                                            "clazz": "com.qpp.cgp.domain.product.scope.ConfigurableProductScope"
                                        },
                                        "manufactureProduct": {
                                            "productId": "",
                                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.ConfigManufactureProduct",
                                            "attributeMappings": []
                                        },
                                    });
                                }
                                var url = adminPath + 'api/productofmanufactures';
                                JSAjaxRequest(url, 'POST', false, jsonData, null, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            win.outGrid.store.load();
                                            win.close();
                                        }
                                    }
                                }, true);
                            });
                        }
                    }
                };
                me.callParent();
            }
        });
        me.items = [
            Ext.create('partner.productSupplier.view.GridWindow', {
                store: Ext.create('CGP.product.store.ProductStoreV2', {}),
                itemId: 'gridWindow',
                partnerId: partnerId,
                websiteId: websiteId,
                manufactureId: manufactureIdv2,
            })
        ];
        me.bbar = {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                hidden: true,
            },
            nextStepBtnCfg: {
                hidden: false,
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var gridWindow = win.getComponent('gridWindow');
                    var gridSelect = gridWindow.grid.getSelectionModel().getSelection();
                    if (gridSelect.length > 0) {
                        var winData = [];
                        gridSelect.map(function (item) {
                            winData.push({
                                product: item.getData(),
                                attributeVersion: {}
                            });
                        });
                        var nextWin = Ext.create('local_next_win', {
                            winData: winData,
                            lastWin: win
                        });
                        nextWin.show();
                        win.hide();
                    } else {
                        Ext.Msg.alert('提示', '请选择需要配置的产品');
                    }
                }
            },
        };
        me.callParent();
    }
})
