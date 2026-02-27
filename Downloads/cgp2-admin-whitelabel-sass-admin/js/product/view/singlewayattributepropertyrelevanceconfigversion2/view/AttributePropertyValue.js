/**
 * Created by admin on 2019/10/29.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributePropertyValue', {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.attrgridfield',
    requires: ['CGP.attribute.model.AttributeOption'],
    bodyStyle: {
        padding: '10px'
    },

    initComponent: function () {
        Ext.QuickTips.init();
        var me = this;
        me.gridConfig = {
            autoScroll: true,
            renderTo: me.mappingType,
            height: 290,
            scroll: 'vertical',
            store: Ext.create("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.AttributePropertyValue"),
            selModel: Ext.create('Ext.selection.CheckboxModel', {
                mode: "SIMPLE",
                showHeaderCheckbox: false,
                checkOnly: true
            }),
            multiSelect: true,
            hideHeaders: true,
            viewConfig: {
                overCls: '',
                overItemCls: '',
                stripeRows: true
            },
            columns: [
                {
                    //header: i18n.getKey('value'),
                    xtype: 'componentcolumn',
                    dataIndex: 'propertyPath',
                    width: 400,
                    flex: 1,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (Ext.isEmpty(record.data.value)) {
                            if (me.valueType == 'FixValue') {
                                record.data.value = {
                                    clazz: "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                                    value: ''
                                };
                            } else if (me.valueType == 'Calculation') {
                                record.data.value = {
                                    clazz: "com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue",
                                    calculationExpression: ''
                                };
                            }
                        }
                        var skuAttributeId = record.get('propertyPath').skuAttributeId;
                        var attributeProfile = record.get('propertyPath').attributeProfile._id;
                        var profileStore = Ext.create('CGP.product.store.AttributeProfile', {
                            skuAttributeId: skuAttributeId
                        });
                        var resultField = {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox'
                            },
                            defaults: {
                                labelAlign: 'top',
                                width: 180,
                                margin: '10 5 10 5'
                            },
                            items: [
                                {
                                    xtype: 'combo',
                                    store: profileStore,
                                    valueField: '_id',
                                    displayField: 'name',
                                    autoSelect: true,
                                    editable: false,
                                    haveReset: true,
                                    name: 'attributeProfile',
                                    itemId: 'attributeProfile',
                                    fieldLabel: i18n.getKey('profile'),
                                    listeners: {
                                        change: Ext.Function.createBuffered(function (field, newValue, oldValue) {
                                            record.data.propertyPath.attributeProfile._id = newValue;
                                            record.data.propertyPath.attributeProfile.name = field.getRawValue();
                                        }, 500),
                                        afterrender: function (profileCombo) {
                                            profileCombo.select(profileCombo.store.getAt(0));//自动选择第一项
                                            if (attributeProfile) {
                                                profileCombo.setValue(attributeProfile);
                                            }
                                        }
                                    }
                                },
                                me.createFieldByAttribute(record)

                            ]
                        }
                        return resultField;
                    }
                }
            ],
            tbar: [
                {
                    xtype: 'displayfield',
                    value: i18n.getKey(me.mappingType)
                },
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var selectedSkuAttr = [];
                        var items = me.ownerCt.items.items;
                        Ext.Array.each(items, function (item) {
                            if (item.xtype == 'gridcombo') {
                                selectedSkuAttr = item.getSubmitValue();
                            } else if (item.xtype == 'attrgridfield' && item.itemId != me.itemId) {
                                selectedSkuAttr = Ext.Array.map(item.getSubmitValue(), function (item) {
                                    return item.skuAttributeId;
                                });
                            }
                        });

                        Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributeSelectWindow', {
                            selectedGrid: me,
                            selectAttribute: me.skuAttributeStore,
                            selectedSkuAttr: selectedSkuAttr
                        }).show();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_bullet_delete',
                    handler: function (btn) {
                        var selecteds = me.gridConfig.selModel.getSelection();
                        if (!Ext.isEmpty(selecteds)) {
                            var store = me.getStore();
                            Ext.each(selecteds, function (record) {
                                //添加gridfield record
                                me.skuAttributeStore.add(record.get('propertyPath').skuAttribute);
                                store.remove(record);
                            }, this);
                        }
                    }
                }
            ]
        };
        me.callParent();
    },
    createFieldByAttribute: function (record, defaultMulti, value) {
        var me = this;
        var data = {};
        if (record && record.get('propertyPath') && record.get('propertyPath').skuAttribute) {
            data = record.get('propertyPath').skuAttribute.attribute;
        }
        if (Ext.isEmpty(data) || !data['inputType']) {
            throw Error('data should be a CGP.Model.Attribute instance!');
        }
        if (record.get('value')) {
            var valueObj = record.get('value');
            value = valueObj.value ? valueObj.value : valueObj.calculationExpression;
        }
        var inputType = data['inputType'];
        var selectType = data['selectType'];
        var options = data['options'];
        var item = {};
        item.name = 'value';
        item.fieldLabel = data.name;
        item.flex = 1;
        item.allowBlank = false;
        item.value = value;
        item.itemId = 'propertyValue';
        item.cls = 'propertyValue';
        item.listeners = {
            change: Ext.Function.createBuffered(function (field, newValue, oldValue, eOpts) {
                if (Ext.isArray(newValue)) {
                    newValue = newValue.join(',');
                }
                if (field.xtype == 'datetimefield' && !Ext.isEmpty(newValue)) {
                    var dateValue = new Date(newValue);
                    newValue = dateValue.getTime();
                }
                if (me.valueType == 'FixValue') {
                    record.data.value = {
                        clazz: "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                        value: newValue
                    };
                } else if (me.valueType == 'Calculation') {
                    record.data.value = {
                        clazz: "com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue",
                        calculationExpression: newValue
                    };
                }
            }, 500)
        };
        if (me.valueType == 'Calculation') {
            item.xtype = 'textfield';
            item.emptyText = 'profiles["profileId"]["skuAttributeId"]["Value"] + n \n (表达式实例：profiles["1782038"]["1851504"]["Value"]-0.5 )';
            item.tipInfo = 'profiles["profileId"]["skuAttributeId"]["Value"] + n';

            return item;
        }
        if (options.length > 0) {//选项类型
            item.xtype = 'combo';
            item.multiSelect = defaultMulti ? defaultMulti : (selectType == 'MULTI' ? true : false);
            if (item.multiSelect) {
                value = value ? value.split(',') : [];
                item.listConfig = {
                    itemTpl: Ext.create('Ext.XTemplate', '<input type=checkbox>{[values.name]}'),
                    onItemSelect: function (record) {
                        var node = this.getNode(record);
                        if (node) {
                            Ext.fly(node).addCls(this.selectedItemCls);
                            var checkboxs = node.getElementsByTagName("input");
                            if (checkboxs != null)
                                var checkbox = checkboxs[0];
                            checkbox.checked = true;
                        }
                    },
                    listeners: {
                        itemclick: function (view, record, item, index, e, eOpts) {
                            var isSelected = view.isSelected(item);
                            var checkboxs = item.getElementsByTagName("input");
                            if (checkboxs != null) {
                                var checkbox = checkboxs[0];
                                if (!isSelected) {
                                    checkbox.checked = true;
                                } else {
                                    checkbox.checked = false;
                                }
                            }
                        }
                    }
                };
            }
            item.displayField = 'name';
            item.valueField = 'id';//不需要id
            item.editable = false;
            item.store = new Ext.data.Store({
                fields: ['id', 'name'],
                data: options
            });
            if (value) {
                if (Ext.isArray(value)) {
                    item.value = value.map(function (item) {
                        return Ext.Number.from(item);
                    });
                } else if (Ext.isNumber(value)) {
                    item.value = value;
                } else if (Ext.isString(value)) {
                    item.value = Ext.Number.from(value);
                }
            }
        } else if (inputType == 'Date') {//输入类型
            item.xtype = 'datetimefield';
            item.editable = false;
            item.format = "Y-m-d H:i:s";
            var newDate = new Date();
            newDate.setTime(value);
            item.value = Ext.Date.format(newDate, item.format);
        } else if (inputType == 'YesOrNo') {
            item.xtype = 'radiogroup';
            var yesItem = {
                name: item.name,
                inputValue: 'YES',
                boxLabel: 'YES'
            }
            var noItem = {
                name: item.name,
                inputValue: 'NO',
                boxLabel: 'NO'
            }
            if (value) {
                if (value == 'YES') {
                    yesItem.checked = true;
                } else if (value == 'NO') {
                    noItem.checked = true;
                }
            }
            item.items = [yesItem, noItem];
            item.columns = 2;
        } else if (me.valueType != 'Calculation' && data.valueType == 'Number') {
            item.xtype = 'numberfield';
        } else {
            item.xtype = 'textfield';
        }
        return item;
    }
})
