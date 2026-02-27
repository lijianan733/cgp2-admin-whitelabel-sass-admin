Ext.Loader.syncRequire(['CGP.product.edit.model.Attribute']);
Ext.define('CGP.product.edit.component.skuproducts.SkuAttributeFilterForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    columnCount: 1,
    itemId: 'skuAttributeForm',
    autoScroll: true,
    configurableProductId: null,
    skuAttributeIds: [],
    //height: 300,
    listeners: {
        'afterrender': function (thisForm) {
            thisForm.setValue(thisForm.attributeStore);
            thisForm.createSkuProductGrid(thisForm.skuAttributeIds, thisForm.skuProductContainer, thisForm.attributeStore);
        }
    },
    layout: {
        type: 'table',
        columns: 3
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
    getValue: function () {
        var me = this;
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
                            value.value = v[item.name].join(',');
                        } else {
                            value.value = v[item.name];
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
        me.add({
            xtype: 'fieldcontainer',
            width: 200,
            layout: 'hbox',
            itemId: 'fieldContainer',
            defaults: {
                flex: 1
            },
            style: 'margin-left:60px',
            items: [{
                xtype: 'button',
                text: i18n.getKey('search'),
                itemId: 'searchButton',
                iconCls: 'icon_query',
                handler: function () {
                    me.skuProductGrid.getStore().loadPage(1);
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('clear'),
                itemId: 'clearButton',
                iconCls: 'icon_clear',
                style: 'margin-left:15px',
                handler: function () {
                    me.reset();
                }
            }]
        })
    },
    addItem: function (attribute) {
        var me = this;
        var column = Qpp.CGP.util.createColumnByAttribute(attribute, {
            msgTarget: 'side',
            allowBlank: true,
            padding: '10 10 5 10',
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
        me.title = i18n.getKey('attributeValue') + i18n.getKey('query');
        /*me.items = [{
            xtype: 'fieldcontainer',
            width: 200,
            layout: 'hbox',
            itemId: 'fieldContainer',
            defaults: {
                flex: 1
            },
            style: 'margin-left:60px',
            items: [{
                xtype: 'button',
                text: i18n.getKey('search'),
                handler: me.searchActionHandler,
                itemId: 'searchButton',
                iconCls: 'icon_query'
            }, {
                xtype: 'button',
                text: i18n.getKey('clear'),
                itemId: 'clearButton',
                iconCls: 'icon_clear',
                style: 'margin-left:15px',
                handler: function () {
                    me.reset();
                }
            }]
        }];*/
        Ext.Ajax.request({
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
                        if (item.isSku == true) {//判断是否为sku属性
                            /*
                                                        responseMessage.data[i].attribute.required = true;
                            */
                            skuAttributeArray.push(responseMessage.data[i].attribute);
                            me.skuAttributeIds.push(responseMessage.data[i].attribute.id);
                        }
                        //skuAttributeArray.push(responseMessage.data[i].attribute);

                    }
                    me.attributeStore = new Ext.data.Store({
                        model: 'CGP.product.edit.model.Attribute',
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
        });
        /*var skuProductStore = Ext.create('CGP.product.edit.store.SkuProduct',{
            configurableProductId: me.configurableProductId
        });
        me.skuProductStore = skuProductStore;*/
        /*skuProductStore.on('beforeload', function () {
            var p = skuProductStore.getProxy();
            if (Ext.isEmpty(p.filter)) {
                p.filter = me;
            }
        });*/
        /*skuProductStore.load(function (products, operation, success) {
            if (success) {
                var skuAttributeValues = new Ext.util.MixedCollection();

                me.createSkuProductGrid(products, me.skuAttributeIds, me.skuProductContainer, me.attributeStore);
            }
        });*/
        /*me.listeners = {
            afterrender:function () {
                me.createSkuProductGrid(me.skuAttributeIds, me.skuProductContainer, me.attributeStore);
            }
        };*/
        me.callParent();
        //me.createSkuProductGrid(me.skuAttributeIds, me.skuProductContainer, me.attributeStore);
    },
    getQuery: function () {
        var querys = [],
            f = 0,
            fields,
            field, val, name, sp;
        fields = this.form.getFields().items;
        for (; f < fields.length; f++) {

            field = fields[f];
            if (field.xtype == "fieldcontainer") {
                continue;
            }
            name = field.name;
            val = field.value;
            if (field.xtype == 'gridcombo' || field.xtype == 'singlegridcombo') {
                val = field.getSubmitValue()[0];
            }
            if (field.xtype == 'productcategorycombo') {
                val = field.value ? field.value.toString() : null;
            }
            if (field.xtype == 'checkboxgroup') {
                val = [];
                Ext.each(field.getChecked(), function (item) {
                    val.push(item.inputValue);
                })
            }
            if (field.xtype == 'checkboxfield') {
                val = '';
            }
            if (!Ext.isEmpty(val)) {
                var query = {};
                query.id = name;

                if (Ext.isDate(val)) {
                    if (!Ext.isEmpty(field.change)) {
                        var time = val.getTime();
                        var resultTime;
                        resultTime = time + (24 * 60 * 60 * 1000 * field.change);
                        val = new Date(resultTime);
                    }
                    var values = Ext.Date.format(val, 'Y-m-d H:i:s');
                    query.value = values;
                } else if (Ext.isString(val)) {
                    var values;
                    if (!Ext.isEmpty(field.isExtraParam) && field.isExtraParam == true) {
                        var extraParamData = {};
                        if (field.itemId == 'extraParamValue' && !Ext.isEmpty(field.getValue())) {
                            Ext.each(fields, function (item) {
                                if (item.itemId == 'extraParamName') {
                                    extraParamData[item.getValue()] = field.getValue();
                                }
                            });
                            query.value = extraParamData;
                        }

                    } else {
                        if (!Ext.isEmpty(field.isBoolean) && field.isBoolean == true) {
                            query.value = val;
                        } else {
                            if (Ext.isEmpty(field.isLike) || field.isLike == true) {
                                if (field.isArray) {
                                    values = values.split(',');
                                }
                                values = val.replace("'", "''");

                            } else if (!Ext.isEmpty(field.isLike) && field.isLike === false) {
                                values = val.replace("'", "''");
                                if (field.isArray) {
                                    values = values.split(',');
                                }

                            }
                            query.value = values;
                        }
                    }
                } else if (Ext.isNumber(val)) {
                    query.value = val;
                } else if (Ext.isBoolean(val)) {
                    query.value = val;
                } else if (Ext.isArray(val)) {
                    if (Ext.isEmpty(field.isArray) || field.isArray == false) {
                        Ext.Array.remove(val, null);
                        if (!val.length > 0) {
                            continue;
                        }
                        //query.value = val.join(',');
                    } else if (!Ext.isEmpty(field.isArray) && field.isArray === true) {
                        Ext.Array.remove(val, null);
                        if (!val.length > 0) {
                            continue;
                        }
                        query.value = val;
                    }
                }
                querys.push(query);
            }
        }
        for (var i = 0; i < querys.length; i++) {
            if (Ext.isEmpty(querys[i].value)) {
                querys.remove(i);
            }
        }
        return querys;
    },
    createSkuProductGrid: function (attributeIds, container, attributes) {
        var me = this;
        var skuProductGrid = Ext.create("CGP.product.edit.component.skuproducts.SkuProductGrid", {
            controller: me.controller,
            attributes: attributes,
            region: 'center',
            header: false,
            attributeValues: me,
            attributeIds: attributeIds,
            store: me.skuProductStore,
            configurableProductId: me.configurableProductId
        });
        me.skuProductGrid = skuProductGrid;
        container.add(skuProductGrid);
    },
    reset: function () {
        //        this.form.reset();
        Ext.suspendLayouts();

        var me = this,
            fields = me.items.items,
            f,
            fLen = fields.length;
        //不清除已经隐藏的field的值  现阶段作为页面默认filter  不能被清除
        for (f = 0; f < fLen; f++) {
            if (fields[f].xtype === "fieldcontainer") {
                continue;
            }
            fields[f].reset();
        }

        Ext.resumeLayouts(true);
    }
});
