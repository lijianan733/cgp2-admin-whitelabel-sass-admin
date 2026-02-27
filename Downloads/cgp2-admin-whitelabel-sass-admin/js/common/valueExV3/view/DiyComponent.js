/**
 * Created by nan on 2018/3/14.
 * 范围表达式类型的ValueEx中选择范围的组件
 */
Ext.define('CGP.common.valueExV3.view.DiyComponent', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.diycomponent',
    name: 'ValueEx',
    labelAlign: 'top',
    fieldLabel: 'ValueEx',
    defaults: {
        allowBlank: false,
        msgTarget: 'side'
    },
    getErrors: function () {
        var me = this;
        for (var i in me.Errors) {
            if (i == '') {
                var item = me.Errors[i];
                delete me.Errors[i];
                Ext.Object.merge(me.Errors, item);
            }
        }
        var result = '';
        for (var i in me.Errors) {
            result += i + '' + JSON.stringify(me.Errors[i]);
        }
        return result;
    },
    constructor: function (config) {
        var me = this;
        Ext.apply(Ext.form.VTypes, {
            valid: function (v) {
                var isnumber = /^(\-|\+)?\d+(\.\d+)?$/;
                return isnumber.test(v);
            },
            validText: '输入值必须为数值！'
        });
        me.items = [
            {
                xtype: 'uxfieldcontainer',
                layout: 'hbox',
                name: 'otherOperation',
                itemId: 'otherOperation',
                margin: '10 0 0 50',
                items: [
                    {
                        xtype: 'checkboxfield',
                        width: 300,
                        margin: '10 0 0 0',
                        name: 'allowUse',
                        value: true,
                        checked: false,
                        itemId: 'allowUse',
                        fieldLabel: i18n.getKey('isActive'),
                        listeners: {
                            'change': function (view, newValue, oldValue) {
                                var container = view.ownerCt.ownerCt.items.items;
                                if (newValue == true) {//启用
                                    for (var i = 0; i < container.length; i++) {
                                        if (container[i].getName() == "otherOperation") {
                                            continue;
                                        }
                                        container[i].setDisabled(container[i].hidden);

                                    }
                                } else {
                                    for (var i = 0; i < container.length; i++) {
                                        if (container[i].getName() == "otherOperation") {
                                            continue;
                                        }
                                        container[i].setDisabled(true);
                                    }
                                }
                            },
                            'render': function (view) {
                                view.checked == false;
                                view.fireEvent('change', view, false, true)
                            }
                        }
                    },
                    {
                        xtype: 'checkboxfield',
                        name: 'allowEqual',
                        width: 300,
                        value: true,
                        checked: false,
                        itemId: 'allowEqual',
                        fieldLabel: i18n.getKey('allowEqual')
                    }
                ]
            },
            Ext.create('CGP.common.valueExV3.view.CommonPartField', {
                defaults: {
                    margin: '10 0 0 50'
                }
            })
        ];
        me.callParent(arguments);
    },
    getValue: function () {
        var resultSet = {};
        this.items.items.forEach(function (field) {
            var val;
            if (field.xtype == 'gridcombo') {
                val = field.getArrayValue();
            } else if (field.xtype == 'gridfield') {
                if (field.isDisabled() == true) {
                    val = [];
                } else {
                    val = field.getSubmitValue();
                }
            } else if (field.xtype == 'singlegridcombo') {
                val = field.getSingleValue();
            } else if (field.xtype == 'symbol') {
                val = field.getSubmitValue();
            } else if (field.xtype == 'emailsfield') {
                val = field.getSubmitValue();
            } else if (field.xtype == 'gridfieldselect') {
                val = field.getSubmitValue();
            } else if (field.xtype == "backgroundfacegrid") {
                val = field.getSubmitValue();
            } else if (field.xtype == 'radiogroup') {
                val = field.getValue()[field.getName().substring(modelName.length + 1)];
            } else if (field.xtype == 'uxfieldcontainer') {
                val = field.getValue();
            } else {
                val = field.getValue();
            }
            resultSet[field.getName()] = val;
            /*
             }
             */
        });
        return resultSet;
    },
    /**
     *
     * @param data 为已配置对象，键名为对应的field.name，值为要设置的值
     */
    setValue: function (data) {
        if (!Ext.isEmpty(data)) {
            var fields = this.items.items;
            for (var i = 0; i < this.items.items.length; i++) {
                var field = this.items.items[i];
                if (!field.rendered) {
                    field.on('render', function (item) {
                        if (item.xtype == 'gridfield') {
                            item.setSubmitValue(data[item.getName()]);//通过field的name获取模型中的数据
                        } else if (item.xtype == 'treecombo' && item.useRawValue) {
                            item.setRawValue(data[item.getName()]);
                        } else if (item.xtype == 'gridfieldselect') {
                            item.setSubmitValue(data[item.getName()]);
                        } else if (item.xtype == 'singlegridcombo') {
                            item.setSingleValue(data[item.getName()]);
                        } else if (item.xtype == 'emailsfield') {
                            item.setSubmitValue(data[item.getName()]);
                        } else if (item.xtype == 'radiogroup') {
                            var str = item.getName();
                            var object = JSON.parse('{"' + str + '":' + data[item.getName()] + ' }');
                            item.setValue(object);
                        } else if (item.xtype == 'symbol') {
                            item.setSubmitValue(data[item.getName()]);
                        } else if (item.xtype == "backgroundfacegrid") {
                            item.setSubmitValue(data[item.getName()]);
                        } else if (item.xtype == 'uxfieldcontainer') {
                            item.setValue(data[item.getName()]);
                        } else {
                            item.setValue(data[item.getName()]);
                        }
                    });
                } else {
                    if (field.xtype == 'gridfield') {
                        field.setSubmitValue(data[field.getName()]);//通过field的name获取模型中的数据
                    } else if (field.xtype == 'treecombo' && field.useRawValue) {
                        field.setRawValue(data[field.getName()]);
                    } else if (field.xtype == 'gridfieldselect') {
                        field.setSubmitValue(data[field.getName()]);
                    } else if (field.xtype == 'singlegridcombo') {
                        field.setSingleValue(data[field.getName()]);
                    } else if (field.xtype == 'emailsfield') {
                        field.setSubmitValue(data[field.getName()]);
                    } else if (field.xtype == 'radiogroup') {
                        var str = field.getName();
                        var object = JSON.parse('{"' + str + '":' + data[field.getName()] + ' }');
                        field.setValue(object);
                    } else if (field.xtype == 'symbol') {
                        field.setSubmitValue(data[field.getName()]);
                    } else if (field.xtype == "backgroundfacegrid") {
                        field.setSubmitValue(data[field.getName()]);
                    } else if (field.xtype == 'uxfieldcontainer' || field.xtype == 'diycomponent') {
                        field.setValue(data[field.getName()]);
                    } else {
                        field.setValue(data[field.getName()]);
                    }
                }
            }
        }
    },
    getName: function () {
        return this.name
    }
})
