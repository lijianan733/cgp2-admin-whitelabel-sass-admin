/**
 * Created by nan on 2019/1/22.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.EditItemTabPanel', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    requires: [],
    outTab: null,
    recordData: null,
    itemsGridStore: null,
    skuAttributes: null,//记录使用到的skuAttribute，一个 new Ext.util.MixedCollection()实例
    autoScroll: true,
    scroll: 'vertical',
//    layout: {
//        type: 'vbox'
//    },
    defaults: {
        padding: '10 10 5 15',
        margin: '10 50 10 50'
    },
    productId:null,
    initComponent: function () {
        var me = this;
        var mask = me.mask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        var productAttributeData = me.skuAttributes;
        var controller = Ext.create('CGP.product.view.bothwayattributemapping.controller.Controller');

        me.inputSkuAtt = Ext.create('CGP.product.view.bothwayattributemapping.store.ProductAttribute', {
            model: 'CGP.product.view.bothwayattributemapping.model.Attribute',
            data: productAttributeData,
            proxy: {
                type: 'memory'
            }
        });
        me.outputSkuAtt = Ext.create('CGP.product.view.bothwayattributemapping.store.ProductAttribute', {
            model: 'CGP.product.view.bothwayattributemapping.model.Attribute',
            data: productAttributeData,
            proxy: {
                type: 'memory'
            }
        });
        var productProfileAttributeStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
            storeId: 'productProfileAttributeStore',
            model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
            data: productAttributeData,
            proxy: {
                type: 'memory'
            }
        });
        var mappingLinkStore = me.mappingLinkStore = Ext.create('CGP.product.view.mappinglink.store.MappingLinkStore', {
            storeId: 'mappingLinkStore',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: me.productId
                }, {
                    name: 'excludeIds',
                    type: 'array',
                    value: me.recordData ? [me.recordData._id] : []
                }])
            }
        });

        var leftAttribute = Ext.create('CGP.product.view.bothwayattributemapping.view.ProductAttribute', {
            id: 'leftAttributes',
            itemId: 'leftAttributes',
            name: 'leftSkuAttributeIds',
            height: 240,
            width: 390,
            mappingType: 'leftAttribute',
            skuAttributeStore: me.inputSkuAtt
        });
        var rightAttribute = Ext.create('CGP.product.view.bothwayattributemapping.view.ProductAttribute', {
            id: 'rightAttributes',
            itemId: 'rightAttributes',
            name: 'rightSkuAttributeIds',
            height: 240,
            width: 390,
            mappingType: 'rightAttribute',
            skuAttributeStore: me.outputSkuAtt
        });
        var runCondition = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.ConditionFieldSet', {
            title: i18n.getKey('映射运行条件'),
            name: 'executeCondition',
            width: 900,
            itemId: 'conditionFieldSet',
            margin: '20 50 20 50',
            productId: me.productId
        });
        var basicMapping = Ext.create('CGP.product.view.bothwayattributemapping.view.BasicMapping', {
            itemId: 'basicMapping',
            title: i18n.getKey('mappingBasicConfig'),
            width: 900,
            defaultType: 'displayfield',
            margin: '30 50 10 50',
            productId: me.productId,
            mappingLinkExcludes: me.recordData ? [me.recordData._id] : [],
            mappingExcludes: me.recordData ? [me.recordData._id] : []
        });


        me.tbar = Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {
                }
            },
            btnCopy: {
                hidden: true
            },
            btnReset: {
                disabled: true
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    var validResult = me.isValid();
                    if (validResult.isValid) {

                        controller.saveItemValue(form);
                    } else {
                        form.showErrors(validResult.error)
                    }
                }
            },
            btnGrid: {
                disabled: true
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        });
        me.items = [
            {
                xtype: 'textfield',
                name: 'description',
                width: 350,
                labelWidth: 120,
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false
            },
            basicMapping,
//            {
//                xtype: 'basicMappingfieldSet',
//                title: i18n.getKey('mappingBasicConfig'),
//                width: 900,
//                defaultType: 'displayfield',
//                layout: 'fit',
//                margin: '30 50 10 50',
//                style: {
//                    borderRadius: '10px'
//                },
//                productId:me.productId,
//                mappingLinkExcludes:me.recordData ? [me.recordData._id] : [],
//                mappingExcludes:me.recordData ? [me.recordData._id] : []
//            },
            runCondition,
            {
                xtype: 'fieldset',
                itemId: 'attributeMapping',
                title: i18n.getKey('attribute') + i18n.getKey('mapping'),
                collapsible: false,
                columnWidth: 0.5,
                width: 900,
                defaultType: 'displayfield',
                layout: 'fit',
                margin: '30 50 10 50',
                style: {
                    borderRadius: '10px'
                },
                items: [
                    {
                        xtype: 'fieldcontainer',
                        id: 'attributeMappingContainer',
                        layout: {
                            type: 'hbox'
                        },
                        defaults: {
                            height: 260
                        },
                        items: [
                            leftAttribute,
                            {
                                xtype: 'splitter',
                                width: '20px'
                            },
                            rightAttribute
                        ]
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'mappingRule',
                title: i18n.getKey('mapping') + i18n.getKey('rule'),
                collapsible: false,
                columnWidth: 0.5,
                width: 900,
                defaults: {
                    anchor: '100%'
                },
                defaultType: 'displayfield',
                layout: 'fit',
                style: {
                    borderRadius: '10px'
                },
                items: [
                    {
                        xtype: 'fieldcontainer',
                        layout: 'fit',
                        items: [
                            Ext.create('CGP.product.view.bothwayattributemapping.view.AttributeValueGrid', {
                                itemId: 'attributeValueMappingGrid',
                                id: 'attributeValueMappingGrid',
                                name: 'mappingGrids',
                                layout: 'fit',
                                style: {
                                    borderRadius: '10px'
                                },
                                leftAttribute: leftAttribute,
                                rightAttribute: rightAttribute,
                                productId: me.productId
                            })
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
        if (me.recordData) {
            me.setValue(me.recordData);
        };
        me.on('afterrender', function () {
            var page = this;
            var productId = me.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });

    },

    setValue: function (record) {
        var me = this;
        //me.recordData=record;
        var items = me.items.items;
        var twoWayMapping = Ext.create('CGP.product.view.bothwayattributemapping.model.TwoWayProductAttributeMapping', record);
        var data = twoWayMapping.getData();
        Ext.Array.each(items, function (item) {
            //item.setValue(null);
            if (item.itemId == 'attributeMapping') {
                var attContainer = Ext.getCmp('attributeMappingContainer');
                Ext.Array.each(attContainer.items.items, function (attGrid) {
                    if (attGrid.xtype == 'skuattrgridfield') {

                        var selectedAttributes = [];
                        Ext.Array.each(me.skuAttributes, function (skuAttribute) {
                            if (Ext.Array.contains(data[attGrid.name], skuAttribute.id)) {
                                selectedAttributes.push(skuAttribute);

                            }
                        });
//                        attGrid.gridConfig.store.proxy.data=selectedAttributes;
                        attGrid.gridConfig.store.loadData(selectedAttributes);
                        //attGrid.setSubmitValue(selectedAttributes);
                    }
                });
            } else if (item.itemId == 'mappingRule') {
                var attributeValueMappingGrid = Ext.getCmp('attributeValueMappingGrid');
                var mappingGrids = [];
                var setValueAttr = function (values) {
                    Ext.Array.each(values, function (value) {
                        value.propertyPath['skuAttribute'] = Ext.Array.findBy(me.skuAttributes, function (skuAttribute) {
                            return skuAttribute.id == value.propertyPath.skuAttributeId;
                        });
//                        value['skuAttribute']=Ext.Array.findBy(me.skuAttributes,function(skuAttribute){
//                            return skuAttribute.id==value.skuAttributeId;
//                        });
                    })
                };
                mappingGrids = data[attributeValueMappingGrid.name].map(function (mapping) {
                    setValueAttr(mapping.leftValues);
                    setValueAttr(mapping.rightValues);
                    return mapping;
                });
                attributeValueMappingGrid.gridConfig.store.loadData(mappingGrids);
                //attributeValueMappingGrid.setSubmitValue(mappingGrids);
            } else if (item.itemId == 'basicMapping') {
                item.setValue(data);
            } else {
                item.setValue(data[item.name]);
            }
        });

    },
    getValue: function () {
        var me = this;
        var data = {};
        if (me.recordData) {
            data = me.recordData
        }
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.itemId == 'attributeMapping') {
                var attContainer = Ext.getCmp('attributeMappingContainer');
                Ext.Array.each(attContainer.items.items, function (attGrid) {
                    if (attGrid.xtype == 'skuattrgridfield') {
                        data[attGrid.itemId] = attGrid.getSubmitValue();
                        data[attGrid.name] = attGrid.getSubmitValue().map(function (el) {
                            return el.id;
                        });
                    }
                });
            } else if (item.itemId == 'mappingRule') {
                var attributeValueMappingGrid = Ext.getCmp('attributeValueMappingGrid');
                data[attributeValueMappingGrid.name] = attributeValueMappingGrid.getSubmitValue();
            } else if (item.itemId == 'basicMapping') {
                item.setParentData(data);
            } else {
                data[item.name] = item.getValue();
            }
        });
        data['productId'] = me.productId;
        data['clazz'] = 'com.qpp.cgp.domain.attributemapping.twoway.TwoWayProductAttributeMapping';
        return data;
    },
    isValid: function () {
        var me = this, result = {isValid: true, error: {}};
        me.msgPanel.hide();
        var fields = me.getForm().getFields();
        fields.each(function (field) {
            //field.
            if (field.itemId == 'attributeValueMappingGrid') {
                var valueMappings = field.getSubmitValue();
                for (var i = 0; i < valueMappings.length; i++) {
                    if (Ext.isEmpty(valueMappings[i].leftValues)) {
                        result.isValid = false;
                        result.error[i18n.getKey('mapping') + i18n.getKey('rule') + (i + 1) + i18n.getKey('leftSkuAttribute') + i18n.getKey('value')] = i18n.getKey('not be null!');
                    }
                    if (Ext.isEmpty(valueMappings[i].rightValues)) {
                        result.isValid = false;
                        result.error[i18n.getKey('mapping') + i18n.getKey('rule') + (i + 1) + i18n.getKey('rightSkuAttribute') + i18n.getKey('value')] = i18n.getKey('not be null!');
                    }
                }
            }
            if (field.isValid() == false) {
                result.isValid = false;
                if (field.getFieldLabel()) {
                    result.error[field.getFieldLabel()] = field.getErrors();
                } else {
                    result.error[i18n.getKey(field.itemId)] = field.getErrors();
                }
            }
        })
        return result;
    }
})
