Ext.define('CGP.product.edit.component.skuproducts.SkuAttribute', {
    extend: 'Ext.form.Panel',

    required: ['CGP.product.edit.store.SkuProduct'],


    existTypes: [],
    region: 'north',
    skuAttributeIds: [],

    constructor: function (config) {


        var me = this;




        if (!config.configurableProductId) {
            throw new Error('Configurable product id is required!');
        }
        if (!config.skuAttributes) {
            throw new Error('SkuAttribtues is required!');
        }


        me = Ext.apply(me, config);

        config = Ext.apply({
            title: i18n.getKey('skuAttribute')
        }, config);

        me.callParent([config]);

    },

    initComponent: function () {
        var me = this;

        var skuProductStore = Ext.create('CGP.product.edit.store.SkuProduct',{
            configurableProductId: me.configurableProductId
        });
        var existTypes = me.existTypes;
        var attributes = me.attributes;
        me.initSkuAttributes();
        //获得skuProduct
        skuProductStore.load(function (products, operation, success) {
            if (success) {
                var skuAttributeValues = new Ext.util.MixedCollection();
                Ext.Array.each(products, function (product) {
                    //sku attribute的id和使用的optionId

                    var type = {};
                    Ext.Array.each(product.data.attributeValues, function (attributeValue) {
                        var attributeId = attributeValue['attributeId']
                        if (Ext.Array.contains(me.skuAttributeIds, attributeId)) {
                            var attribute = me.attributes.getById(attributeId);
                            var optionIds = attributeValue['optionIds'];

                            type = Ext.merge(type, eval('(' + '{"' + attribute.get('code') + '":"' + optionIds + '"}' + ')'));


                            if (skuAttributeValues.containsKey(attributeId)) {
                                skuAttributeValues.add(attributeId, skuAttributeValues.getByKey(attributeId) + ',' + attributeValue['optionIds']);
                            } else {
                                skuAttributeValues.add(attributeId, attributeValue['optionIds']);
                            }
                        }
                    });
                    existTypes.push(type);

                });
                var tm = new Ext.util.TextMetrics();
                var maxLabelWidth = 0;
                var fields = [];
                skuAttributeValues.eachKey(function (key) {
                    var attributeId = key;
                    var attribute = attributes.getById(key);
                    var optionIds = this.getByKey(key);
                    var field = {};
                    field.xtype = 'displayfield';
                    field.fieldLabel = attribute.get('name');
                    field.labelWidth = tm.getWidth(field.fieldLabel + ':');
                    field.name = key;
                    var value = [];
                    if(optionIds){
                        var optionIdsArray = optionIds.split(',');
                    }
                    Ext.Array.each(attribute.get('options'), function (option) {
                        if (Ext.Array.contains(optionIdsArray, option['id'] + '')) {
                            value.push(option['name']);
                        }
                    })

                    field.value = value.join('<br/>');
                    fields.push(field);
                    if (field.labelWidth > maxLabelWidth) {
                        maxLabelWidth = field.labelWidth;
                    }

                }, skuAttributeValues);

                Ext.Array.each(fields, function (field) {
                    field.labelWidth = maxLabelWidth;
                    field.labelAlign = 'right';
                    me.add(Ext.widget(field));
                });
                me.createSkuProductGrid(products, me.skuAttributeIds, me.skuProductContainer, attributes,existTypes);
            }
        });
        me.callParent(arguments);

    },

    initSkuAttributes: function () {
        var me = this;
        var skuAttributes = me.skuAttributes;
        Ext.Array.each(skuAttributes, function (skuAttribute) {
            me.skuAttributeIds.push(skuAttribute['attributeId']);
        })
    }


})