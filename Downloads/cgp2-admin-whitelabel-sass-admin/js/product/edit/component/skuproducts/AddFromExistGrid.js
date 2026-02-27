Ext.define("CGP.product.edit.component.skuproducts.AddFromExistGrid",{
    extend: "Ext.grid.Panel",

    multiSelect: true,
    selType: 'checkboxmodel',
    skuAttributeColumns: [],
    region: 'center',
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('existSkuProduct');
        me.store = Ext.create("CGP.product.edit.store.SkuProductExclusive",{
            configurableProductId: me.configurableProductId
        })
        me.initColumns();
        me.tbar= [
            {
                xtype: 'button',
                text: i18n.getKey('add'),
                handler: me.addSkuProductToconfigurableProduct
            }
        ]
        me.callParent(arguments);
    },
    initColumns: function () {
        var me = this;


        me.getSkuProductColumns();
        var columns =  me.skuAttributeColumns;
        me.columns = {defaults: {
            autoSizeColumn: true
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
            text: i18n.getKey('sku')
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
        var skuAttributeIds = me.skuAttributeIds;
        var attributes = me.attributes;
        var sku = me.sku;

        //创建SkuAttribute的column
        Ext.Array.each(skuAttributeIds, function (skuAttributeId) {
            var skuAttributeColumn = {};
            var skuAttribute = attributes.getById(skuAttributeId);
            if (!skuAttribute) {
                skuAttribute = sku.getById(skuAttributeId);
            }
            skuAttributeColumn.text = skuAttribute.get('code');
            skuAttributeColumn.renderer = function (value, metadata, record, rowIndex, colIndex, store, view) {
                var value = [];
                Ext.Array.each(record.data.attributeValues, function (attributeValue) {
                    if (Ext.Array.contains(skuAttributeIds, attributeValue['attributeId'])) {
                        var optionIds = attributeValue['optionIds'];

                        Ext.Array.each(optionIds.split(','), function (optionId) {
                            Ext.Array.findBy(skuAttribute.get('options'), function (option) {
                                if (option['id'] == optionId) {
                                    value.push(option['name']);
                                }
                            })
                        })

                    }
                })
                return value.join(',');
            }
            me.skuAttributeColumns.push(skuAttributeColumn);
        });

    }

})