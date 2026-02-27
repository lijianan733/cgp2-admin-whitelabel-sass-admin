/**
 * @author xiu
 * @date 2025/1/21
 */
Ext.define('CGP.extraorderreportforms.view.CreateEditPage', {
    extend: 'Ext.ux.ui.EditPage',
    alias: 'widget.createEditPage',
    block: 'extraorderreportforms',
    gridPage: 'main.html',
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.extraorderreportforms.controller.Controller'),
            defaults = Ext.create('CGP.extraorderreportforms.defaults.ExtraorderreportformsDefaults'),
            {config, test} = defaults,
            {
                id
            } = config;

        me.config = {
            block: me.block,
            formCfg: {
                model: 'CGP.extraorderreportforms.model.ExtraorderreportformsModel',
                remoteCfg: false,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'id',
                        itemId: 'id',
                        hidden: true,
                        fieldLabel: i18n.getKey('id'),

                    },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        itemId: 'clazz',
                        hidden: true,
                        fieldLabel: i18n.getKey('clazz'),
                        value: 'com.qpp.cgp.domain.common.color.RgbColor'
                    },
                    {
                        xtype: 'textfield',
                        name: 'type',
                        itemId: 'type',
                        hidden: false,
                        fieldLabel: i18n.getKey('type'),

                    },
                    {
                        xtype: 'textfield',
                        name: 'name',
                        itemId: 'name',
                        hidden: false,
                        fieldLabel: i18n.getKey('name'),

                    },
                    {
                        xtype: 'textfield',
                        name: 'isBoolean',
                        itemId: 'isBoolean',
                        hidden: false,
                        fieldLabel: i18n.getKey('isBoolean'),

                    },
                    {
                        xtype: 'textfield',
                        name: 'hua',
                        itemId: 'hua',
                        hidden: false,
                        fieldLabel: i18n.getKey('hua'),

                    },
                    {
                        xtype: 'combo',
                        name: 'type',
                        itemId: 'type',
                        editable: false,
                        fieldLabel: i18n.getKey('type'),
                        store: Ext.create('Ext.data.Store', {
                            fields: ['key', 'value'],
                            data: [
                                {
                                    key: 'chx',
                                    value: 'chx'
                                }
                            ]
                        }),
                        displayField: 'key',
                        valueField: 'value',
                    },
                    {
                        xtype: 'gridfieldwithcrudv2',
                        hideLabel: true,
                        allowBlank: false,
                        isValidForItems: true,
                        itemId: 'parameter',
                        name: 'parameter',
                        width: 800,
                        fieldLabel: i18n.getKey('grid'),
                        winConfig: {
                            formConfig: {
                                width: 500,
                                defaults: {
                                    width: 450
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: '_id',
                                        itemId: '_id',
                                        allowBlank: false,
                                        fieldLabel: i18n.getKey('id')
                                    },
                                ]
                            },
                        },
                        gridConfig: {
                            tbar: {
                                hiddenButtons: ['read', 'clear', 'delete', 'config', 'help', 'export', 'import'],
                            },
                            store: Ext.create('Ext.data.Store', {
                                fields: ['_id'],
                                data: [
                                    {
                                        _id: '1234'
                                    }
                                ]
                            }),
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    tdCls: 'vertical-middle',
                                    width: 45
                                },
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: '_id',
                                    tdCls: 'vertical-middle'
                                },
                            ],
                        },
                    }
                ]
            },
            diyGetValue: function () {
                var me = this,
                    items = me.items.items,
                    result = {};
                items.forEach(item => result[item.itemId] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                return result;
            },
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})