/**
 * Created by nan on 2019/10/22.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.ConditionFieldContainer', {
    extend: 'Ext.form.FieldContainer',
    selectedRecord: null,//选择的属性记录
    conditionFieldPanel: null,//条件组件外围容器
    skuAttribute: null,//该组件对应的属性
    clazz: 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation',//模式为BetweenOperation，和CompareOperation,两种，
    layout: {
        type: 'hbox',
        align: 'middle'
    },
    value: null,
    operator: null,
    deleteSrc: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
    controller: Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.controller.Controller'),
    initComponent: function () {
        var me = this;
        var selected = me.selectedRecord;
        me.skuAttribute = selected.getData();
        var field = me.controller.createFieldByAttribute(selected.get('attribute'), me.value, me.operator);
        var deleteField = {
            xtype: 'displayfield',
            width: 16,
            padding: '0 10 0 10 ',
            height: 16,
            itemId: 'delete',
            value: '<img class="tag" title="点击进行清除数据" style="height: 100%;width: 100%;cursor: pointer" src="' + me.deleteSrc + '">',
            listeners: {
                render: function (display) {
                    var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                    ela.on("click", function () {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清除已填写的数据'), function (selector) {
                            if (selector === 'yes') {
                                var container = display.ownerCt;
                                var panel = container.ownerCt;
                                panel.remove(container);
                            }
                        })
                    });
                }
            }
        };
        me.items = [deleteField, field];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var valueField = me.getComponent('valueField');
        var result = {};
        console.log(me.skuAttribute.attribute.id)
        if (valueField.xtype != 'fieldcontainer') {//说明都是选项类型，或者checkbox,date
            var valueData = null;
            if (valueField.xtype == 'datetimefield') {
                valueData = valueField.getValue().getTime().toString();
            } else {
                valueData = valueField.getValue().toString();
            }
            result.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
            result.operations = [
                {
                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue',
                    skuAttributeId: me.skuAttribute.id,
                    skuAttribute: me.skuAttribute
                },
                {
                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                    value: valueData
                }
            ];
            result.operator = '=='
        } else if (valueField.getComponent('complexInput').disabled == true) {//说明是输入类型，且没有指定是开闭区间类型
            result.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
            result.operations = [
                {
                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue',
                    skuAttributeId: me.skuAttribute.id,
                    skuAttribute: me.skuAttribute
                },
                {
                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                    value: valueField.getComponent('simpleInput').getValue().toString()
                }
            ];
            result.operator = valueField.getComponent('operator').getValue();
        } else {
            result.clazz = 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation';
            result.operations = [
                {
                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                    value: valueField.getComponent('complexInput').getComponent('min').getValue()
                },
                {
                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                    value: valueField.getComponent('complexInput').getComponent('max').getValue()
                }
            ];
            result.midValue = {
                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue',
                skuAttributeId: me.skuAttribute.id,
                skuAttribute: me.skuAttribute
            };
            result.operator = valueField.getComponent('operator').getValue();
        }
        return result;
    },
    isValid: function () {
        var me = this;
    }
})
