/**
 * Created by nan on 2020/2/14.
 */
Ext.define('CGP.product.view.managerskuattribute.view.ManageSkuAttributePropertyWindow', {
    extend: 'Ext.window.Window',
    width: 450,
    height: '45%',
    modal: true,
    constrain: true,
    skuAttributeId: null,
    layout: 'fit',
    inputTypeClazz: null,
    inputType: null,
    skuAttribute: null,
    isLock: false,
    title: i18n.getKey('manager') + i18n.getKey('SkuAttributeProperty'),
    initComponent: function () {
        var me = this;
        var inputTypeClazz = me.inputTypeClazz = (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], me.inputType)) ? 'DiscreteValueConstraint' : 'ContinuousValueConstraint';
        var options = me.skuAttribute.attribute.options;
        var valueType = me.skuAttribute.attribute.valueType;
        Ext.define('localEditWindow', {
            extend: 'Ext.window.Window',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            width: 320,
            height: 150,
            createOrEdit: 'create',
            record: null,
            grid: null,
            modal: true,
            constrain: true,
            options: null,
            inputTypeClazz: null,
            discreteValueConstraintEnableProperty: [//选项值可以使用的
                {
                    value: 'DefaultHiddenOptions',
                    display: 'DefaultHiddenOptions'
                }, {
                    value: 'DefaultEnableOptions',
                    display: 'DefaultEnableOptions'
                },
                {
                    value: 'DefaultDisplayOptions',
                    display: 'DefaultDisplayOptions'
                },
            ],
            continuousValueConstraintEnableProperty: [//连续值
                {
                    value: 'saveAccuracy',
                    display: 'saveAccuracy'
                },
                {
                    value: 'displayAccuracy',
                    display: 'displayAccuracy'
                }
            ],
            initComponent: function () {
                var me;
                me = this;
                var value = null;
                value = me.record ? me.record.get('value') : null;
                if (me.inputTypeClazz == 'DiscreteValueConstraint') {//选项类型
                    if (value) {
                        value = value.split(/\[|\]/)[1];
                        value = value.split(',');
                    }
                }
                var enableProperty = [];
                if (me.inputTypeClazz == 'DiscreteValueConstraint') {//选项类型
                    enableProperty = enableProperty.concat(me.discreteValueConstraintEnableProperty);
                } else {
                    if (valueType == 'Number') {//数值类型
                        enableProperty = enableProperty.concat(me.continuousValueConstraintEnableProperty);
                    }
                }
                me.items = [{
                    xtype: 'form',
                    itemId: 'form',
                    border: false,
                    items: [
                        {
                            xtype: 'combo',
                            itemId: 'name',
                            displayField: 'display',
                            valueField: 'value',
                            name: 'name',
                            allowBlank: false,
                            editable: false,
                            value: me.record ? me.record.get('name') : null,
                            fieldLabel: i18n.getKey('name'),
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value', 'display'
                                ],
                                data: enableProperty
                            })
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'value',
                            allowBlank: false,
                            minValue: 0,
                            name: 'value',
                            hidden: me.inputTypeClazz == 'DiscreteValueConstraint' ? true : false,
                            disabled: me.inputTypeClazz == 'DiscreteValueConstraint' ? true : false,
                            value: value,
                            allowDecimals: false,//禁用小数
                            fieldLabel: i18n.getKey('value')
                        },
                        {
                            xtype: 'multicombobox',
                            itemId: 'options',
                            name: 'value',
                            allowBlank: false,
                            editable: false,
                            multiSelect: true,
                            hidden: me.inputTypeClazz == 'DiscreteValueConstraint' ? false : true,
                            disabled: me.inputTypeClazz == 'DiscreteValueConstraint' ? false : true,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {
                                        name: 'id',
                                        type: 'string'
                                    },
                                    'displayValue'
                                ],
                                data: me.options
                            }),
                            displayField: 'displayValue',
                            valueField: 'id',
                            value: value,
                            fieldLabel: i18n.getKey('value')
                        }
                    ]
                }
                ];
                me.callParent();
            },
            bbar: [
                '->',
                {
                    xtype: 'button',
                    iconCls: 'icon_agree',
                    text: i18n.getKey('confirm'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.getComponent('form');
                        var name = form.getComponent('name');
                        var value = form.getComponent('value');
                        var method = 'POST';
                        var url = adminPath + 'api/skuAttributePropertyValueController';
                        if (win.record) {
                            url = adminPath + 'api/skuAttributePropertyValueController/' + win.record.getId();
                            method = 'PUT';
                        }
                        if (form.isValid()) {
                            var data = {
                                name: form.getValues().name,
                                value: form.getValues().value,
                                skuAttributeId: me.skuAttributeId,
                                clazz: 'com.qpp.cgp.domain.attributeconfig.SkuAttributePropertyValue'
                            };
                            if (inputTypeClazz == 'DiscreteValueConstraint') {
                                data.value = '[' + data.value + ']';
                            }
                            Ext.Ajax.request({
                                url: url,
                                method: method,
                                jsonData: data,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('success'), function () {
                                            win.close();
                                            win.grid.store.load();
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
                        }
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_cancel',
                    text: i18n.getKey('cancel'),
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }
            ]
        });
        var store = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributePropertyStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'skuAttributeId',
                    type: 'number',
                    value: me.skuAttributeId
                }])
            }
        });
        me.items = [
            {
                xtype: 'grid',
                store: store,
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 50,
                        tdCls: 'vertical-middle',
                        items: [
                            {
                                iconCls: me.isLock ? 'icon_query' : 'icon_edit icon_margin',
                                tooltip: me.isLock ? i18n.getKey('check') : 'Edit',
                                handler: function (gridView, rowIndex, colIndex, a, b, record) {
                                    Ext.create('localEditWindow', {
                                        title: i18n.getKey('edit') + i18n.getKey('skuAttributeProperty'),
                                        createOrEdit: 'create',
                                        record: record,
                                        inputTypeClazz: inputTypeClazz,
                                        grid: gridView.ownerCt,
                                        options: options
                                    }).show();
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                tooltip: 'Delete',
                                disabled: me.isLock,
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    var store = view.getStore();
                                    var constraintId = record.getId();
                                    Ext.Msg.confirm('提示', '确定删除？', callback);

                                    function callback(id) {
                                        if (id === 'yes') {
                                            Ext.Ajax.request({
                                                url: adminPath + 'api/skuAttributePropertyValueController/' + constraintId,
                                                method: 'DELETE',
                                                headers: {
                                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                                },
                                                success: function (response) {
                                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                                    if (responseMessage.success) {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                                                            store.load();
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
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        dataIndex: 'name',
                        flex: 1,
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('name')
                    },
                    {
                        dataIndex: 'value',
                        flex: 1,
                        tdCls: 'vertical-middle',
                        hidden: me.inputTypeClazz == 'DiscreteValueConstraint' ? true : false,
                        text: i18n.getKey('value')
                    },
                    {
                        dataIndex: 'value',
                        flex: 1,
                        tdCls: 'vertical-middle',
                        hidden: me.inputTypeClazz == 'DiscreteValueConstraint' ? false : true,
                        text: i18n.getKey('value'),
                        renderer: function (value, metadata, record) {
                            value = value.split(/\[|\]/)[1];
                            var value = value.split(',');
                            var result = [];
                            for (var i = 0; i < value.length; i++) {
                                for (var j = 0; j < options.length; j++) {
                                    if ((value[i]).toString() == (options[j].id).toString()) {
                                        result.push(options[j].name + '(' + options[j].id + ')' + '<br>')
                                    }
                                }
                            }
                            return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + result.toString() + '</div>';
                        }
                    }
                ],
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        disabled: me.isLock,
                        handler: function (btn) {
                            Ext.create('localEditWindow', {
                                title: i18n.getKey('create') + i18n.getKey('skuAttributeProperty'),
                                createOrEdit: 'create',
                                record: null,
                                inputTypeClazz: inputTypeClazz,
                                grid: btn.ownerCt.ownerCt,
                                options: options
                            }).show();
                        }
                    }
                ],
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: store,
                    emptyMsg: i18n.getKey('noData')
                })
            }
        ];
        me.callParent();

    }
})
