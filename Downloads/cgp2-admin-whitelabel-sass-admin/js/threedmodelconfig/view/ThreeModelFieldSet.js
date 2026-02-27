/**
 * Created by admin on 2019/12/21.
 */
Ext.define('CGP.threedmodelconfig.view.ThreeModelFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    colspan: 2,
    height: 110,
    productId: null,
    title: i18n.getKey('model'),
    defaults: {
        /*
         labelAlign: 'top',
         */
        allowBlank: false,
        width: 250,
        margin: '10 10 0 10'
    },
    layout: {
        type: 'table',
        columns: 3
    },
    style: {
        borderRadius: '10px'
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this;
        var items = me.items.items;
        ;
        var isValid = true;
        items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            result[item.getName()] = item.getValue();
        }
        //result.clazz = 'com.qpp.cgp.domain.attributeproperty.PropertyPathDto'
        return result
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data[item.getName()]);
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'x',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('x'),
                itemId: 'x'
            }, {
                name: 'y',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('y'),
                itemId: 'y'
            }, {
                name: 'z',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('z'),
                itemId: 'z'
            }, {
                name: 'name',
                xtype: 'combo',
                store: me.threeDModeStore,
                displayField: 'name',
                valueField: 'name',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                listeners: {
                    afterrender: function (combo) {
                        var store = combo.getStore();
                        store.on('load', function () {
                            if (!combo.getValue()){
                                combo.select(store.getAt(0));
                            }else{
                                combo.setValue(combo.getValue());
                            }

                        });
                    }
                }
            }, {
                name: 'loadType',
                xtype: 'combo',
                displayField: 'name',
                valueField: 'value',
                queryMode: 'local',
                store: Ext.create('Ext.data.Store',{
                    fields: ['name','value'],
                    data: [{
                        name: '多模型-多材质',
                        value: 'models'
                    },{
                        name: '单模型-多材质',
                        value: 'materials'
                    }]
                }),
                fieldLabel: i18n.getKey('loadType'),
                itemId: 'loadType'
            }, {
                name: 'clazz',
                xtype: 'textfield',
                value: 'com.qpp.cgp.domain.product.config.model.ThreeDModel',
                hidden: true,
                itemId: 'clazz'
            }, {
                name: 'modelsColor',
                xtype: 'textfield',
                hideTrigger: true,
                minValue: 0,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                value: '0x9999cc',
                fieldLabel: i18n.getKey('modelsColor'),
                itemId: 'modelsColor'
            }/*, {
                xtype: 'fileuploadv2',
                name: 'location',
                colspan: 2,
                width: 450,
                itemId: 'location',
                formFileName: 'file',
                aimFileServer: imageServer + 'upload/static?dirName=model-preview/data/image',//指定文件夹
                fieldLabel: i18n.getKey('location'),
            }*//*, {
                xtype: 'gridfieldwithcrudv2',
                fieldLabel: i18n.getKey('materials'),
                itemId: 'materials',
                name: 'materials',
                allowBlank: true,
                colspan: 3,
                minHeight: 100,
                width: 700,
                formConfig: {
                    width: 500,
                    defaults: {
                        width: 450
                    }
                },
                //hidden: true,
                //disabled: true,
                gridConfig: {
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'imageName', type: 'string'},
                            {name: 'type', type: 'string'}
                        ],
                        data: []
                    }),
                    columns: [
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            tdCls: 'vertical-middle'
                        },
                        {
                            text: i18n.getKey('imageName'),
                            dataIndex: 'imageName',
                            tdCls: 'vertical-middle'
                        }, {
                            text: i18n.getKey('type'),
                            dataIndex: 'type',
                            tdCls: 'vertical-middle'
                        },
                    ]
                },
                formItems: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        itemId: 'name',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('displayName'),
                    },
                    {
                        xtype: 'fileuploadv2',
                        name: 'imageName',
                        itemId: 'imageName',
                        formFileName: 'file',
                        aimFileServer: imageServer + 'upload/static?dirName=model-preview/data/image',//指定文件夹
                        fieldLabel: i18n.getKey('imageName'),
                    },
                    {
                        xtype: 'combo',
                        editable: false,
                        name: 'type',
                        itemId: 'type',
                        valueField: 'value',
                        displayField: 'display',
                        value: 'image',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [{
                                value: 'image',
                                display: 'image'
                            }, {
                                value: 'svg',
                                display: 'svg'
                            }]
                        }),
                        fieldLabel: i18n.getKey('type'),
                    }
                ],
            }*/
        ];
        me.callParent(arguments);
    }

});
