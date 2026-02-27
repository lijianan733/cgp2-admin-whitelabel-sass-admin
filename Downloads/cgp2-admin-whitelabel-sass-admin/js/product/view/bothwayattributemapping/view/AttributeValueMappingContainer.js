/**
 * Created by admin on 2019/11/26.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.AttributeValueMappingContainer', {
    extend: 'Ext.form.FieldContainer',
    layout: {
        type: 'hbox'
    },
    defaults: {
        height: 350
    },
    requires: ['CGP.product.view.bothwayattributemapping.view.AttributeTreePanel'],
    initComponent: function () {
        var me = this;
        me.items=[
            Ext.create('CGP.product.view.bothwayattributemapping.view.AttributeTreePanel', {
                padding: '10 10 10 10',
                title: i18n.getKey('leftSkuAttribute')+i18n.getKey('value'),//+me.mappingIndex,
                itemId: 'left',
                height: 260,
                width: 400,
                autoScroll: true,
                skuAttributesGrid: me.leftAttribute,
                valueData:me.mappingData.leftValues,
                mappingData:me.mappingData,
                productId: me.productId
            }),
            Ext.create('CGP.product.view.bothwayattributemapping.view.AttributeTreePanel', {
                padding: '10 10 10 10',
                title: i18n.getKey('rightSkuAttribute')+i18n.getKey('value'),
                itemId: 'right',
                height: 260,
                autoScroll: true,
                width: 400,
                skuAttributesGrid: me.rightAttribute,
                valueData:me.mappingData.rightValues,
                mappingData:me.mappingData,
                productId: me.productId
            })
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = [];
        for (var i = 0; i < me.items.items.length; i++) {
            result = result.concat(me.items.items[i].getValue());
        }
        return result;
    },

    setValue: function (data) {

    }

});