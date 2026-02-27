Ext.define('CGP.product.edit.component.skuproducts.SkuProductGrid', {
    extend: 'Ext.grid.Panel',


    skuAttributeColumns: [],
    columns: {},
    region: 'center',

    constructor: function (config) {

        var me = this;




        //me.initColumns();

        config = config || {};

        me.callParent([config]);
        me.content = me;

    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('skuProduct');
        me.store = Ext.create('CGP.product.edit.store.SkuProduct',{
            configurableProductId: me.configurableProductId
        });
        me.store.on('beforeload', function () {
            var p = me.getStore().getProxy();
            if (Ext.isEmpty(p.attributeValues)) {
                p.attributeValues = me.attributeValues;
            }
        });
        me.initColumns();
        me.dockedItems = [{
            xtype: 'pagingtoolbar',
            store: me.getStore(), // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true,
            height: 40,
            inputItemWidth: 45,
            width: 500
        }];
        me.callParent(arguments);
        //me.initColumns();

        me.addDocked({
            xtype: 'toolbar',
            dock: 'top',
            items: []
        });

        me.getView().on('viewReady', function (dataview) {
            Ext.each(dataview.panel.headerCt.gridDataColumns, function (column) {
                if (column.autoSizeColumn === true)
                    column.autoSize();
            })
        })

    },
    initColumns: function () {
        var me = this;

        me.getSkuProductColumns();
        var columns = Ext.Array.merge([{
            xtype: 'actioncolumn',
            sortable: false,
            resizable: false,
            menuDisabled: true,
            width: 30,
            items: [{
                    iconCls: 'icon_remove icon_margin',
                    tooltip: i18n.getKey('remove'),
                    handler: me.removeSkuProduct
                }]
        }], me.skuAttributeColumns);
        me.columns = {defaults: {
            //autoSizeColumn: true
        },
            items: columns}
    },

    getSkuProductColumns: function () {

        var me = this;

        var skuAttributeColumns = me.skuAttributeColumns;
        skuAttributeColumns.push({
            dataIndex: 'id',
            text: 'id'
        });

        me.addSkuAttributeColums(skuAttributeColumns);


        skuAttributeColumns.push({
            dataIndex: 'sku',
            text: i18n.getKey('sku') + i18n.getKey('id')
        });

        skuAttributeColumns.push({
            dataIndex: 'salePrice',
            text: i18n.getKey('salePrice')
        });

        skuAttributeColumns.push({
            dataIndex: 'weight',
            text: i18n.getKey('weight')+'(g)'
        });

        return me.skuAttributeColumns = skuAttributeColumns;
    },

    /**
     *根据SkuAttributes生成表格的SkuAttribute colum 并加入到skuAttributeColumns中
     *
     */
    addSkuAttributeColums: function () {
        var me = this;
        var attributeIds = me.attributeIds;
        var attributes = me.attributes;
        var skuAttributeStore = me.store;
        //var sku = me.controller.sku;

        //创建SkuAttribute的column
        Ext.Array.each(attributeIds, function (skuAttributeId) {
            var skuAttributeColumn = {};
            var skuAttribute = attributes.getById(skuAttributeId);
            /*if (!skuAttribute) {
                skuAttribute = skuAttributeStore.getById(skuAttributeId);
            }*/
            skuAttributeColumn.text = skuAttribute.get('name');
            skuAttributeColumn.width = 180;
            skuAttributeColumn.renderer = function (value, metadata, record, rowIndex, colIndex, store, view) {
                var value = '';
                Ext.Array.each(record.data.attributeValues, function (attributeValue) {
                    if (skuAttribute.get('id') == attributeValue['attributeId']) {
                        value = attributeValue['value'];
                    }
                });
                return value;
            };
            me.skuAttributeColumns.push(skuAttributeColumn);
        });

    },
    removeSkuProduct: function (view, rowIndex, colIndex, item, e, record, row) {
        Ext.MessageBox.confirm("提示", "是否刪除？", function (btn) {
            if (btn == 'yes') {
                //?送?求移除?系
                Ext.Ajax.request({
                    method: 'DELETE',
                    url: adminPath + 'api/products/list/' + record.get('id') + '?access_token=' +
                        Ext.util.Cookies.get('token'),
                    success: function (response, options) {
                        var resp = Ext.JSON.decode(response.responseText);
                        if (resp.success) {
                            Ext.Msg.alert('Info', '删除成功!');
                            var store = view.getStore();
                            store.remove(record);
                        } else {
                            Ext.Msg.alert('Info', 'Remove Faild,' + resp.data.message)
                        }

                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        });


    }

});