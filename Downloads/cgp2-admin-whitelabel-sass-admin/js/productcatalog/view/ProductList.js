Ext.define("CGP.productcatalog.view.ProductList", {
    extend: 'CGP.common.commoncomp.QueryGrid',
    minWidth: 500,
    data: null,
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        var productStore = Ext.create("CGP.productcatalog.store.ProductOfCatalog", {
            catalogId: me.data?.id,
            sorters: [{
                property: 'priority',
                direction: 'DESC'
            }]
        });
        var controller = Ext.create('CGP.productcatalog.controller.Controller');
        me.gridCfg = {
            editActionHandler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                var grid = view.ownerCt;
                controller.editProductCatalog(grid.getStore(), rowIndex);
            },
            deleteActionHandler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                var productOfCatalogIds = [record.getId()];
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('Confirm to delete?'), function (selector) {
                    if (selector == 'yes') {
                        controller.batchDeleteProducts(productStore, productOfCatalogIds);
                    }
                })
            },
            store: productStore,
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + i18n.getKey('product'),
                    iconCls: 'icon_add',
                    handler: function () {
                        Ext.create('CGP.productcatalog.view.CatalogBatchAddProductWin', {
                            catalogId: me.data.id,
                            width: 930,
                            productStore: productStore
                        }).show();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('batch') + i18n.getKey('move') + i18n.getKey('catalog'),
                    iconCls: 'icon_batch',
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var productOfCatalogIds = grid.selectedRecords.keys;
                        if (productOfCatalogIds.length == 0) {
                            Ext.Msg.alert('提示', '请先选择要转移的产品!');
                        } else {
                            var win = Ext.create('CGP.productcatalog.view.MoveCategoryWin', {
                                selectedId: me.data?.id,
                                confirmHandler: function (btn) {
                                    var treePanel = btn.ownerCt.ownerCt.down('treepanel');
                                    var targetNodeId = treePanel.getSelectionModel().getSelection()[0].getId();
                                    if (Ext.isEmpty(targetNodeId)) {
                                        Ext.Msg.alert('提示', '请先选择目标类目!');
                                    } else {
                                        controller.categoryMoveProducts(targetNodeId, productStore, productOfCatalogIds, win);
                                    }
                                }
                            })
                            win.show();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('batch') + i18n.getKey('delete'),
                    iconCls: 'icon_delete',
                    handler: function (btn) {
                        var productOfCatalogIds = btn.ownerCt.ownerCt.selectedRecords.keys;
                        if (productOfCatalogIds == 0) {
                            Ext.Msg.alert('提示', '请先选择要删除的产品!');
                        } else {
                            controller.batchDeleteProducts(productStore, productOfCatalogIds);
                        }
                    }
                }
            ],
            columns: [
                {
                    text: i18n.getKey('product') + i18n.getKey('id'),
                    width: 120,
                    dataIndex: 'productId',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                },
                {
                    text: i18n.getKey('product') + i18n.getKey('info'),
                    dataIndex: 'productId',
                    width: 300,
                    itemId: 'productId',
                    renderer: function (value, metadata, record) {
                        var product = record.raw.product;
                        var items = [{
                            title: i18n.getKey('productMode'),
                            value: product.mode
                        }, {
                            title: i18n.getKey('model'),
                            value: product.model
                        }, {
                            title: i18n.getKey('name'),
                            value: product.name
                        }, {
                            title: i18n.getKey('type'),
                            value: product.type
                        }];
                        return JSCreateHTMLTable(items);
                    }
                },
                {
                    text: i18n.getKey('priority'),
                    width: 120,
                    dataIndex: 'priority',
                    itemId: 'priority',

                },
                {
                    text: i18n.getKey('分类页中的产品图'),
                    dataIndex: 'productImage',
                    xtype: 'componentcolumn',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        var result = null;
                        if (value && value.name) {
                            var imgUrl = imageServer + value.name;
                            var imageName = value.originalFileName;
                            result = {
                                xtype: 'imagecomponent',
                                autoEl: 'div',
                                style: 'cursor: pointer',
                                width: 100,
                                height: 100,
                                html: '<img style="width:100px;height:100px;object-fit: contain;" src="' + imgUrl + '">',
                                listeners: {
                                    el: {
                                        click: function () {
                                            var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                                                src: imgUrl,
                                                title: i18n.getKey('图片_') + imageName
                                            });
                                            win.show();
                                        }
                                    }
                                }
                            }
                        }
                        return result;
                    }
                },
                {
                    xtype: 'imagecolumn',
                    width: 150,
                    dataIndex: 'hoverImage',
                    text: i18n.getKey('产品hover图'),
                    //订单的缩略图特殊位置
                    buildUrl: function (value, metadata, record) {
                        if (value) {
                            var imageUrl = value.name;
                            var src = imageServer + imageUrl;
                            return src;
                        }
                    },
                    //订单的缩略图特殊位置
                    buildPreUrl: function (value, metadata, record) {
                        if (value) {
                            var imageUrl = value.name;
                            var src = imageServer + imageUrl;
                            return src;
                        }
                    },
                    buildTitle: function (value, metadata, record) {
                        var imageUrl = value.name;
                        return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                    }
                },
                {
                    text: i18n.getKey('产品在该类目下的描述信息'),
                    dataIndex: 'description',
                    flex: 1,
                }
            ]
        };
        me.filterCfg = {
            height: 75,
            header: false,
            defaults: {
                width: 280
            },
            items: [

                {
                    name: 'product._id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                    itemId: 'productId',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    name: 'product.type',
                    xtype: 'combo',
                    value: '',
                    isLike: false,
                    fieldLabel: i18n.getKey('type'),
                    store: new Ext.data.Store({
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: 'Sku',
                                value: 'Sku'
                            },
                            {
                                name: 'Configurable',
                                value: 'Configurable'
                            },
                            {
                                name: i18n.getKey('allType'),
                                value: ''
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    itemId: 'type',
                    editable: false,
                    listeners: {
                        select: function (combo, records) {
                            if (records[0].get('value') == 'Configurable') {
                                combo.ownerCt.getComponent('sku').setValue('');
                            }
                        }
                    }
                },
                {
                    id: 'nameSearcher',
                    name: 'product.name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    id: 'modelSearcher',
                    name: 'product.model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model'),
                    itemId: 'model'
                },
                {
                    name: 'product.mode',
                    xtype: 'combo',
                    isLike: false,
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '正式', value: 'RELEASE'},
                            {name: '测试', value: 'TEST'}
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    queryMode: 'local',
                    fieldLabel: i18n.getKey('productMode'),
                    itemId: 'mode'
                }
            ]
        };
        me.callParent(arguments);
    },
    refreshData: function (data) {
        var me = this;
        var store = me.down('grid').getStore();
        me.data = data;
        store.proxy.url = adminPath + 'api/product-of-catalog/catalogs/' + data.id;
        if (data.searchProductId) {
            me.filter.getComponent('productId').setValue(data.searchProductId)
        } else {
            me.filter.getComponent('productId').setValue(null)
        }
        me.ownerCt.setTitle("<font color=black>" + data['name'] + "</font>" + '类目下所有产品');
        store.loadPage(1);
        me.grid.selectedRecords.removeAll();

    },
    searchProductId: function (productId) {
        var me = this;
        var store = me.down('grid').getStore();
        store.proxy.url = store.proxy.url + '?_id=' + productId;
        store.load();
    }
});
