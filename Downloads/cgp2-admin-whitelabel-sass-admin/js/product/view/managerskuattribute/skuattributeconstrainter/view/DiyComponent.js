/**
 * Created by nan on 2017/12/28.
 */
Ext.syncRequire(['CGP.product.view.managerskuattribute.store.SkuAttribute']);
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainter.view.DiyComponent', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.diycomponent',
    name: 'ValueEx',
    labelAlign: 'top',
    fieldLabel: 'ValueEx',
    defaults: {
        margin: '10 0 10 50',
        allowBlank: false,
        msgTarget: 'side'
    },
    constructor: function (config) {
        var me = this;
        //不同的diyComponent的实例注册不同的校验方法，不能相同，因为Ext.form.VTypes是共用的
        var validMarker=JSGetUUID();
        var validObj={};
        validObj[validMarker]=function(v){
            var isnumber = /^(\-|\+)?\d+(\.\d+)?$/;
            return isnumber.test(v);
        };
        var validText=validMarker+'Text';
        validObj[validText]='输入值必须为数值！';
        Ext.apply(Ext.form.VTypes,validObj);
        var buttonStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            id: JSGetUUID(),
            fields: [
                {name: 'clazz', type: 'string'},
                {name: 'expression', type: 'string'},
                {name: 'expressionEngine', type: 'string'},
                {name: 'inputs', type: 'array'},
                {name: 'resultType', type: 'string'},
                {name: 'promptTemplate', type: 'string'},
                {name: 'min', type: 'object', defaultValue: undefined},
                {name: 'max', type: 'object', defaultValue: undefined},
                {name: 'regexTemplate', type: 'string', defaultValue: undefined}
            ],
            data: [
            ]
        });
        me.items = [
            {
                xtype: 'uxfieldcontainer',
                layout: 'hbox',
                name: 'otherOperation',
                itemId: 'otherOperation',
                items: [
                    {
                        xtype: 'checkboxfield',
                        width: 300,
                        margin: '10 0 10 0',
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
            {
                xtype: 'combo',
                editable: false,
                name: 'clazz',
                itemId: 'clazz',
                fieldLabel: i18n.getKey('type'),
                value: 'com.qpp.cgp.value.ConstantValue',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'clazz', type: 'string'},
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {clazz: 'ConstantValue', value: 'com.qpp.cgp.value.ConstantValue'},
                        {clazz: 'ProductAttrValueEx', value: 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx'},
                        {clazz: 'UserAssignValue', value: 'com.qpp.cgp.value.UserAssignValue'},
                        {clazz: 'JsonPathValue', value: 'com.qpp.cgp.value.JsonPathValue'},
                        {clazz: 'ExpressionValueEx', value: 'com.qpp.cgp.value.ExpressionValueEx'}
                    ]
                }),
                displayField: 'clazz',
                valueField: 'value',
                listeners: {
                    'change': function (view, newValue, oldValue) {
                        var isenabel = view.up().getComponent('otherOperation').getComponent('allowUse').getValue();//是否启用
                        var container = view.ownerCt.items.items;

                        for (var i = 0; i < container.length; i++) {//启用时才能改变值
                            if (Ext.Array.contains(['clazz', 'otherOperation', 'type'], container[i].getName())) {//操作，类型，值类型
                                continue;
                            }
                            container[i].setDisabled(true);
                            container[i].hide();
                        }
                        switch (newValue) {
                            case 'com.qpp.cgp.value.ConstantValue':
                            {
                                var value = view.up().getComponent('value');
                                value.show();
                                value.setDisabled(!isenabel)
                                break;
                            }
                            case 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx':
                            {
                                var attributeID = view.up().getComponent('attributeID');
                                attributeID.show();
                                attributeID.setDisabled(!isenabel)
                                break;
                            }
                            case 'ClassSelector':
                            {
                                break;
                            }
                            case 'com.qpp.cgp.value.UserAssignValue':
                            {
                                /* var assginValue = view.up().getComponent('assginValue');
                                 assginValue.show();
                                 assginValue.setDisabled(!isenabel)*/
                                break;
                            }
                            case 'com.qpp.cgp.value.JsonPathValue':
                            {
                                /*  var calculatedValue = view.up().getComponent('calculatedValue');
                                 calculatedValue.show();
                                 calculatedValue.setDisabled(!isenabel);*/
                                var path = view.up().getComponent('path');
                                path.show();
                                path.setDisabled(!isenabel)
                                break;
                            }
                            case 'com.qpp.cgp.value.ExpressionValueEx':
                            {
                                var expression = view.up().getComponent('expression');
                                expression.show();
                                expression.setDisabled(!isenabel)
                                break;
                            }
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                editable: false,
                name: 'type',
                itemId: 'type',
                value: 'Number',
                defaultValue: 'Number',
                fieldLabel: i18n.getKey('valueType'),
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'type', type: 'string'}
                    ],
                    data: [
                        {type: 'Boolean'},
                        {type: 'String'},
                        {type: 'Array'},
                        {type: 'Date'},
                        {type: 'Number'}
                    ]
                }),
                displayField: 'type',
                valueField: 'type',
                listeners: {
                    'change': function (view, newValue, oldValue) {
                        var value = view.up().getComponent('value');
                        var clazz = view.up().getComponent('clazz').getValue();
                        if (clazz == 'com.qpp.cgp.value.ConstantValue') {
                            switch (newValue) {
                                case 'Number' :
                                {
                                    validObj[validMarker]=function(v){
                                        var isNumber = /^(\-|\+)?\d+(\.\d+)?$/;
                                        return isNumber.test(v);
                                    };
                                    validObj[validText]='输入值必须为数值！';
                                    Ext.apply(Ext.form.VTypes,validObj);
                                    break;
                                }
                                case 'Boolean' :
                                {
                                    validObj[validMarker]=function(v){
                                        return v == 'true' || v == 'false'
                                    };
                                    validObj[validText]='输入值必须为true或false';
                                    Ext.apply(Ext.form.VTypes,validObj);
                                    value.reset();
                                    break;
                                }
                                default :
                                {
                                    validObj[validMarker]=function(v){
                                        return !Ext.isEmpty(v);
                                    };
                                    validObj[validText]='该输入项不予许为空';
                                    Ext.apply(Ext.form.VTypes,validObj);
                                    break;
                                }
                            }
                        }
                        value.validate();
                    }
                }

            },
            {
                xtype: 'textfield',
                name: 'value',
                vtype: validMarker,
                itemId: 'value',
                fieldLabel: i18n.getKey('value')
            },
            {
                xtype: 'combo',
                name: 'attributeId',
                itemId: 'attributeID',
                editable: false,
                store: Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
                    configurableId: config.configurableId
                }),
                displayField: 'attributeName',
                valueField: 'id',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('attribute') + i18n.getKey('id')
            },
            {
                xtype: 'textfield',
                name: 'path',
                itemId: 'path',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('path')
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'expression',
                itemId: 'expression',
                hidden: true,
                disabled: true,
                layout: {xtype: 'hbox'},
                labelAlign: 'left',
                defaults: {
                },
                items: [
                    {
                        xtype: 'button',
                        text: '编辑',
                        storeData: buttonStore,
                        getValue: function () {
                            if (Ext.isEmpty(this.storeData.getAt(0))) {
                                return null;

                            } else {
                                return this.storeData.getAt(0).getData();
                            }
                        },
                        getName: function () {
                            return this.name;
                        },
                        setValue: function (value) {
                            var record = new this.storeData.model(value);
                            this.storeData.removeAll();
                            this.storeData.add(record);
                        },
                        validate: function () {
                            return true;
                        },
                        handler: function (view) {
                            var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                            controller.showExpressValueExValue(view.storeData, view, config.configurableId);
                        }
                    }
                ],
                fieldLabel: i18n.getKey('expression'),
                getValue: function () {
                    return this.items.items[0].getValue();
                },
                setValue: function (value) {
                    this.items.items[0].setValue(value);
                }
            }
        ];
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    getValue: function () {
        var resultSet = {};
        this.items.items.forEach(function (field) {
            var val;
            /*
             if (field.disabled == false) {
             */
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
            }
            else if (field.xtype == 'uxfieldcontainer') {
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
