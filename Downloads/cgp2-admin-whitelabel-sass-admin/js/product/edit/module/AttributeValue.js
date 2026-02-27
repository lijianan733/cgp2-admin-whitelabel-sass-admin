Ext.define('CGP.product.edit.module.AttributeValue', {
    extend: 'Ext.ux.form.Panel',


    config: {
        columnCount: 1
    },
    constructor: function (config) {
        var me = this;


        config = config || {};

        Ext.apply(me, config);

        config = Ext.apply({
            title: i18n.getKey('attributeValue')
        }, config);

        me.callParent([config]);

        me.content = me;
    },

    validateForm: function () {
        var me = this;
        if (!me.isValid()) {
            throw new Error('edit product underfill productAttribute!');
        }
    },
    getValue: function () {

        var me = this;

        me.validateForm();

        var values = [];
        me.items.each(function (item) {
            var value = {};
            var v = item.getValue();
            if (item.xtype == 'datefield') {
                value.value = item.getSubmitValue();
            } else {
                if (Ext.isObject(v)) {
                    if (v[item.name] == 'YES' || v[item.name] == 'NO')
                        value.value = v[item.name];
                    else {

                        if (Ext.isArray(v[item.name])) {
                            value.optionIds = v[item.name].join(',');
                        } else {
                            value.optionIds = v[item.name];
                        }
                    }
                } else if (item.xtype == 'combobox') {
                    value.optionIds = v;
                } else {
                    value.value = v;
                }
            }
            value.attributeId = item.name;
            value.id = item.itemId == 0 ? null : item.itemId;
            values.push(value);
        })
        return values;
    },

    setValue: function (data) {

        var me = this;
        var attributes = me.attributes;
        //传入的是Store  表明为新建过程
        if (data && data.isStore) {

            //使用传入的attributeStore中已有的字段生成field
            if (data.getCount() > 0 || data.totalCount == data.removed.length) {
                me.addItemsByStore(data);
            } else {
                //所有的属性都作为sku属性
                //传入的attributeStore重新load数据后生成field
                data.load(function (records, operaton, success) {
                    if (success) {

                        records = me.moveItemToLast(records, function (item) {
                            return item.get('inputType') == 'DiyConfig' || item.get('inputType') == 'TextArea';
                        })
                        Ext.Array.each(records, function (attribute) {
                            me.addItem(attribute);
                        })
                    }
                })
            }
            //如果是AttributeValues数组 表明为修改过程
        } else if (Ext.isArray(data) || Ext.isEmpty(data)) {
            //先返回一个空的Panel

            me.attributes.load(function (records, operation, success) {
                if (success) {
                    //在这里再添加到form中
                    if (Ext.isArray(data)) {

                        data = me.moveItemToLast(data, function (item) {
                            var inputType = attributes.getById(item.attributeId).get('inputType');
                            return inputType == 'DiyConfig' || inputType == 'TextArea';
                        })

                        me.addItemsByArray(data, true);

                    } else if (Ext.isEmpty(data)) {
                        records.forEach(function (attribute) {
                            me.addItem(attribute);
                        })
                    }
                }
            })
        }
    },

    copy: function (skuData) {
        this.content.items.each(function (item) {

            item.itemId = 0;
        });

        Ext.Array.each(skuData.attributeValues, function (av) {
            av.id = null;
        });
    },


    addItem: function (attribute) {
        var me = this;
        var column = Qpp.CGP.util.createColumnByAttribute(attribute, {
            msgTarget: 'side',
            validateOnChange: false,
            plugins: [{
                ptype: 'uxvalidation'
            }]
        });
        //
        me.add(column);
        return column;
    },

    addItemsByStore: function (attributeStore) {
        var me = this;
        var data = me.data;
        attributeStore.each(function (attribute) {
            if (data && data.skuAttributes) {
                Ext.Array.findBy(data.skuAttributes, function (item) {
                    if (item.attributeId == attribute.get('id')) {
                        attribute.set('sku', true);
                        if(!Ext.isEmpty(item.defaultValue)){
                            attribute.set('defaultValue', item.defaultValue);
                        }
                        attribute.set('value', item.value || item.defaultValue || null);
                        return true;
                    }
                }, data.skuAttributes)
            }
            me.addItem(attribute);
        })
    },

    addItemsByArray: function (attributesArray, setValue) {
        var me = this;
        var attributes = me.attributes;
        attributesArray.forEach(function (attributeValue) {

            var attribute = attributes.getById(attributeValue.attributeId);
            attribute.set('value', attributeValue.optionIds || attributeValue.value);
            attribute.set('attributeValueId', attributeValue.id);
            attribute.set('sku', attributeValue.sku);
            me.addItem(attribute);
        })
    },

    moveItemToLast: function (parray, fn) {

        var i, j, tmp, array = Ext.clone(parray);
        //index;
        var needMove = [];
        for (i = 0; i < array.length; i++) {
            if (fn.call(array, array[i])) {
                needMove.push(i);
            }
        }

        for (j = 0; j < needMove.length; j++) {

            var change1 = array[(array.length - 1 - j)];
            var change2 = array[needMove[j]];

            tmp = change1;
            array[(array.length - 1 - j)] = change2;
            array[needMove[j]] = tmp;
        }
        return array;
    }


})
