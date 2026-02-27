/**
 * Created by nan on 2017/12/12.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.model.JsonCustomize',
    'CGP.attribute.store.LocalAttributeOption',
    'CGP.common.field.RtTypeSelectField'
]);
Ext.onReady(function () {
    var recordId = parseInt(JSGetQueryString('id'));
    var editOrNew = JSGetQueryString('editOrNew');
    var productBomConfigId = JSGetQueryString('productBomConfigId');
    var productConfigDesignId = parseInt(JSGetQueryString('productConfigDesignId'));
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.controller.Controller');
    var productMaterialViewTypeStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.store.MaterialViewType', {
        params: {
            filter: '[{"name":"productConfigDesignId","value":' + productConfigDesignId + ',"type":"number"}]'
        }
    });
    var operatorStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.OperatorStore', {
        params: {
            filter: '[{"name": "sourceType","type": "string","value": "%Target%"}]'
        }
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var store = '';
    var form = Ext.create('Ext.form.Panel', {

        defaults: {
            margin: 5,
            width: 375,
            labelWidth: 100,
            allowBlank: false,
            labelAlign: 'right',
        },
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    if (form.isValid()) {
                        var data = form.getValue();
                        var mask = form.setLoading();
                        controller.saveJsonCustomize(data, mask, form);
                    }
                }
            }
        ],
        items: [
            {
                xtype: 'numberfield',
                name: '_id',
                itemId: '_id',
                fieldLabel: 'id',
                editable: false,
                hidden: (recordId ? false : true),
                disabled: true,
                hideTrigger: true,
                allowBlank: true,
                fieldStyle: 'background-color: silver'
            },
            {
                xtype: 'numberfield',
                name: 'productConfigDesignId',
                itemId: 'productConfigDesignId',
                fieldLabel: 'productConfigDesignId',
                editable: false,
                hidden: true,
                fieldStyle: 'background-color: silver',
                allowBlank: true,
                value: productConfigDesignId
            },
            {
                xtype: 'gridcombo',
                editable: false,
                fieldLabel: i18n.getKey('productMaterialViewTypeId'),
                name: 'productMaterialViewTypeId',
                itemId: 'productMaterialViewTypeId',
                haveReset: true,
                displayField: 'displayName',
                valueField: 'productMaterialViewTypeId',//'productMaterialViewTypeId',
                matchFieldWidth: false,
                store: productMaterialViewTypeStore,
                infoUrl: adminPath + 'api/productMaterialViewTypes?page=1&limit=25&filter=' + Ext.JSON.encode(
                    [
                        {
                            name: "productMaterialViewTypeId",
                            type: "string",
                            value: '%{productMaterialViewTypeId}%'
                        },
                        {
                            name: "productConfigDesignId",
                            type: "number",
                            value: productConfigDesignId
                        }
                    ]
                ),
                gridCfg: {
                    store: productMaterialViewTypeStore,
                    width: 450,
                    maxHeight: 280,
                    columns: [
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id')
                        }, {
                            dataIndex: 'name',
                            flex: 1,
                            text: i18n.getKey('name')
                        }, {
                            dataIndex: 'productMaterialViewTypeId',
                            flex: 1,
                            text: i18n.getKey('productMaterialViewTypeId')
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: productMaterialViewTypeStore,
                        emptyMsg: i18n.getKey('noData')
                    }),
                },
                listeners: {
                    change: function (comp, newValue, oldValue) {

                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data]);
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getSubmitValue()[0];

                },
            },
            {
                xtype: 'gridcombo',
                editable: false,
                fieldLabel: i18n.getKey('operatorConfigId'),
                name: 'operatorConfigId',
                itemId: 'operatorConfigId',
                haveReset: true,
                displayField: 'displayName',
                valueField: '_id',
                matchFieldWidth: false,
                store: operatorStore,
                infoUrl: adminPath + 'api/operatorcontroller?page=1&limit=25&filter=' + Ext.JSON.encode([
                    {
                        "name": "sourceType",
                        "type": "string",
                        "value": '%Target%'
                    },
                    {
                        "name": "_id",
                        "type": "number",
                        "value": '{id}'
                    }]),
                filterCfg: {
                    height: 80,
                    width: '100%',
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        style: 'margin-right:10px; margin-top : 5px;',
                        labelWidth: 70,
                        width: 200,
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id'
                        },
                        {
                            name: 'code',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('code'),
                            itemId: 'code'
                        },
                        {
                            name: 'description',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('description'),
                            itemId: 'description'
                        }
                    ]
                },
                gridCfg: {
                    store: operatorStore,
                    width: 700,
                    maxHeight: 280,
                    columns: [
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id')
                        },
                        {
                            dataIndex: 'code',
                            flex: 1,
                            text: i18n.getKey('code')
                        },
                        {
                            dataIndex: 'description',
                            flex: 1,
                            text: i18n.getKey('description')
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: operatorStore,
                        emptyMsg: i18n.getKey('noData')
                    },
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data]);
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getSubmitValue()[0];
                },
            },
            {
                xtype: 'rttypeselectfield',
                fieldLabel: i18n.getKey('designDataTypeSchema'),
                name: 'designDataTypeSchema',
                itemId: 'designDataTypeSchema',
                useRawValue: true,
                allowBlank: true,
            },
            {
                xtype: 'textareafield',
                fieldLabel: i18n.getKey('designDataJsonSchema'),
                name: 'designDataJsonSchema',
                itemId: 'designDataJsonSchema',
                allowBlank: true,
                grow: true,
                rows: 10
            }
        ],
        listeners: {
            afterrender: function () {
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        },
        isValid: function () {
            var me = this, isValid = true;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (!item.allowBlank && !item.isValid()) {
                    isValid = false;
                    return false;
                }
            }
            return isValid;
        },
        getValue: function () {
            var me = this, data = {clazz: 'com.qpp.cgp.domain.product.config.customize.JsonCustomizeConfig'};
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.diyGetValue) {
                    data[item.name] = item.diyGetValue();
                } else {
                    data[item.name] = item.getValue();
                }
            }
            return data;
        },
        setValue: function (data) {
            var me = this;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                var name = item.name;
                var value = data[name];

                if (item.diySetValue) {
                    item.diySetValue(value);
                } else if (item.xtype == 'uxtreecombohaspaging') {
                    if (value) {
                        item.setInitialValue(value);
                    }
                } else {
                    item.setValue(value);
                }
            }
        }
    });
    if (recordId) {
        var jsonCustomizModel = Ext.ModelManager.getModel('CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.model.JsonCustomize');
        jsonCustomizModel.load(recordId, {
            failure: function (record, operation) {
                //do something if the load failed
            },
            success: function (record, operation) {
                form.setValue(record.data);
            }
        })

    }
    page.add(form);

});
