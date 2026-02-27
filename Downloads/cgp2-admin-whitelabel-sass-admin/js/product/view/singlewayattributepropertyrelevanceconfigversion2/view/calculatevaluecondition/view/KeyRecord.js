/**
 * Created by admin on 2020/8/22.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeyRecord', {
    extend: 'Ext.form.FieldContainer',
    layout: 'column',
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Name',
                allowBlank: false
            },
            {
                xtype: 'combo',
                name: 'valueType',
                fieldLabel: i18n.getKey('valueType'),
                editable: false,
                allowBlank: false,
                displayField: 'display',
                valueField: 'value',
                store: Ext.create('Ext.data.Store', {
                    fields: ['display', 'value'],
                    data: [
                        {"display": "Map", "value": "Map"},
                        {"display": "Boolean", "value": "Boolean"},
                        {"display": "String", "value": "String"},
                        {"display": "Array", "value": "Array"},
                        {"display": "Date", "value": "Date"},
                        {"display": "Number", "value": "Number"}
                    ]
                })
            },
            {
                xtype: 'displayfield',
                padding: '0 10 0 10 ',
                deleteTag: 'delete',
                //disabled: false,
                value: '<img class="tag" title="点击进行清除数据" style="height:16px;width: 16px;cursor: pointer" src="' + path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png' + '">',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        ela.on("click", function () {
                            if (display.disabled == true) {
                                return;
                            }
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
            }
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.data)) {
                comp.setValue(comp.data);
            }
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },

    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.deleteTag != 'delete') {
                item.setValue(data[item.name])
            }
        })
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.deleteTag != 'delete') {
                data[item.name] = item.getValue();
            }
        });
        return data;
    }
})