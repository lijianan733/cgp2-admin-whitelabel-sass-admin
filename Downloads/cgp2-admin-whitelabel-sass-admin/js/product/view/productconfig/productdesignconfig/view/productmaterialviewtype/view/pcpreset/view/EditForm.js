/**
 * Created by nan on 2021/8/24
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.IndexMappingFieldContainer',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.PcResourceApplyConfig',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.SpecialPcResourceApplyConfig',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.IndexMappingFieldContainer'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.EditForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.editform',
    pcsData: null,
    recordData: null,
    isValidForItems: true,
    defaults: {
        margin: '5 25 10 25',
        width: 450,
        allowBlank: false,
    },
    mvtId: null,
    mvtType: null,
    listeners: {
        afterrender: function () {
            if (this.recordData) {
                this.setValue(this.recordData)
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'combo',
                name: 'clazz',
                itemId: 'clazz',
                editable: false,
                fieldLabel: i18n.getKey('type'),
                valueField: 'value',
                displayField: 'display',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.theme.SinglePcResourceContent',
                            display: '每一个PC的同一位置应用同一资源'
                        },
                        {
                            value: 'com.qpp.cgp.domain.theme.RandomPcResourceContent',
                            display: '随机资源应用到PC的同一位置'
                        },
                        {
                            value: 'com.qpp.cgp.domain.theme.StaticMultiPcResourceContent',
                            display: '自定义规则指定PC位置和资源'
                        }
                    ]
                },
                value: 'com.qpp.cgp.domain.theme.SinglePcResourceContent',
                mapping: {
                    common: ['_id', 'clazz', 'name', 'mvt'],
                    'com.qpp.cgp.domain.theme.RandomPcResourceContent': ['applyConfig', 'businessLib'],
                    'com.qpp.cgp.domain.theme.SinglePcResourceContent': ['pcResourceApplyConfig'],
                    'com.qpp.cgp.domain.theme.StaticMultiPcResourceContent': ['indexConfig', 'pcResourceApplyConfigs']
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        if (newValue) {
                            for (var i = 0; i < form.items.items.length; i++) {
                                var item = form.items.items[i];
                                if (Ext.Array.contains(field.mapping['common'], item.itemId)) {

                                } else {
                                    var isContainer = Ext.Array.contains(field.mapping[newValue], item.itemId);
                                    item.setVisible(isContainer);
                                    item.setDisabled(!isContainer);
                                }
                            }
                        }
                        if (newValue == 'com.qpp.cgp.domain.theme.RandomPcResourceContent') {
                            var applyConfig = form.getComponent('applyConfig');

                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                name: '_id',
                itemId: '_id',
                hidden: true,
                fieldLabel: i18n.getKey('id'),
                allowBlank: true,
            },
            {
                xtype: 'textfield',
                name: 'name',
                itemId: 'name',
                fieldLabel: i18n.getKey('name'),
            },
            {
                xtype: 'textfield',
                name: 'mvt',
                itemId: 'mvt',
                hidden: true,
                fieldLabel: i18n.getKey('mvt'),
                value: me.mvtId + '_' + me.mvtType,
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(data._id + '_' + data.clazz);
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue();
                    if (data) {
                        var id = data.split('_')[0];
                        var clazz = data.split('_')[1];
                        return {
                            _id: id,
                            clazz: clazz
                        }
                    }
                }
            },
            {
                xtype: 'specialpcresourceapplyconfig',
                name: 'applyConfig',
                itemId: 'applyConfig',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('applyConfig'),
                pcsData: me.pcsData
            },
            {
                xtype: 'pcresourceapplyconfig',
                name: 'pcResourceApplyConfig',
                itemId: 'pcResourceApplyConfig',
                fieldLabel: i18n.getKey('applyConfig'),
                pcsData: me.pcsData
            },
            {
                xtype: 'indexmappingfieldcontainer',
                name: 'indexConfig',
                itemId: 'indexConfig',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('indexConfig'),
            },
            {
                xtype: 'gridfieldwithcrudv2',
                name: 'pcResourceApplyConfigs',
                itemId: 'pcResourceApplyConfigs',
                fieldLabel: i18n.getKey('pcResourceApplyConfigs'),
                minHeight: 100,
                labelAlign: 'top',
                hidden: true,
                disabled: true,
                gridConfig: {
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'businessLib', type: 'object'},
                            {name: 'clazz', type: 'string'},
                            {name: 'convertConfig', type: 'object'},//没用到
                            {name: 'intent', type: 'object'},
                            {name: 'resource', type: 'object'},
                            {name: 'resourceBuilderConfig', type: 'object'},
                            {name: 'targetSelector', type: 'string'},
                        ],
                        data: []
                    }),
                    columns: [
                        {
                            text: i18n.getKey('目标位置'),
                            dataIndex: 'targetSelector',
                            flex: 1,
                            renderer: function (value) {
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('resources'),
                            dataIndex: 'resource',
                            flex: 1,
                            renderer: function (value) {
                                return JSCreateHTMLTable([
                                    {
                                        title: i18n.getKey('resources') + i18n.getKey('type'),
                                        value: value.clazz.split('.').pop()
                                    },
                                    {
                                        title: i18n.getKey('id'),
                                        value: value._id
                                    }
                                ])
                            }
                        }
                    ]
                },
                winConfig: {
                    setValueHandler: function (data) {
                        var win = this;
                        var form = win.getComponent('form');
                        var newData = {};
                        newData.applyConfig = data;
                        form.setValue(newData);
                    },
                    formConfig: {
                        isValid: function () {
                            var me = this;
                            var isValid = true;
                            for (var i = 0; i < me.items.items.length; i++) {
                                if (me.items.items[i].isValid() == false) {
                                    isValid = false;
                                }
                            }
                            return isValid;
                        },
                        saveHandler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            if (form.isValid()) {
                                var data = {};
                                data = form.getValue();
                                data = data.applyConfig;
                                console.log(data);
                                if (win.createOrEdit == 'create') {
                                    win.outGrid.store.add(data);
                                } else {
                                    for (var i in data) {
                                        win.record.set(i, data[i]);
                                    }
                                }
                                win.close();
                            }
                        },
                        width: 500,
                        items: [
                            {
                                xtype: 'pcresourceapplyconfig',
                                name: 'applyConfig',
                                itemId: 'applyConfig',
                                width: '100%',
                                fieldLabel: i18n.getKey('applyConfig'),
                                pcsData: me.pcsData,
                                defaults: {
                                    width: '100%',
                                },
                            }
                        ]
                    }
                }
            },
        ];
        me.callParent();
    }
})