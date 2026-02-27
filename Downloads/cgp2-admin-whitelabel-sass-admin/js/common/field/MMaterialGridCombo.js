/**
 * Created by nan on 2021/7/30
 * 生产物料的gridCombo
 */
Ext.define('CGP.common.field.MMaterialGridCombo', {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.mmaterialgridcombo',
    allowBlank: false,
    displayField: '_id',
    valueField: '_id',
    multiSelect: false,
    editable: false,
    matchFieldWidth: false,
    canChangeMaterialType: false,
    defaultMaterialType: 'com.qpp.qris.eds.domain.material.MMU',//指定那种物料，mmu,mmt,DMU,
    //"com.qpp.qris.eds.domain.material.MMType"
    //'com.qpp.qris.eds.domain.dbom.material.DMU'
    //必须去自行确定set，get方法的内容
    diyGetValue: function () {

    },
    diySetValue: function () {

    },
    initComponent: function () {
        var me = this;
        var MMUStore = me.store = me.store || Ext.create('CGP.mmaterialprocess.mbom.store.MMaterial', {
            storeId: 'MMaterial'
        });
        me.gridCfg = {
            store: MMUStore,
            height: 300,
            width: 550,
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 40
                },
                {
                    text: i18n.getKey('id'),
                    width: 150,
                    tdCls: 'vertical-middle',
                    dataIndex: '_id'
                },
                {
                    text: i18n.getKey('description'),
                    width: 200,
                    tdCls: 'vertical-middle',
                    dataIndex: 'description'
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    xtype: 'gridcolumn',
                    flex: 1,
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer: function (value, metadata) {
                        var resultValue = value.split('.').pop();
                        return '<div style="color: green">' + i18n.getKey(resultValue) + '</div>';
                    }
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: MMUStore,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            }
        };
        me.filterCfg = {
            height: 80,
            layout: {
                type: 'column',
                columns: 2
            },
            defaults: {
                width: 250,
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id',
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }, {
                    name: 'clazz',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'clazz',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    isLike: false,
                    value: me.defaultMaterialType,
                    hidden: !me.canChangeMaterialType,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'com.qpp.qris.eds.domain.material.MMU',
                                display: i18n.getKey('MMU')
                            },
                            {
                                value: 'com.qpp.qris.eds.domain.material.MMType',
                                display: i18n.getKey('MMT')
                            },
                            {
                                value: 'com.qpp.qris.eds.domain.dbom.material.DMU',
                                display: i18n.getKey('DMU')
                            },
                        ]
                    }),
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            console.log(newValue)
                            if (newValue == 'com.qpp.qris.eds.domain.material.MMU') {
                                field.ownerCt.ownerCt.store.proxy.url = mBomApiPath + 'api/eds/materials';
                            } else if (newValue == 'com.qpp.qris.eds.domain.dbom.material.DMU') {
                                field.ownerCt.ownerCt.store.proxy.url = mBomApiPath + 'api/eds/management/dmu';
                            } else if (newValue == 'com.qpp.qris.eds.domain.dbom.material.MMType') {
                                field.ownerCt.ownerCt.store.proxy.url = mBomApiPath + 'api/eds/materials';
                            }
                        }
                    }
                }
            ]
        };
        me.callParent();
    }
})