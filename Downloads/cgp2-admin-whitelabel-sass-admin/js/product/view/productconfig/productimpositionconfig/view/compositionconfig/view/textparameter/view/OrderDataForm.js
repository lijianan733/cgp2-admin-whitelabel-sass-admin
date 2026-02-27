Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.OrderDataForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    layout: {
        type: 'table',
        columns: 1
    },
    itemId: 'information',
    bodyStyle: 'padding:10px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false,
        plugins: [
            {
                ptype: 'uxvalidation'
            }
        ]
    },
    attributeComps: {
        TextField: {
            xtype:'numberfield',
            //itemId: 'number',
            name: 'input',
            minValue: 0,
            allowBlank: false,
            hideTrigger: true
        },
        DropList: {
            xtype:'combo',
            displayField: 'name',
            valueField: 'id',
            editable: false,
            name: 'options',
            allowBlank: false,
            //itemId: 'options',
            haveReset: true,
            multiSelect: false,
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'string'
                },
                    'name'],
                data: []
            })
        },
        CheckBox: {
            xtype:'combo',
            displayField: 'name',
            valueField: 'id',
            editable: false,
            name: 'options',
            allowBlank: false,
            //itemId: 'options',
            haveReset: true,
            multiSelect: true,
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'string'
                },
                    'name'],
                data: []
            })
        }
    },
    initComponent: function () {
        var me = this;

        me.attributeStore = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
            storeId: 'skuAttribute',
            productId: JSGetQueryString('productId')
        });
        me.items = [
            {
                xtype: 'displayfield',
                //fieldLabel: i18n.getKey('orderData'),
                value: i18n.getKey('attribute')
            },
            {
                xtype: 'fieldcontainer',
                itemId: 'attributeContainer',
                layout: {
                    type: 'table',
                    columns: 2
                },
                fieldDefaults: {
                    labelAlign: 'right',
                    width: 380,
                    labelWidth: 120,
                    msgTarget: 'side'
                },
                items: []
            },
            {
                xtype: 'displayfield',
                //fieldLabel: i18n.getKey('orderData'),
                value: i18n.getKey('orderData')
            },
            {
                xtype: 'fieldcontainer',
                itemId:'orderData',
                layout: {
                    type: 'table',
                    columns: 2
                },
                fieldDefaults: {
                    labelAlign: 'right',
                    width: 380,
                    labelWidth: 120,
                    msgTarget: 'side'
                },
                items: [
                    {
                        name: 'orderNumber',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('orderNumber'),
                        itemId: 'orderNumber',
                        allowBlank: false,
                        value: 'TM2101180035'
                    },
                    {
                        name: 'datePurchased',
                        xtype: 'datefield',
                        fieldLabel: i18n.getKey('datePurchased'),
                        itemId: 'datePurchased',
                        allowBlank: false,
                        value: new Date()
                    }
                ]
            }
        ];
        me.callParent(arguments);

    },
    listeners: {
        afterrender: function (comp) {
            comp.attributeStore =Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
                storeId: 'skuAttribute',
                configurableId: JSGetQueryString('productId'),
                listeners:{
                    load:function (store,reds){
                        store.each(function (item) {
                            var attribute = item.get('attribute');
                            var attrConfig = comp.attributeComps[attribute.inputType], attrComp = null;
                            attrConfig.fieldLabel = attribute.name;
                            attrConfig.attribute = attribute;
                            if (attribute.inputType == 'TextField') {
                                if (attribute.valueType == 'String')
                                    attrConfig.xtype='textfield'
                            } else {
                                attrConfig.store = Ext.create('Ext.data.Store', {
                                    fields: [{
                                        name: 'id',
                                        type: 'string'
                                    },
                                        'name'],
                                    data: attribute.options
                                });

                            }
                            comp.getComponent('attributeContainer').add(attrConfig);
                        });
                    }
                }
            });
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.xtype=='fieldcontainer') {
                item.items.items.forEach(function (el) {
                    if (!el.isValid()) {
                        return false;
                    }
                });
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this,productAttributeValueMap={};
        var items = me.items.items;
        var data = {
                "id" : 15712068,
                "orderNumber" : "TM2101060004",
                "datePurchased" : 1609913145992,
                "isTest" : true,
                "customerId" : 856766,
                "customerName" : "",
                "customerEmail" : "ba_test@qpp.com",
                "deliveryName" : "smart lee",
                "deliveryCountry" : "China",
                "deliveryState" : "gd",
                "deliveryCity" : "sz",
                "deliverySuburb" : "sn",
                "deliveryStreetAddress1" : "test",
                "deliveryPostcode" : "111111",
                "deliveryTelephone" : "26072207",
                "deliveryMobile" : "18888888888",
                "deliveryEmail" : "smartLee@qpp.com",
                "shippingMethod" : "中通",
                "currencyCode" : "HKD",
                "currencyValue" : 1.0,
                "totalQty" : 1,
                "tax" : 0.0,
                "subtotalExTax" : 6.0,
                "subtotalIncTax" : 6.0,
                "totalExTax" : 6.0,
                "totalIncTax" : 6.0,
                "lineItems" : [
                    {
                        "id" : 15712066,
                        "seqNo" : 1,
                        "productInstanceId" : "15712044",
                        "productModel" : "BGM3.75x3.25Hex",
                        "productName" : "Hexagon Game Tiles Medium Size",
                        "productSku" : "BGM3.75x3.25Hex-32",
                        "price" : 6,
                        "amount" : 6.0,
                        "qty" : 1,
                        "product" : {
                            "id" : 15711925,
                            "medias" : [],
                            "multilingualKey" : "com.qpp.cgp.domain.dto.order.ProductOrderDTO"
                        },
                        "qtyRefunded" : 0,
                        "amountRefunded" : 0,
                        "productAttributeValues" : [
                            {
                                "_id" : "15712061",
                                "idReference" : "OrderLineItemProductAttributeValue",
                                "clazz" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue",
                                "attributeId" : 8127646,
                                "attributeInputType" : "DropList",
                                "attributeName" : "StandardTilesMaterial",
                                "attributeValue" : "2.5mm thick",
                                "attributeOptionIds" : "8127648",
                                "multilingualKey" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue"
                            },
                            {
                                "_id" : "15712062",
                                "idReference" : "OrderLineItemProductAttributeValue",
                                "clazz" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue",
                                "attributeId" : 8128250,
                                "attributeInputType" : "DropList",
                                "attributeName" : "StandardTilesFinish",
                                "attributeValue" : "Matte laminated(smooth finish)",
                                "attributeOptionIds" : "8128254",
                                "multilingualKey" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue"
                            }
                        ],
                        "comment" : "test",
                        "productInstance" : {
                            "_id" : "15712044",
                            "clazz" : "com.qpp.cgp.domain.bom.runtime.ProductInstance",
                            "productId" : 15711925,
                            "name" : "instance-test",
                            "propertyModelId" : "15711899",
                            "productAttributeValueMap" : {
                                "9120814" : {
                                    "attributeId" : 9120814,
                                    "attributeInputType" : "DropList",
                                    "attributeName" : "Front",
                                    "attributeValue" : "Same Image",
                                    "attributeOptionIds" : "9120815"
                                },
                                "14669412" : {
                                    "attributeId" : 14669412,
                                    "attributeInputType" : "TextField",
                                    "attributeName" : "Hexagon 3.25x 3.75maxQty",
                                    "attributeValue" : "13"
                                },
                                "8128250" : {
                                    "attributeId" : 8128250,
                                    "attributeInputType" : "DropList",
                                    "attributeName" : "StandardTilesFinish",
                                    "attributeValue" : "Matte laminated(smooth finish)",
                                    "attributeOptionIds" : "8128254"
                                },
                                "9120919" : {
                                    "attributeId" : 9120919,
                                    "attributeInputType" : "DropList",
                                    "attributeName" : "Back",
                                    "attributeValue" : "Same Image",
                                    "attributeOptionIds" : "9120920"
                                },
                                "8127646" : {
                                    "attributeId" : 8127646,
                                    "attributeInputType" : "DropList",
                                    "attributeName" : "StandardTilesMaterial",
                                    "attributeValue" : "2.5mm thick",
                                    "attributeOptionIds" : "8127648"
                                },
                                "9320997" : {
                                    "attributeId" : 9320997,
                                    "attributeInputType" : "TextField",
                                    "attributeName" : "Hexagon 3.25 x 3.75 QTY",
                                    "attributeValue" : "13"
                                }
                            }
                        },
                        "materialId" : "9344270",
                        "attributeValueMap" : {
                            "8128250" : {
                                "_id" : "15712062",
                                "idReference" : "OrderLineItemProductAttributeValue",
                                "clazz" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue",
                                "attributeId" : 8128250,
                                "attributeInputType" : "DropList",
                                "attributeName" : "StandardTilesFinish",
                                "attributeValue" : "Matte laminated(smooth finish)",
                                "attributeOptionIds" : "8128254",
                                "multilingualKey" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue"
                            },
                            "8127646" : {
                                "_id" : "15712061",
                                "idReference" : "OrderLineItemProductAttributeValue",
                                "clazz" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue",
                                "attributeId" : 8127646,
                                "attributeInputType" : "DropList",
                                "attributeName" : "StandardTilesMaterial",
                                "attributeValue" : "2.5mm thick",
                                "attributeOptionIds" : "8127648",
                                "multilingualKey" : "com.qpp.cgp.domain.order.OrderLineItemProductAttributeValue"
                            }
                        }
                    }
                ],
                "shippingModuleCode" : "ZT",
                "shippingRefunded" : 0,
                "totalRefunded" : 0,
                "confirmedDate" : 1609913175817
            };
        Ext.Array.each(items, function (item) {
            if (item.itemId=='attributeContainer') {
                item.items.items.forEach(function (el) {
                    productAttributeValueMap[el.attribute.id]={
                        "attributeId" : el.attribute.id,
                        "attributeInputType" : el.attribute.inputType,
                        "attributeName" : el.attribute.name,
                        "attributeValue" : el.getRawValue(),
                        "attributeOptionIds" : parseInt((el.getValue()??0))
                    }
                })
                data.lineItems[0].productInstance.productAttributeValueMap=productAttributeValueMap;
            }
            else if(item.itemId=='orderData'){
                item.items.items.forEach(function (el) {
                    if(el.name=='datePurchased'){
                        data[el.name]=Date.parse(el.getValue());
                    }
                    else
                    data[el.name]=el.getValue();
                })
            }
        });

        return data;
    }
});