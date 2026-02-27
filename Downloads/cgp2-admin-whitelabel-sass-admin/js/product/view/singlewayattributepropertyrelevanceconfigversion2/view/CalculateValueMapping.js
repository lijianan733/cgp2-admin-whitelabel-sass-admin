/**
 * Created by admin on 2019/10/29.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.CalculateValueMapping', {
    extend: 'Ext.window.Window',
    requires: ['CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.OneWaySimpleCalculateValueMaping'],
    modal: true,
    resizable: false,
    layout: 'fit',
    grid: null,
    data: null,
    title: i18n.getKey('create') + i18n.getKey('calculateSingleMapping'),
    initComponent: function () {
        var me = this, oldRecords = [];
        if (me.data) {
            me.title = i18n.getKey('edit') + i18n.getKey('calculateSingleMapping') + '<' + me.data._id + '>';
        }
        var controller = Ext.create("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller");
        if (me.productSkuAtt) {
//            //筛选出输入型number类型属性
//            me.productSkuAtt = Ext.Array.filter(me.productSkuAtt, function (item) {
//                return item.attribute.selectType == 'NON'&&item.attribute.valueType == 'Number';
//            });
            me.inputSkuAtt = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
                data: me.productSkuAtt || [],
                proxy: {
                    type: 'memory'
                }
            });

            me.outputSkuAtt = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
                data: me.productSkuAtt || [],
                proxy: {
                    type: 'memory'
                }
            });
            var productProfileAttributeStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                storeId: 'productProfileAttributeStore',
                model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
                data: me.productSkuAtt,
                proxy: {
                    type: 'memory'
                }
            });
        } else {
            me.productSkuAtt = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
                aimUrlId: me.productId,
                listeners: {
                    load: function (store, records) {
                        store.filterBy(function (item) {
                            return item.get('attribute').selectType == 'NON' && item.get('attribute').valueType == 'Number';
                        });
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
        var attPropertyValue = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributePropertyValueTree', {
            fieldLabel: i18n.getKey('outputAttribute'),
            itemId: 'calculateOutput',
            name: 'outputs',
            height: 300,
            labelWidth: 100,
            width: 850,
            valueType: 'Calculation',
            mappingType: 'outputAttribute'
            //skuAttributeStore: me.outputSkuAtt
        });
        var form = Ext.create('Ext.ux.form.ErrorStrickForm', {
            itemId: 'calculateForm',
            modal: true,
            resizable: false,
            border: false,
            defaults: {
                labelAlign: 'left',
                width: 850,
                labelWidth: 100,
                msgTarget: 'side',
                validateOnChange: false
            },
            bodyStyle: {
                padding: '10px',
                paddingTop: '20px'
            },
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('expression') + i18n.getKey('test'),
                    iconCls: 'icon_verify',
                    handler: function (btn) {
                        var pageForm = me.getComponent('calculateForm');
                        var outputAtt = attPropertyValue.getValue();
                        var errors = me.validateOutput(outputAtt);
                        if (JSON.stringify(errors) != '{}') {
                            Ext.Msg.alert(i18n.getKey('errorMessage'), pageForm.getErrHtml(errors));
                            return false;
                        } else {
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('expression') + i18n.getKey('test') + i18n.getKey('success'));
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    itemId: 'saveBtn',
                    handler: function (btn) {
                        var pageForm = me.getComponent('calculateForm');
                        var outputAtt = attPropertyValue.getValue();
                        var errors = {};
                        errors = me.validateOutput(outputAtt);
                        if (me.isValid()) {
                            me.getValue();
                            var attDtoContriller = Ext.create('CGP.product.controller.AttributePropertyDtoTransformController');
                            var domainId = null;
                            if (me.data['attributeMappingDomain']) {
                                domainId = me.data['attributeMappingDomain']._id;
                            }
                            me.data['attributeMappingDomain'] = attDtoContriller.dealOneWayAttributeMapping(me.data);
                            me.data['attributeMappingDomain']._id = domainId;
                            controller.saveData(me.data, me, me.grid);
                        } else {
                            if (Ext.isEmpty(errors)) {
                                errors = {};
                            }
                            var fields = pageForm.getForm().getFields();
                            fields.each(function (fd) {
                                if (!Ext.isEmpty(fd.getErrors())) {
                                    errors[fd.fieldLabel || fd.title] = fd.getErrors();
                                }
                            });
                            if (outputAtt == 0) {
                                errors[attPropertyValue.fieldLabel] = '不允许为空!'
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
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description',
                    allowBlank: false,
                    width: 530,
                    margin: '10px'
                },
                basicMapping,
                attributePropertyPath,
                {
                    xtype: 'multicombobox',
                    id: 'inSkuAttributeIds',
                    name: 'inSkuAttributeIds',
                    fieldLabel: i18n.getKey('input') + i18n.getKey('attribute'),
                    itemId: 'inSkuAttributeIds',
                    store: me.inputSkuAtt,
                    displayField: 'comboDisplay',
                    valueField: 'id',
                    multiSelect: true,
                    editable: false,
                    haveReset: true,
                    width: 530,
                    margin: '10px',
                    onTriggerClick: function () {
                        var me = this;
                        var inSkuAttrContainer = me.ownerCt;
                        var hasUseSkuAttrs = [];
                        var outSkuAttrs = inSkuAttrContainer.getComponent('calculateOutput').getValue();
                        outSkuAttrs = Ext.Array.map(outSkuAttrs, function (item) {
                            return item.propertyPath.skuAttributeId;
                        });
                        hasUseSkuAttrs.push(outSkuAttrs);
                        me.store.filterBy(function (item) {
                            return !Ext.Array.contains(hasUseSkuAttrs, item.get('value'));
                        });
                        if (!me.readOnly && !me.disabled) {
                            if (me.isExpanded) {
                                me.collapse();
                            } else {
                                me.expand();
                            }
                            me.inputEl.focus();
                        }
                    }
                },
                attPropertyValue
            ]
        });


        me.items = [form];
        me.callParent(arguments);
//        if(me.data){
//            me.refreshData(me.data);
//        }
    },
    getValue: function () {
        var me = this, pageForm = this.getComponent('calculateForm');
        var items = pageForm.items.items;
        if (Ext.isEmpty(me.data)) {
            me.data = {
                "clazz": "com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueMapping",
                "description": "",
                "productId": me.productId,
                "inSkuAttributeIds": [],
                "outputs": []
            };
        }
        Ext.Array.each(items, function (item) {
            if (item.itemId == 'basicMapping') {
                item.setParentData(me.data);
            } else if (item.xtype == 'gridcombo') {
                me.data[item.name] = item.getSubmitValue();
                me.data['inSkuAttributes'] = item.selectedObjects;
            } else {
                me.data[item.name] = item.getValue();
            }

        });

        return me.data;
    },
    refreshData: function (data) {
        var me = this, mappingForm = this.getComponent('calculateForm');
        me.data = data;
        var items = mappingForm.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridcombo') {
                item.setSubmitValue(data[item.name].join(','));
                var inputSelection = [];
                Ext.Array.each(data[item.name], function (item) {
                    var selectedSkuAtt = me.outputSkuAtt.findRecord('id', item);
                    if (!Ext.isEmpty(selectedSkuAtt)) {
                        inputSelection.push(selectedSkuAtt.data);
                    }
                });
                item.selectedObjects = inputSelection;//data['inSkuAttributes'];
            } else if (item.itemId == 'basicMapping') {
                item.setValue(data);
            } else if (item.xtype == 'attributeProfileTree') {
                Ext.Array.each(data[item.name], function (item) {
                    var selectedSkuAtt = me.inputSkuAtt.findRecord('id', item.propertyPath.skuAttributeId);
                    item.propertyPath.skuAttribute = selectedSkuAtt.data;
                    me.outputSkuAtt.remove(selectedSkuAtt);
                });
                item.setValue(data[item.name]);
            } else {
                item.setValue(data[item.name]);
            }
        })
    },
    isValid: function () {
        var me = this, pageForm = this.getComponent('calculateForm');
        var items = pageForm.items.items;
        var isValid = true;
        items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    validateOutput: function (outputs) {
        var errors = {};
        //现在不对被影响属性的值是否为空做校验
        /*  Ext.Array.each(outputs, function (propertyValue) {
              var fieldName = propertyValue.propertyPath.skuAttribute.attribute.name;
              var elValue = propertyValue.value.calculationExpression;
              if (Ext.isEmpty(elValue)) {
                  errors[fieldName] = i18n.getKey('Not blank');
              } else {
                  //var reg=/[A-Za-z]+_\d+/g;
                  var reg = '/[\+\-\*\/]/g';
                  try {
                      var values = elValue.split(reg);
                      Ext.Array.each(values, function (item) {
                          if (Ext.isEmpty(Ext.Number.from(item))) {
                              elValue = elValue.replace(item, '10');
                          }
                      });
                      eval(elValue);
                  } catch (error) {
                      errors[fieldName] = i18n.getKey('expression') + i18n.getKey('misformatted');
                  }
              }
          });*/
        return errors;
    }
})
