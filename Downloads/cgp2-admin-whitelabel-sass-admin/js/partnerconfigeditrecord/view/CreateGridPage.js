/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.partnerconfigeditrecord.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    store: null,
    block: 'orderinghistoryrecord',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('orderinghistoryrecord'),
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.partnerconfigeditrecord.controller.Controller'),
            defaults = Ext.create('CGP.partnerconfigeditrecord.defaults.PartnerconfigeditrecordDefaults'),
            {config, test} = defaults,
            {
                id
            } = config;

        me.config = {
            block: me.block,
            tbarCfg: {
                hidden: true,
            },
            gridCfg: {
                store: me.store,
                editAction: false,
                deleteAction: false,
                columns: [
                    {
                        text: i18n.getKey('partner'),
                        width: 200,
                        dataIndex: 'code',
                        sortable: true,
                    },
                    {
                        text: i18n.getKey('partner类型'),
                        width: 150,
                        dataIndex: 'partnerType',
                        sortable: true,
                        renderer: function (value) {
                            var valueGather = {
                                'EXTERNAL': '外部',
                                'INTERNAL': '内部'
                            };

                            return valueGather[value];
                        }
                    },
                    {
                        xtype: 'atagcolumn',
                        draggable: false,
                        resizable: false,
                        text: i18n.getKey('拼单配置修改记录'),
                        flex: 1,
                        dataIndex: 'id',
                        sortable: true,
                        getDisplayName: function (value) {
                            return value ? '<a href="#">' + i18n.getKey('查看') + '</a>' : '';
                        },
                        clickHandler: function (value, metadata, record) {
                            controller.createOrderingConfigRecord(value);
                        },
                    },
                ]
            },
            filterCfg: {
                items: [
                    {
                        xtype: 'textfield',
                        name: 'code',
                        itemId: 'code',
                        isLike: true,
                        fieldLabel: i18n.getKey('partner'),
                    },
                    {
                        xtype: 'combo',
                        name: 'partnerType',
                        itemId: 'partnerType',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        valueField: 'value',
                        displayField: 'display',
                        fieldLabel: i18n.getKey('partner类型'),
                        store: {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'INTERNAL',
                                    display: '内部',
                                },
                                {
                                    value: 'EXTERNAL',
                                    display: '外部',
                                },
                            ]
                        }
                    },
                ]
            }
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})