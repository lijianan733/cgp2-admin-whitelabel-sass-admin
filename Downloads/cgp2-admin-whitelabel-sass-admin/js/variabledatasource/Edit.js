/**
 * Created by nan on 2019/12/12.
 * 现在约定，固定数量使用expression字段
 * 范围类型使用，quantityRange对象
 */
Ext.Loader.syncRequire([
    'CGP.variabledatasource.model.VariableDataSourceModel',
    'CGP.common.field.RtTypeSelectField'
]);
Ext.onReady(function () {
    var recordId = JSGetQueryString('_id');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var tbarCfg = {
        itemId: 'toolbar',
        btnCreate: {
            handler: function (btn) {
                btn.setDisabled(true);
                var form = btn.ownerCt.ownerCt;
                form.recordId = null;
                form.createOrEdit = 'create';
                top.Ext.getCmp('tabs').items.items[2].setTitle(i18n.getKey('create') + '_' + 'variableDataSource')
            }
        },
        btnCopy: {
            disabled: true,
            handler: function () {
            }
        },
        btnReset: {
            handler: function (btn) {
                var form = btn.ownerCt.ownerCt;
                form.setValue(form.data);
            }
        },
        btnSave: {
            handler: function (btn) {
                var form = btn.ownerCt.ownerCt;
                if (form.isValid()) {
                    var jsonData = form.getValue();
                    var url = adminPath + 'api/variableDataSources';
                    var method = 'POST';
                    if (form.createOrEdit == 'edit') {
                        url = adminPath + 'api/variableDataSources/' + form.recordId;
                        method = 'PUT';
                    }
                    Ext.Ajax.request({
                        url: url,
                        method: method,
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        jsonData: jsonData,
                        success: function (response) {
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            if (responseMessage.success) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                    form.recordId = responseMessage.data._id;
                                    form.createOrEdit = 'edit';
                                    form.data = responseMessage.data;
                                    var toolbar = form.getDockedItems('toolbar[dock="top"]')[0];
                                    var createBtn = toolbar.getComponent('btnCreate');
                                    createBtn.setDisabled(false);
                                    top.Ext.getCmp('tabs').getComponent('variableDataSource_edit').setTitle(i18n.getKey('edit') + '_' + 'variableDataSource_' + form.recordId);
                                });
                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        },
                        failure: function (response) {
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    })
                }
            }
        },
        btnGrid: {
            handler: function () {
                JSOpen({
                    id: 'variableDataSourcepage',
                    url: path + 'partials/variabledatasource/main.html'
                });
            }
        },
        btnConfig: {
            disabled: true,
        },
        btnHelp: {
            handler: function () {
            }
        }
    };
    var form = Ext.widget('form', {
        defaults: {
            margin: '10 20 5 20',
            width: 600,
        },
        createOrEdit: recordId ? 'edit' : 'create',
        recordId: recordId,
        tbar: Ext.create('Ext.ux.toolbar.Edit', tbarCfg),
        items: [
            {
                name: 'clazz',
                fieldLabel: i18n.getKey('type'),
                itemId: 'clazz',
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: 'com.qpp.cgp.domain.bom.datasource.LocalDataSource',
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value',
                        'display'
                    ],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.bom.datasource.ImageGroupDataSource',
                            display: 'ImageGroupDataSource'
                        },
                        {
                            value: 'com.qpp.cgp.domain.bom.datasource.LocalDataSource',
                            display: 'LocalDataSource'
                        }
                    ]
                }),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var name = combo.ownerCt.getComponent('name');
                        var rtType = combo.ownerCt.getComponent('rtType');
                        if (newValue != 'com.qpp.cgp.domain.bom.datasource.ImageGroupDataSource') {
                            name.hide();
                            name.setDisabled(true);
                            rtType.show();
                            rtType.setDisabled(false);
                        } else {
                            rtType.hide();
                            rtType.setDisabled(true);
                            name.show();
                            name.setDisabled(false);
                        }
                    }
                }
            },
            {
                name: 'name',
                hidden: true,
                disabled: true,
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },
            {
                xtype: 'rttypeselectfield',
                fieldLabel: i18n.getKey('rtType'),
                itemId: 'rtType',
                name: 'rtType',
                useRawValue: true,
                matchFieldWidth:true,
                allowBlank: true,
            },
            {
                name: 'selector',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('selector'),
                itemId: 'selector'
            },
            {
                xtype: 'uxfieldset',
                name: 'quantityRange',
                title: i18n.getKey('上传元素') + i18n.getKey('qty'),
                defaults: {
                    margin: '10 0 10 50',
                    allowBlank: true,
                    width: '100%',
                },
                legendItemConfig: {
                    disabledBtn: {
                        hidden: false,
                        disabled: false,
                        isUsable: false,//初始化时，是否是禁用
                    }
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('value') + i18n.getKey('type'),
                        xtype: 'combo',
                        valueField: 'value',
                        itemId: 'rangeType',
                        editable: false,
                        displayField: 'name',
                        queryMode: 'local',
                        value: 'FIX',
                        name: 'rangeType',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'name', 'value'
                            ],
                            data: [
                                {name: '固定值', value: 'FIX'},
                                {name: '范围值', value: 'RANGE'}
                            ]
                        }),
                        mapping: {
                            common: ['rangeType', 'clazz'],
                            FIX: ['expression'],
                            RANGE: ['minExpression', 'maxExpression']
                        },
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var fieldContainer = comp.ownerCt;
                                for (var i = 1; i < fieldContainer.items.items.length; i++) {
                                    var item = fieldContainer.items.items[i];
                                    if (Ext.Array.contains(comp.mapping['common'], item.itemId)) {

                                    } else if (Ext.Array.contains(comp.mapping[newValue], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                        },
                    },
                    {
                        fieldLabel: i18n.getKey('clazz'),
                        hidden: true,
                        itemId: 'clazz',
                        value: 'com.qpp.cgp.domain.bom.QuantityRange',
                        xtype: 'textfield',
                        name: 'clazz'
                    },
                    {
                        fieldLabel: i18n.getKey('minValue') + i18n.getKey('expression'),
                        xtype: 'textarea',
                        hidden: true,
                        allowBlank: false,
                        disabled: true,
                        grow: true,
                        itemId: 'minExpression',
                        name: 'minExpression'
                    },
                    {
                        fieldLabel: i18n.getKey('maxValue') + i18n.getKey('expression'),
                        xtype: 'textarea',
                        hidden: true,
                        disabled: true,
                        grow: true,
                        allowBlank: false,
                        itemId: 'maxExpression',
                        name: 'maxExpression'
                    },
                    {
                        name: 'expression',
                        itemId: 'expression',
                        xtype: 'textarea',
                        allowBlank: false,
                        grow: true,
                        fieldLabel: i18n.getKey('expression'),
                    }
                ]
            }],
        setValue: function (data) {
            var form = this;
            form.data = data;
            console.log(data);
            if (data.expression) {
                data.quantityRange = {
                    rangeType: 'FIX',
                    expression: data.expression,
                    clazz: "com.qpp.cgp.domain.bom.QuantityRange"
                }
            }
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                if (data[item.getName()]) {
                    if (item.xtype == 'uxtreecombohaspaging') {
                        item.setInitialValue(data[item.getName()]._id);
                    } else {
                        item.setValue(data[item.getName()]);
                    }
                }
            }
        },
        getValue: function () {
            var form = this;
            var result = {};
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                result[item.getName()] = item.getValue();
            }
            if (result.quantityRange && result.quantityRange.rangeType == 'FIX') {
                result.expression = result.quantityRange.expression;
                delete result.quantityRange;
            }
            return result;
        },
        listeners: {
            afterrender: function (form) {
                if (form.recordId) {
                    CGP.variabledatasource.model.VariableDataSourceModel.load(form.recordId, {
                        scope: this,
                        failure: function (record, operation) {
                            //do something if the load failed
                        },
                        success: function (record, operation) {
                            //do something if the load succeeded
                            form.setValue(record.getData());
                        },
                        callback: function (record, operation) {
                            //do something whether the load succeeded or failed
                        }
                    });
                }
            }
        }
    });
    page.add(form);
})
