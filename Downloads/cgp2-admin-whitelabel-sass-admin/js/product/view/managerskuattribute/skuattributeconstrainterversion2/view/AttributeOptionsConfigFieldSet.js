/**
 * Created by nan on 2019/11/6.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.AttributeOptionsConfigFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    alias: 'widget.attributeoptionsconfigfieldset',
    skuAttributeId: null,
    skuAttribute: null,
    initComponent: function () {
        var me = this;
        var options = me.skuAttribute.attribute.options;
        var optionItems = [];
        Ext.Array.each(options, function (option) {
            var optionItem = {
                name: 'optionValues',
                inputValue: option.id,
                boxLabel: option.name,
                columnWidth: .3
            };
            optionItems.push(optionItem);
        })
        me.items = [
            {
                xtype: 'form',
                border: false,
                items: [
                    {
                        fieldLabel: i18n.getKey('description'),
                        xtype: 'textfield',
                        name: 'description',
                        itemId: 'description',
                        allowBlank: false,
                        width: 600
                    },
                    {
                        xtype: 'radiogroup',
                        width: 400,
                        name: 'isInclude',
                        fieldLabel: i18n.getKey('是否包含选择的选项'),
                        items: [
                            {
                                boxLabel: '包含',
                                name: 'isInclude',
                                inputValue: true,
                                checked: true
                            }, {
                                boxLabel: '不包含',
                                name: 'isInclude',
                                inputValue: false,
                            }
                        ]
                    },
                    {
                        xtype: 'checkboxgroup',
                        width: '100%',
                        fieldLabel: i18n.getKey('可用选项'),
                        columns: 3,
                        allowBlank: false,
                        name: 'optionValues',
                        vertical: true,
                        items: optionItems
                    }
                ]
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = me.items.items[0].getValues();
        console.log(result);
        result.clazz = 'com.qpp.cgp.domain.attributeconstraint.single.SingleAttributeDiscreteValueConstraint';
        result.executeCondition = null;
        result.skuAttribute = me.skuAttribute;
        result.skuAttributeId = me.skuAttributeId;
        if (result.optionValues) {
            result.optionValues = result.optionValues.toString()
        }
        return result;
    },
    setValue: function (data) {
        console.log(data);
        if (data) {
            var me = this;
            var fields = me.items.items[0].items.items;
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].xtype == 'checkboxgroup') {
                    var options = data[fields[i].getName()].split(',');
                    options = options.map(function (item) {
                        return parseInt(item)
                    });
                    fields[i].setValue({
                        optionValues: options
                    });
                } else if (fields[i].xtype == 'radiogroup') {
                    fields[i].setValue({
                        isInclude: data[fields[i].getName()]
                    });
                } else {
                    fields[i].setValue(data[fields[i].getName()]);
                }
            }
        }
    }
})
