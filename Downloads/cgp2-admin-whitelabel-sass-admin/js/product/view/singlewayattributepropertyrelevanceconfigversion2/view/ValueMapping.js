/**
 * Created by admin on 2019/10/29.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ValueMapping', {
    extend: 'Ext.window.Window',
    requires: ['CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.OneWaySimpleValueMaping'],
    modal: true,
    resizable: false,
    layout: 'fit',
    defaults: {
        flex: 1
    },
    grid: null,
    data: null,
    title: i18n.getKey('create') + i18n.getKey('fixedSingleMapping'),
    draggable: true,
    initComponent: function () {
        var me = this, valueMapingModel = null, productProfileAttributeStore = null;
        if (me.data) {
            me.title = i18n.getKey('edit') + i18n.getKey('fixedSingleMapping') + '<' + me.data._id + '>';
        }
        var controller = Ext.create("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller");
        if (me.productSkuAtt) {
            me.inputSkuAtt = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
                data: me.productSkuAtt,
                proxy: {
                    type: 'memory'
                }
            });
            me.outputSkuAtt = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
                data: me.productSkuAtt,
                proxy: {
                    type: 'memory'
                }
            });
            productProfileAttributeStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                storeId: 'productProfileAttributeStore',
                model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
                data: me.productSkuAtt,
                proxy: {
                    type: 'memory'
                }
            });
        } else {
            Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                aimUrlId: me.productId,
                listeners: {
                    load: function (store, records) {
                        for (var i = 0; i < records.length; i++) {
                            me.inputSkuAtt.proxy.data.push(records[i].getData());
                            me.outputSkuAtt.proxy.data.push(records[i].getData());
                        }
                        me.inputSkuAtt.reload();
                        me.outputSkuAtt.reload();
                    }
                }
            });
        }
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
                    value: me.data ? [me.data._id] : []
                }])
            }
        });
        var basicMapping = Ext.create('CGP.product.view.bothwayattributemapping.view.BasicMapping', {
            itemId: 'basicMapping',
            title: i18n.getKey('mappingBasicConfig'),
            width: 850,
            margin: '10 0 10 0',
            defaultType: 'displayfield',
            layout: 'fit',
            productId: me.productId,
            mappingLinkExcludes: me.data ? [me.data._id] : [],
            mappingExcludes: me.data ? [me.data._id] : []
        });
        var attributePropertyPath = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributePropertyPath', {
            name: 'attributePropertyPath',
            itemId: 'attributePropertyPath',
            title: i18n.getKey('attributePropertyPath'),
            margin: '10 0 10 0',
            productId: me.productId,
            width: 850
        });
        var inputAttValue = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributePropertyValueTree', {
            itemId: 'valueMappingInput',
            id: 'valueMappingInput',
            name: 'inputs',
            height: 300,
            width: 400,
            allowValueBlank: false,
            valueType: 'FixValue',
            mappingType: 'inputAttribute'
            //skuAttributeStore: me.inputSkuAtt
        });
        var outputAttValue = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributePropertyValueTree', {
            itemId: 'valueMappingOutput',
            id: 'valueMappingOutput',
            name: 'outputs',
            height: 300,
            width: 400,
            allowValueBlank: true,
            valueType: 'FixValue',
            mappingType: 'outputAttribute'
            //skuAttributeStore: me.outputSkuAtt
        });
        var form = Ext.create('Ext.ux.form.ErrorStrickForm', {
            itemId: 'valueMappingForm',
            modal: true,
            resizable: false,
            width: '100%',
            border: false,
            defaults: {
                labelAlign: 'left',
                msgTarget: 'side',
                validateOnChange: false
            },
            bodyStyle: {
                padding: '10px'
            },
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    itemId: 'saveBtn',
                    handler: function (btn) {
                        var pageForm = me.getComponent('valueMappingForm');
                        var inputAtt = inputAttValue.getValue();
                        var outputAtt = outputAttValue.getValue();
                        var errors = null;
                        var inputAttValuePropertys = inputAttValue.query('textfield[itemId],propertyValue');//只校验输入属性必须填
                        errors = {};
                        inputAttValuePropertys.forEach(function (item) {
                            if (item.isValid() == false) {
                                errors[item.getFieldLabel()] = i18n.getKey('Not blank');
                            }
                        });
                        if (pageForm.getForm().isValid() && inputAtt.length > 0 && outputAtt.length > 0 && Ext.Object.isEmpty(errors)) {
                            var data = me.getValue();
                            var attDtoContriller = Ext.create('CGP.product.controller.AttributePropertyDtoTransformController');
                            var domainId = null;
                            if (data['attributeMappingDomain']) {
                                domainId = data['attributeMappingDomain']._id;
                            }
                            data['attributeMappingDomain'] = attDtoContriller.dealOneWayAttributeMapping(data);
                            data['attributeMappingDomain']._id = domainId;
                            controller.saveData(data, me, me.grid);
                        } else {
                            if (Ext.Object.isEmpty(errors)) {
                                errors = {};
                            }
                            var fields = pageForm.getForm().getFields();
                            fields.each(function (fd) {
                                if (!Ext.Object.isEmpty(fd.getErrors())) {
                                    errors[fd.fieldLabel] = fd.getErrors();
                                }
                            });
                            if (inputAtt == 0) {
                                errors[inputAttValue.mappingType] = '不允许为空!'
                            }
                            if (outputAtt == 0) {
                                errors[outputAttValue.mappingType] = '不允许为空!'
                            }
                            Ext.Msg.alert(i18n.getKey('errorMessage'), pageForm.getErrHtml(errors));
                            return false;
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        me.close();
                    }
                }
            ],
            items: [
                {
                    xtype: 'textfield',
                    name: 'description',
                    labelWidth: 100,
                    width: 530,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description',
                    allowBlank: false,
                    margin: '10px'
                },
                basicMapping,
                attributePropertyPath,
                {
                    xtype: 'fieldset',
                    itemId: 'mappingFieldset',
                    title: i18n.getKey('mapping') + i18n.getKey('config'),
                    collapsible: false,
                    columnWidth: 0.5,
                    defaultType: 'textfield',
                    margin: '0 0 0 0',
                    width: 850,
                    style: {
                        borderRadius: '10px'
                    },
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            itemId: 'mappingContainer',
                            layout: {
                                type: 'hbox'
                            },
                            defaults: {
                                height: 260
                            },
                            items: [
                                inputAttValue,
                                {
                                    xtype: 'splitter',
                                    width: '20px'
                                },
                                outputAttValue
                            ]
                        }
                    ]
                }
            ]
        });
        me.items = [
            form
        ];
        me.callParent(arguments);
//        if(me.data){
//            me.refreshData(me.data);
//        }
    },

    getValue: function () {
        var me = this;
        var form = me.getComponent('valueMappingForm');
        if (Ext.isEmpty(me.data)) {
            me.data = {
                "clazz": "com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleValueMapping",
                "description": "",
                "productId": me.productId
            };
        }
        var items = form.items.items;
        Ext.Array.each(items, function (item) {
            if (item.itemId == 'mappingFieldset') {
                var mappingItems = item.getComponent('mappingContainer').items.items;
                Ext.Array.each(mappingItems, function (mappingItem) {
                    if (mappingItem.xtype != 'splitter')
                        me.data[mappingItem.name] = mappingItem.getValue();
                });
            } else if (item.itemId == 'basicMapping') {
                item.setParentData(me.data);
            } else {
                me.data[item.name] = item.getValue();
            }

        });
        return me.data;
    },

    refreshData: function (data) {
        var me = this, mappingForm = this.getComponent('valueMappingForm');
        me.data = data;
        var items = mappingForm.items.items;
        Ext.Array.each(items, function (item) {
            if (item.itemId == 'basicMapping') {
                item.setValue(data);
            } else if (item.itemId == 'mappingFieldset') {
                var inputSelection = Ext.getCmp('valueMappingInput');//item.items.items.getComponent('valueMappingInput');
                var outputSelection = Ext.getCmp('valueMappingOutput');//item.items.items.getComponent('valueMappingOutput');
                var selections = Ext.Array.merge(data['inputs'], data['outputs']);
                Ext.Array.each(selections, function (item) {
                    //item.skuAttribute=me.skuAttributeStore.findRecord('id',item.skuAttributeId).data;
                    item.propertyPath.skuAttribute = Ext.Array.filter(me.productSkuAtt, function (skuItem) {
                        return skuItem.id == item.propertyPath.skuAttributeId;
                    })[0];
                    me.inputSkuAtt.remove(me.inputSkuAtt.findRecord('id', item.propertyPath.skuAttributeId));
                    me.outputSkuAtt.remove(me.outputSkuAtt.findRecord('id', item.propertyPath.skuAttributeId));
                });
                inputSelection.setValue(data['inputs']);
                outputSelection.setValue(data['outputs']);
//                inputSelection._grid.store.proxy.data = (data['inputs']);
//                outputSelection._grid.store.proxy.data = (data['outputs']);
            } else {
                item.setValue(data[item.name]);
            }
        })
    }
})
