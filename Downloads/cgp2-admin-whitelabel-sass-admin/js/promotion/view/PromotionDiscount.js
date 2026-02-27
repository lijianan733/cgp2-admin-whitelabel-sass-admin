/**
 * @Description:
 * @author nan
 * @date 2023/7/12
 */
Ext.Loader.syncRequire(['CGP.promotion.view.ProductGridWindow', 'CGP.common.condition.view.ExpressionTextarea']);
Ext.define('CGP.promotion.view.PromotionDiscount', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.promotion_discount',
    items: [],
    width: '100%',
    layout: 'column',
    isFormField: true,
    allowBlank: false,
    defaults: {
        margin: '10 25 10 0',
    },
    isDirty: function () {
        return this.dirty;
    },
    clearInvalid: function () {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.clearInvalid && item.clearInvalid();
        }
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this,
            items = me.items.items,
            isValid = true,
            data = me.diyGetValue(), orderArray = [];

        if (items.length === 0) {
            me.errors = '必须有至少一条优惠策略';
            return false;
        } else {
            if (me.disabled === false && me.allowBlank === false) {
                for (var i = 0; i < me.items.items.length; i++) {
                    var item = me.items.items[i];
                    if (item.disabled) {
                    } else {
                        if (item.isValid()) {
                        } else {
                            isValid = false;
                            me.errors = '校验数据不通过';
                        }
                    }
                }
            }

            // 判断订单价格优惠不重复
            data.forEach(item => {
                const {clazz} = item;
                clazz === 'com.qpp.cgp.domain.promotion.discount.OrderDiscount' && orderArray.push(item?.exemption)
            })

            // 判断数组中是否有相等项
            function hasDuplicates(array) {
                return array.some((item, index) => array.indexOf(item) !== index);
            }

            if (hasDuplicates(orderArray)) {
                me.errors = '订单价格优惠中的减免项不允许重复';
                isValid = false;
            }

            return isValid;
        }
    },
    getErrors: function () {
        var me = this;
        return {
            '优惠策略': me.errors
        };
    },
    diyGetValue: function () {
        var me = this, data = [];

        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            data.push(item.getValue());
        }
        return data;
    },
    diySetValue: function (data) {
        var me = this;
        me.removeAll();
        if (data) {
            data.map(function (item) {
                var {clazz, exemption} = item,
                    signal = 'product',
                    isOrder = (clazz === 'com.qpp.cgp.domain.promotion.discount.OrderDiscount');

                if (isOrder) {
                    if (exemption === 'Subtotal') {
                        signal = 'subtotal';
                    } else {
                        signal = 'shippingFeeOrTax';
                    }
                }


                me.addItem(item, signal);
            })
        }
    },
    addItem: function (data, signal) {
        var me = this,
            itemGather = {
                subtotal: {
                    xtype: 'uxfieldset',
                    width: 750,
                    itemId: JSGetUUID(),
                    title: JSCreateFont('green', true, i18n.getKey('订单'), 16) + JSCreateFont('green', true, i18n.getKey('(总价)优惠')),
                    layout: 'column',
                    labelText: 'subtotal',
                    allowBlank: false,
                    legendItemConfig: {
                        deleteBtn: {
                            hidden: false, disabled: false, handler: function (btn) {
                                var fieldset = btn.ownerCt.ownerCt, container = fieldset.ownerCt;
                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                                    if (selector === 'yes') {
                                        if (container.items.items.length === 1) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('至少需要存在一条优惠配置'));
                                        } else {
                                            container.remove(fieldset);
                                        }
                                    }
                                })
                            },
                        },
                    },
                    defaults: {
                        margin: '5 25 5 0',
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            diySetValue: Ext.emptyFn,
                            value: 'com.qpp.cgp.domain.promotion.discount.OrderDiscount'
                        },
                        {
                            xtype: 'hiddenfield', name: '_id', itemId: '_id',
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: i18n.getKey('减免项'),
                            name: 'exemption',
                            itemId: 'exemption',
                            width: 500,
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                            },
                            items: [
                                {boxLabel: '订单项总价', name: 'exemption', inputValue: 'Subtotal', checked: true},
                            ]
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('优惠方式'),
                            name: 'strategy',
                            itemId: 'strategy',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            value: 'Percentage',
                            width: 250,
                            margin: '5 5 5 0',
                            store: {
                                fields: ['value', 'display'],
                                data: [
                                    /*    {
                                                value: 'Amount',
                                                display: '减指定金额'
                                            },*/
                                    {
                                        value: 'Percentage',
                                        display: '打折(百分比计算)'
                                    },
                                    /* {
                                             value: 'Price',
                                             display: '产品指定价格'
                                         }*/
                                ]
                            },
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var unit = field.ownerCt.getComponent('unit');
                                    var price = field.ownerCt.getComponent('price');
                                    var value = field.ownerCt.getComponent('value');
                                    if (newValue === 'Amount') {
                                        unit.setValue();
                                        price.show();
                                        price.setDisabled(false);
                                        value.hide();
                                        value.setDisabled(true);
                                    } else if (newValue === 'Percentage') {
                                        unit.setValue('%');
                                        value.show();
                                        value.setDisabled(false);
                                        price.hide();
                                        price.setDisabled(true);
                                    } else if (newValue === 'Price') {
                                        unit.setValue();
                                        price.show();
                                        price.setDisabled(false);
                                        value.hide();
                                        value.setDisabled(true);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'value',
                            width: 150,
                            minValue: 0,
                            maxValue: 100,
                            allowDecimals: true,
                            allowBlank: false,
                            decimalPrecision: 2,
                            margin: '5 0 5 0',
                            labelAlign: 'right',
                            itemId: 'value'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'value',
                            width: 150,
                            minValue: 0,
                            allowDecimals: true,
                            allowBlank: false,
                            decimalPrecision: 2,
                            margin: '5 0 5 0',
                            labelAlign: 'right',
                            hidden: true,
                            disabled: true,
                            itemId: 'price'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'unit',
                            itemId: 'unit',
                            width: 25,
                            margin: '5 0 5 5',
                            value: '%',
                            diySetValue: function () {
                            }
                        },
                    ],
                    isValid: function () {
                        var me = this;
                        return me.getComponent('value').isValid();
                    },
                    listeners: {
                        afterrender: function () {
                            var fieldset = this;
                            if (data) {
                                fieldset.setValue(data);
                            }
                        }
                    }
                },
                shippingFeeOrTax: {
                    xtype: 'uxfieldset',
                    width: 750,
                    itemId: JSGetUUID(),
                    title: JSCreateFont('green', true, i18n.getKey('订单'), 16) + JSCreateFont('green', true, i18n.getKey('(运费/税费)优惠')),
                    layout: 'column',
                    labelText: 'shippingFeeOrTax',
                    allowBlank: false,
                    legendItemConfig: {
                        deleteBtn: {
                            hidden: false, disabled: false, handler: function (btn) {
                                var fieldset = btn.ownerCt.ownerCt, container = fieldset.ownerCt;
                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                                    if (selector === 'yes') {
                                        if (container.items.items.length === 1) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('至少需要存在一条优惠配置'));
                                        } else {
                                            container.remove(fieldset);
                                        }
                                    }
                                })
                            },
                        },
                    },
                    defaults: {
                        margin: '5 25 5 0',
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            diySetValue: Ext.emptyFn,
                            value: 'com.qpp.cgp.domain.promotion.discount.OrderDiscount'
                        },
                        {
                            xtype: 'hiddenfield', name: '_id', itemId: '_id',
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: i18n.getKey('减免项'),
                            name: 'exemption',
                            itemId: 'exemption',
                            width: 500,
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                            },
                            items: [
                                {boxLabel: '运费', name: 'exemption', inputValue: 'ShippingFee', checked: true},
                                {boxLabel: '税费', name: 'exemption', inputValue: 'Tax'},]
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('优惠方式'),
                            name: 'strategy',
                            itemId: 'strategy',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            value: 'Percentage',
                            width: 250,
                            margin: '5 5 5 0',
                            store: {
                                fields: ['value', 'display'],
                                data: [
                                    /*    {
                                                value: 'Amount',
                                                display: '减指定金额'
                                            },*/
                                    {
                                        value: 'Percentage',
                                        display: '打折(百分比计算)'
                                    },
                                    /* {
                                             value: 'Price',
                                             display: '产品指定价格'
                                         }*/
                                ]
                            },
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var unit = field.ownerCt.getComponent('unit');
                                    var price = field.ownerCt.getComponent('price');
                                    var value = field.ownerCt.getComponent('value');
                                    if (newValue === 'Amount') {
                                        unit.setValue();
                                        price.show();
                                        price.setDisabled(false);
                                        value.hide();
                                        value.setDisabled(true);
                                    } else if (newValue === 'Percentage') {
                                        unit.setValue('%');
                                        value.show();
                                        value.setDisabled(false);
                                        price.hide();
                                        price.setDisabled(true);
                                    } else if (newValue === 'Price') {
                                        unit.setValue();
                                        price.show();
                                        price.setDisabled(false);
                                        value.hide();
                                        value.setDisabled(true);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'value',
                            width: 150,
                            minValue: 0,
                            maxValue: 100,
                            allowDecimals: true,
                            allowBlank: false,
                            decimalPrecision: 2,
                            margin: '5 0 5 0',
                            labelAlign: 'right',
                            itemId: 'value'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'value',
                            width: 150,
                            minValue: 0,
                            allowDecimals: true,
                            allowBlank: false,
                            decimalPrecision: 2,
                            margin: '5 0 5 0',
                            labelAlign: 'right',
                            hidden: true,
                            disabled: true,
                            itemId: 'price'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'unit',
                            itemId: 'unit',
                            width: 25,
                            margin: '5 0 5 5',
                            value: '%',
                            diySetValue: function () {
                            }
                        },
                    ],
                    isValid: function () {
                        var me = this;
                        return me.getComponent('value').isValid();
                    },
                    listeners: {
                        afterrender: function () {
                            var fieldset = this;
                            if (data) {
                                fieldset.setValue(data);
                            }
                        }
                    }
                },
                product: {
                    xtype: 'uxfieldset',
                    width: 750,
                    itemId: JSGetUUID(),
                    title: JSCreateFont('green', true, i18n.getKey('产品'), 16) + JSCreateFont('green', true, i18n.getKey('价格优惠')),
                    layout: 'column',
                    labelText: 'product',
                    allowBlank: false,
                    legendItemConfig: {
                        deleteBtn: {
                            hidden: false, disabled: false, handler: function (btn) {
                                var fieldset = btn.ownerCt.ownerCt, container = fieldset.ownerCt;
                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                                    if (selector === 'yes') {
                                        if (container.items.items.length === 1) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('至少需要存在一条优惠配置'));
                                        } else {
                                            container.remove(fieldset);
                                        }
                                    }
                                })
                            }
                        },
                    },
                    defaults: {
                        margin: '5 25 5 0',
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            diySetValue: Ext.emptyFn,
                            value: 'com.qpp.cgp.domain.promotion.discount.ProductDiscount'
                        },
                        {
                            xtype: 'hiddenfield',
                            name: '_id',
                            itemId: '_id',
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('优惠方式'),
                            name: 'strategy',
                            itemId: 'strategy',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            value: 'Percentage',
                            width: 250,
                            margin: '5 5 5 0',
                            store: {
                                fields: ['value', 'display'],
                                data: [
                                    /*{
                                        value: 'Amount', display: '减指定金额'
                                    },*/
                                    {
                                        value: 'Percentage', display: '打折(百分比计算)'
                                    },
                                    /*{
                                        value: 'Price', display: '产品指定价格'
                                    }*/
                                ]
                            },
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var unit = field.ownerCt.getComponent('unit');
                                    var price = field.ownerCt.getComponent('price');
                                    var value = field.ownerCt.getComponent('value');
                                    if (newValue === 'Amount') {
                                        unit.setValue();
                                        price.show();
                                        price.setDisabled(false);
                                        value.hide();
                                        value.setDisabled(true);
                                    } else if (newValue === 'Percentage') {
                                        unit.setValue('%');
                                        value.show();
                                        value.setDisabled(false);
                                        price.hide();
                                        price.setDisabled(true);
                                    } else if (newValue === 'Price') {
                                        unit.setValue();
                                        price.show();
                                        price.setDisabled(false);
                                        value.hide();
                                        value.setDisabled(true);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'value',
                            width: 150,
                            minValue: 0,
                            maxValue: 100,
                            allowDecimals: true,
                            allowBlank: false,
                            decimalPrecision: 2,
                            margin: '5 0 5 0',
                            labelAlign: 'right',
                            itemId: 'value'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'value',
                            width: 150,
                            minValue: 0,
                            allowDecimals: true,
                            allowBlank: false,
                            decimalPrecision: 2,
                            margin: '5 0 5 0',
                            labelAlign: 'right',
                            hidden: true,
                            disabled: true,
                            itemId: 'price'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'unit',
                            itemId: 'unit',
                            width: 25,
                            margin: '5 0 5 5',
                            value: '%',
                            diySetValue: function () {
                            }
                        },
                        {
                            xtype: 'uxfieldcontainer',
                            layout: 'vbox',
                            name: 'purchaseReq',
                            itemId: 'purchaseReq',
                            width: 600,
                            margin: 0,
                            diySetValue: function (data) {
                                if (data) {
                                    var me = this, reqRangeComp = me.getComponent('reqRange'),
                                        productDiscountComp = me.getComponent('productDiscount'), {
                                            reqRange,
                                            _id
                                        } = data;

                                    me.dataId = _id;
                                    reqRangeComp.setValue(reqRange);
                                    productDiscountComp.diySetValue(data);
                                }
                            },
                            diyGetValue: function () {
                                const result = {}, me = this, items = me.items.items;

                                items.forEach(item => {
                                    const {name} = item;
                                    if (name) {
                                        result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                                    }
                                })

                                return Ext.Object.merge({
                                    _id: me.dataId, reqRange: result['reqRange'],
                                }, result['productDiscount']);
                            },
                            defaults: {
                                margin: '5 0 5 0',
                            },
                            items: [
                                {
                                    xtype: 'combo',
                                    fieldLabel: i18n.getKey('reqRange'),
                                    name: 'reqRange',
                                    itemId: 'reqRange',
                                    hidden: true,
                                    isLike: false,
                                    editable: false,
                                    haveReset: true,
                                    valueField: 'value',
                                    displayField: 'display',
                                    value: 'Order',
                                    store: {
                                        fields: ['value', 'display'],
                                        data: [
                                            {
                                                value: 'Order', display: '订单'
                                            },
                                        ]
                                    }
                                },
                                {
                                    xtype: 'combo',
                                    isLike: false,
                                    fieldLabel: i18n.getKey('折扣生效策略'),
                                    name: 'productDiscount',
                                    itemId: 'productDiscount',
                                    editable: false,
                                    haveReset: true,
                                    valueField: 'value',
                                    displayField: 'display',
                                    store: {
                                        fields: ['value', 'display'],
                                        data: [
                                            {
                                                value: 'purchaseQtyRangeReq',
                                                display: '数量范围'
                                            },
                                            {
                                                value: 'expressionReq',
                                                display: '表达式'
                                            },
                                        ]
                                    },
                                    value: 'purchaseQtyRangeReq',
                                    listeners: {
                                        change: function (combo, newValue, oldValue) {
                                            const container = combo.ownerCt,
                                                purchaseQtyRangeReq = container.getComponent('purchaseQtyRangeReq'),
                                                expression = container.getComponent('expressionReq'),
                                                valueGather = {
                                                    purchaseQtyRangeReq: function () {
                                                        purchaseQtyRangeReq.show();
                                                        purchaseQtyRangeReq.setDisabled(false);
                                                        expression.hide();
                                                        expression.setDisabled(true);
                                                    },
                                                    expressionReq: function () {
                                                        expression.show();
                                                        expression.setDisabled(false);
                                                        purchaseQtyRangeReq.hide();
                                                        purchaseQtyRangeReq.setDisabled(true);
                                                    }
                                                }
                                            valueGather[newValue]();
                                        }
                                    },
                                    diyGetValue: function () {
                                        const me = this, {value} = me, container = me.ownerCt,
                                            purchaseQtyRangeReq = container.getComponent('purchaseQtyRangeReq'),
                                            expression = container.getComponent('expressionReq'), valueGather = {
                                                purchaseQtyRangeReq: function () {
                                                    return purchaseQtyRangeReq.diyGetValue();
                                                },
                                                expressionReq: function () {
                                                    return expression.diyGetValue();
                                                }
                                            }
                                        return value && valueGather[value]();
                                    },
                                    diySetValue: function (data) {
                                        const me = this, {clazz} = data, container = me.ownerCt,
                                            purchaseQtyRangeReq = container.getComponent('purchaseQtyRangeReq'),
                                            expression = container.getComponent('expressionReq'), valueGather = {
                                                'com.qpp.cgp.domain.promotion.discount.PurchaseQtyRangeReq': function () {
                                                    purchaseQtyRangeReq.setDisabled(false);
                                                    purchaseQtyRangeReq.setVisible(true);
                                                    purchaseQtyRangeReq.diySetValue(data);
                                                    me.setValue('purchaseQtyRangeReq')
                                                },
                                                'com.qpp.cgp.domain.promotion.discount.ExpressionReq': function () {
                                                    expression.setDisabled(false);
                                                    expression.setVisible(true);
                                                    expression.diySetValue(data);
                                                    me.setValue('expressionReq')
                                                }
                                            }
                                        valueGather[clazz]();
                                    },
                                },
                                {
                                    xtype: 'uxfieldcontainer',
                                    layout: 'hbox',
                                    name: 'purchaseQtyRangeReq',
                                    itemId: 'purchaseQtyRangeReq',
                                    allowBlank: false,
                                    diySetValue: function (data) {
                                        if (data) {
                                            const me = this, {min, max} = data, minComp = me.getComponent('min'),
                                                maxComp = me.getComponent('max');

                                            minComp.setValue(min);
                                            maxComp.setValue(max);
                                        }
                                    },
                                    diyGetValue: function () {
                                        const me = this, min = me.getComponent('min'), max = me.getComponent('max');

                                        return {
                                            clazz: 'com.qpp.cgp.domain.promotion.discount.PurchaseQtyRangeReq',
                                            min: min.getValue(),
                                            max: max.getValue(),
                                        };
                                    },
                                    defaults: {
                                        margin: 0
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            width: 105,
                                            fieldLabel: i18n.getKey('数量范围'),
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'min',
                                            itemId: 'min',
                                            width: 100,
                                            minValue: 0,
                                            emptyText: '最小值',
                                            allowDecimals: true,
                                            allowBlank: false,
                                        },
                                        {
                                            xtype: 'displayfield',
                                            width: 10,
                                            margin: '0 5 0 5',
                                            value: '~'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'max',
                                            itemId: 'max',
                                            width: 100,
                                            minValue: 0,
                                            emptyText: '最大值',
                                            allowDecimals: true,
                                            allowBlank: false,
                                        },
                                    ]
                                },
                                {
                                    xtype: 'expression_textarea',
                                    name: 'expressionReq',
                                    itemId: 'expressionReq',
                                    allowBlank: false,
                                    hidden: true,
                                    disabled: true,
                                    width: '100%',
                                    height: 200,
                                    fieldLabel: i18n.getKey('表达式'),
                                    diyGetValue: function () {
                                        const me = this;
                                        return {
                                            clazz: 'com.qpp.cgp.domain.promotion.discount.ExpressionReq', expression: {
                                                "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                                                "type": "Boolean",
                                                "constraints": [],
                                                "expression": {
                                                    "clazz": "com.qpp.cgp.expression.Expression",
                                                    "resultType": "Boolean",
                                                    "expressionEngine": "JavaScript",
                                                    "inputs": [],
                                                    "expression": me.getValue()
                                                }
                                            }
                                        };
                                    },
                                    diySetValue: function (data) {
                                        if (data) {
                                            const me = this, {expression, _id} = data;

                                            me.expressionId = _id;
                                            me.setValue(expression['expression']['expression']);
                                        }
                                    },
                                    toolbarCfg: {
                                        items: [
                                            {
                                                xtype: 'button',
                                                text: '使用模板',
                                                count: 0,
                                                itemId: 'edit',
                                                iconCls: 'icon_edit',
                                                handler: function (btn) {
                                                    var description = btn.up('[xtype=expression_textarea]'),
                                                        tools = btn.ownerCt,
                                                        formatBtn = tools.getComponent('formatBtn');

                                                    description.setValue(`function expression(args) {
                                                        if (args.context['qty'] > 10 && args.context['qty'] < 20) {
                                                            return true;
                                                        } else if (args.context['qty'] < 10) {
                                                            return false;
                                                        } else {
                                                            return false;
                                                        }
                                                    }`);
                                                    formatBtn.handler(formatBtn);
                                                }
                                            }, {
                                                xtype: 'button',
                                                text: '格式化',
                                                iconCls: 'icon_config',
                                                itemId: 'formatBtn',
                                                handler: function (btn) {
                                                    var description = btn.up('[xtype=expression_textarea]');
                                                    var str = description.getValue();
                                                    var tabchar = ' ';
                                                    var tabsize = '4';
                                                    description.setValue(window.js_beautify(str, tabsize, tabchar));
                                                }
                                            },]
                                    },
                                    contentAttributeStore: Ext.data.StoreManager.lookup('contentAttributeStore'),
                                }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: i18n.getKey('是否包含所选产品'),
                            name: 'includes',
                            itemId: 'includes',
                            isFormField: true,
                            width: 370,
                            labelWidth: 140,
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                            },
                            items: [{boxLabel: '是', name: 'includes', inputValue: true, checked: true}, {
                                boxLabel: '否',
                                name: 'includes',
                                inputValue: false
                            },],
                            diyGetValue: function () {
                                const me = this, value = me.getValue();
                                return value['includes'];
                            },
                        },
                        {
                            xtype: 'gridfieldwithcrudv2',
                            name: 'discountProductScopes',
                            itemId: 'discountProductScopes',
                            allowBlank: false,
                            fieldLabel: i18n.getKey('产品'),
                            width: 700,
                            maxHeight: 300,
                            actioneditHidden: true,
                            isEmptyHiddenGrid: true,
                            gridConfig: {
                                store: {
                                    fields: [{
                                        name: '_id', type: 'number'
                                    }, {
                                        name: 'clazz',
                                        type: 'string',
                                        defaultValue: 'com.qpp.cgp.domain.promotion.discount.DiscountProductScope'
                                    }, {
                                        name: 'productId', type: 'number'
                                    }, {
                                        name: 'name', type: 'string'
                                    }, {
                                        name: 'type', type: 'string'
                                    },], proxy: {
                                        type: 'pagingmemory'
                                    }, data: []
                                }, autoScroll: true, columns: [{
                                    dataIndex: 'productId', width: 100, text: i18n.getKey('product') + i18n.getKey('id')
                                }, {
                                    dataIndex: 'name', flex: 1, text: i18n.getKey('name')
                                }, {
                                    dataIndex: 'type', flex: 1, text: i18n.getKey('type')
                                },],
                            },
                            winConfig: {
                                width: 900, winTitle: i18n.getKey('查看_产品'), formConfig: {
                                    layout: 'fit', listeners: {
                                        afterrender: function (form) {
                                            const result = [], win = form.ownerCt, data = win.outGrid.store.proxy.data;

                                            data.forEach(item => {
                                                result.push(item.productId)
                                            })

                                            form.add({
                                                xtype: 'productGridWindow',
                                                itemId: 'productGridWindow',
                                                margin: 0,
                                                storeFilter: result,
                                            });
                                        }
                                    }, items: [], saveHandler: function (btn) {
                                        const form = btn.ownerCt.ownerCt, win = form.ownerCt,
                                            productGridWindow = form.getComponent('productGridWindow'),
                                            grid = productGridWindow.getComponent('grid'),
                                            selection = grid.getSelectionModel().getSelection()

                                        if (selection.length) {
                                            win.outGrid.store.proxy.data ? null : win.outGrid.store.proxy.data = [];

                                            selection.forEach(item => {
                                                const {id, name, type} = item.data;
                                                win.outGrid.store.proxy.data.push({
                                                    productId: id,
                                                    name: name,
                                                    type: type,
                                                    clazz: 'com.qpp.cgp.domain.promotion.discount.DiscountProductScope'
                                                });
                                            })

                                            win.outGrid.store.load();
                                            win.close();
                                        } else {
                                            Ext.Msg.alert('提示', '请选择用户');
                                        }
                                    }
                                },
                            },
                            diyGetValue: function () {
                                const me = this;
                                return me._grid.store.proxy.data;
                            }
                        }
                    ],
                    isValid: function () {
                        var me = this;
                        return me.getComponent('value').isValid();
                    },
                    listeners: {
                        afterrender: function () {
                            var fieldset = this;
                            if (data) {
                                fieldset.setValue(data);
                            }
                        }
                    }
                },
            }

        me.clearTypeItem(signal, false, function (result) {
            me.add(itemGather[signal]);
        });
    },
    clearTypeItem: function (type, promptText, callFn, elseFn) {
        var me = this,
            items = me.items.items,
            result = [],
            typeTextGather = {
                subtotal: '订单总价',
                shippingFeeOrTax: '订单运费/税费',
                product: '产品价格',
            },
            typeText = typeTextGather[type],
            title = promptText || '是否切换为 ' + typeText + ' 优惠? 切换后,将清空互斥配置!'

        items.forEach(item => {
            var {itemId, labelText} = item,
                comp = me.getComponent(itemId)

            if (['product', 'subtotal'].includes(type)) { //如果我加的是其中之一
                if (labelText !== type) { //当加的不符合同一类型 
                    if (labelText !== 'shippingFeeOrTax') { //不属于通用项的全加入到删除列表
                        result.push(comp)
                    }
                }
            }
        })

        if (result.length) {
            return Ext.Msg.confirm('提示', title, function (btn) {
                if (btn === 'yes') {
                    result.forEach(item => {
                        me.remove(item);
                    })
                    callFn && callFn(result);
                } else {
                    elseFn && elseFn(result);
                }
            })
        }

        callFn && callFn();
    },
    listeners: {
        afterrender: function () {
            var me = this;
            // me.addItem({strategy: 'Percentage'}, 'order')
        }
    }
})
