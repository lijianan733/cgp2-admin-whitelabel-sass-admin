/**
 *详细页
 **/
Ext.define('CGP.buildermanage.view.BaseInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infodetail',

    padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 450
    },
    bodyStyle: 'border-top:0;border-color:white;',
    header: false,
    itemId: 'baseInfo',

    initComponent: function () {
        var me = this;
        me.items = [{
            fieldLabel: i18n.getKey('builder')+i18n.getKey('name'),
            name: 'builderName',
            xtype: 'textfield',
            allowBlank: false,
            //hidden: true,
            itemId: 'builderName'
        },
            {
                name: 'builderVersion',
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('version'),
                itemId: 'version'
            }, {
                fieldLabel: i18n.getKey('description'),
                name: 'description',
                xtype: 'textarea',
                //hidden: true,
                itemId: 'description'
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'schemaVersion',
                fieldLabel: i18n.getKey('相关配置的支持版本'),
                itemId: 'schemaVersion',
                labelAlign: 'top',
                items: [
                    {
                        hidden: true,
                        value: 'com.qpp.cgp.domain.product.config.v2.builder.SchemaVersionConfig',
                        xtype: 'textfield',
                        name: 'clazz',
                        diySetValue: function () {
                            //调用空白的设置值处理，使其值不变

                        },
                    },
                    {
                        fieldLabel: i18n.getKey('builderView支持版本'),
                        name: 'supportBuilderViewSchemaVersion',
                        itemId: 'supportBuilderViewSchemaVersion',
                        xtype: 'multicombobox',
                        editable: false,
                        width: 400,
                        haveReset: true,
                        multiSelect: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'V1',
                                    display: 'V1'
                                }, {
                                    value: 'V2',
                                    display: 'V2'
                                },{
                                    value: 'V3',
                                    display: 'V3'
                                }
                            ]
                        }),
                        valueField: 'value',
                        displayField: 'display'
                    },
                    {
                        fieldLabel: i18n.getKey('导航配置支持版本'),
                        name: 'supportNavigationSchemaVersion',
                        itemId: 'supportNavigationSchemaVersion',
                        xtype: 'multicombobox',
                        editable: false,
                        width: 400,
                        haveReset: true,
                        multiSelect: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'V1',
                                    display: 'V1'
                                }, {
                                    value: 'V2',
                                    display: 'V2'
                                },{
                                    value: 'V3',
                                    display: 'V3'
                                }
                            ]
                        }),
                        valueField: 'value',
                        displayField: 'display'
                    }
                ]
            }];

        me.title = i18n.getKey('information');

        me.callParent(arguments);

    },
    /*    refreshData: function (data) {
            var me = this;
            Ext.Array.each(me.items.items, function (item) {
                if (item.name == 'parentId') {
                    if (data.parentMaterialType) {
                        item.setValue(data.parentMaterialType['_id']);
                        item.setVisible(true);
                    }
                } else if (item.name == 'type') {
                    item.setValue(data.clazz.split('.').pop());
                } else {
                    if(!Ext.isEmpty(data[item.name])){
                        item.setValue(data[item.name]);
                    }
                }
            });

        },*/
    getValue: function () {
        var me = this;
        var data = {};
        Ext.Array.each(me.items.items, function (item) {
            data[item.name] = item.getValue();
        });
        return data;
    }


});
