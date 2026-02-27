/**
 * Created by nan on 2019/6/10.
 * 非必填的属性都传null
 */
Ext.Loader.syncRequire(['CGP.product.edit.model.Attribute'])
Ext.define('CGP.product.view.batchgenerateskuproduct.view.SkuAttributeForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    columnCount: 1,
    itemId: 'skuAttributeForm',
    header: false,
    autoScroll: true,
    configurableProductId: null,
    layout: {
        type: 'table',
        columns: 1
    },
    isValid: function () {
        this.msgPanel.hide();
        var errors = {};
        var isValid = true;
        this.items.items.forEach(function (f) {
            if (!f.isValid()) {
                isValid = false;
                if (Ext.isObject(f.getErrors())) {
                    Ext.Object.merge(errors, f.getErrors());
                } else {
                    errors[f.getFieldLabel()] = f.getErrors();
                }
            }
        });
        isValid ? null : this.showErrors(errors);
        return isValid;
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
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('generate') + i18n.getKey('skuProduct'),
            iconCls: 'icon_batch',
            width: 125,
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                if (form.isValid()) {
                    var controller = Ext.create('CGP.product.view.batchgenerateskuproduct.controller.Controller');
                    controller.batchGenerateSkuProduct(form, [form.getValue()], form.configurableProductId);
                }
            }
        },
        {
            xtype: 'button',
            text: i18n.getKey('get') + i18n.getKey('generate') + i18n.getKey('product') + i18n.getKey('data'),
            iconCls: 'icon_check',
            width: 125,
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                if (form.isValid()) {
                    var data = JSON.stringify(form.getValue());
                    data = data.replace(/},/g, '},\n')
                    var win = Ext.create('Ext.window.Window', {
                        width: 300,
                        modal: true,
                        contains: true,
                        title: i18n.getKey('get') + i18n.getKey('generate') + i18n.getKey('product') + i18n.getKey('data'),
                        minHeight: 250,
                        layout: {
                            type: 'fit'
                        },
                        items: [
                            {
                                xtype: 'textarea',
                                autoScroll: true,
                                value: data
                            }
                        ]
                    })
                    win.show();


                }
            }
        }
    ],
    getValue: function () {
        var me = this;
        var values = [];
        me.items.each(function (item) {
            var value = {};
            var v = item.getValue();
            if ((!Ext.isObject(v) && Ext.isEmpty(v)) || (Ext.isObject(v) && Ext.Object.isEmpty(v))) {
                value['id'] = item.name;
                value['value'] = null;
                values.push(value);
            } else {
                if (item.xtype == 'datefield') {
                    value.value = item.getSubmitValue();
                } else {
                    if (Ext.isObject(v) && !Ext.Object.isEmpty(v)) {
                        if (v[item.name] == 'YES' || v[item.name] == 'NO')
                            value.value = v[item.name];
                        else {

                            if (Ext.isArray(v[item.name])) {
                                value.value = v[item.name];//还是传数组，不转换为字符串
                            } else {
                                value.value = (v[item.name] + '').split(',')
                            }
                        }
                    } else if (item.xtype == 'combobox') {
                        value.value = v;
                    } else {
                        value.value = v;
                    }
                }
                value.id = item.name;
                values.push(value);
            }
        })
        return values;
    },
    setValue: function (data) {
        var me = this;
        var attributes = me.attributes;
        if (data.isLoading()) {
            data.on('load', function (store, records) {
                records = me.moveItemToLast(records, function (item) {
                    return item.get('inputType') == 'DiyConfig' || item.get('inputType') == 'TextArea';
                })
                Ext.Array.each(records, function (attribute) {
                    me.addItem(attribute);
                })
            })
        } else {
            data.data.items.forEach(function (records) {
                records = me.moveItemToLast(records, function (item) {
                    return item.get('inputType') == 'DiyConfig' || item.get('inputType') == 'TextArea';
                })
                Ext.Array.each(records, function (attribute) {
                    me.addItem(attribute);
                })
            })


        }
    },
    addItem: function (skuAttribute) {
        var me = this;
        var attribute = skuAttribute.attribute;
        var attributeModel = new CGP.product.edit.model.Attribute(attribute);
        var column = Qpp.CGP.util.createColumnByAttribute(attributeModel, {
            msgTarget: 'side',
            padding: '10 10 5 10',
            allowBlank: !skuAttribute.required,
            fieldLabel: attributeModel.get('name') + '(' + attributeModel.get('id') + ')',
            validateOnChange: false,
            plugins: [{
                ptype: 'uxvalidation'
            }]
        });
        me.add(column);
        return column;
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
    },
    initComponent: function () {
        var me = this;
        /*        Ext.Ajax.request({
                    url: adminPath + 'api/products/configurable/' + me.configurableProductId + '/skuAttributes',
                    method: 'GET',
                    async: false,
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            var skuAttributeArray = [];
                            for (var i = 0; i < responseMessage.data.length; i++) {
                                var item = responseMessage.data[i];
                                if (/!*item.isSku == true*!/true) {//判断是否为sku属性。！现在改为所有的产品属性都可以配置值
                                    /!*
                                                                responseMessage.data[i].attribute.required = true;
                                    *!/
                                    skuAttributeArray.push(responseMessage.data[i]);
                                }
                                //skuAttributeArray.push(responseMessage.data[i].attribute);

                            }
                            me.attributeStore = new Ext.data.Store({
                                model: 'CGP.product.view.managerskuattribute.model.SkuAttribute',
                                remoteSort: false,
                                data: skuAttributeArray
                            });

                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                })*/
        me.callParent();
        var skuAttributeStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
            configurableId: me.configurableProductId,
            listeners: {
                'load': function (store, records) {
                    Ext.Array.each(records, function (skuAttribute) {
                        //过滤掉非sku属性
                        if (skuAttribute.get('isSku')) {
                            me.addItem(skuAttribute.getData());
                        }
                    })
                }
            },
        });
    }
})
