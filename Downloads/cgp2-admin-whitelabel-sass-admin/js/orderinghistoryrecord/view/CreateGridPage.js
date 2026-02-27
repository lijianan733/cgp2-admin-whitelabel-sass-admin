/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.orderinghistoryrecord.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    store: null,
    block: 'orderinghistoryrecord',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('orderinghistoryrecord'),
    getStatus: function (orders) {
        const statusGather = [];
        orders.forEach(item => {
            const {success} = item;
            statusGather.push(success);
        })

        // 判断数组是否全为 true
        const allTrue = statusGather.every(status => status === true);

        // 判断数组是否全为 false
        const allFalse = statusGather.every(status => status === false);

        // 判断数组是否部分为 true
        const partialTrue = !allTrue && !allFalse;

        if (allTrue) {
            return 'all';
        } else if (partialTrue) {
            return 'part';
        } else {
            return 'none';
        }
    },
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.orderinghistoryrecord.controller.Controller'),
            defaults = Ext.create('CGP.orderinghistoryrecord.defaults.OrderinghistoryrecordDefaults'),
            partnerStore = Ext.create('CGP.order.store.PartnerStore'),
            {config, test} = defaults,
            {
                id
            } = config;

        me.config = {
            block: me.block,
            tbarCfg: {
                hidden: true,
                disabledButtons: ['config'],
            },
            gridCfg: {
                store: me.store,
                editAction: false,
                deleteAction: false,
                columns: [
                    {
                        text: i18n.getKey('id'),
                        dataIndex: 'id',
                        width: 150,
                    },
                    {
                        text: i18n.getKey('拼单时间'),
                        width: 150,
                        dataIndex: 'submitTime',
                        sortable: true,
                        renderer: function (value, metaData, record) {
                            var time = new Date(controller.convertToZeroTimeZone(value)).getTime();
                            return controller.getEndTime(time);
                        }
                    },
                    {
                        text: i18n.getKey('partner'),
                        width: 200,
                        dataIndex: 'partnerCode',
                        sortable: true
                    },
                    {
                        text: i18n.getKey('status'),
                        width: 120,
                        dataIndex: 'orders',
                        sortable: true,
                        renderer: function (value, metaData, record) {
                            var status = value.length ? me.getStatus(value) : 'none',
                                valueGather = {
                                    'all': {
                                        color: 'green',
                                        text: '全部成功',
                                    },
                                    'part': {
                                        color: 'orange',
                                        text: '部分成功',
                                    },
                                    'none': {
                                        color: 'red',
                                        text: '全部失败',
                                    }
                                },
                                {color, text} = valueGather[status];

                            return JSCreateFont(color, true, text);
                        }
                    },
                    {
                        text: i18n.getKey('拼单类型'),
                        width: 120,
                        dataIndex: 'bulkOrderType',
                        sortable: true,
                        renderer: function (value, metaData, record) {
                            var valueGather = {
                                    PERIOD: {
                                        color: 'green',
                                        text: '自动拼单',
                                    },
                                    DIRECT: {
                                        color: 'green',
                                        text: '直接下单',
                                    },
                                    MANUAL: {
                                        color: 'green',
                                        text: '手动拼单',
                                    }
                                },
                                {color, text} = valueGather[value];

                            return JSCreateFont(color, true, text);
                        }
                    },
                    {
                        text: i18n.getKey('拼单用户'),
                        width: 150,
                        dataIndex: 'operatorEmail',
                        sortable: true
                    },
                    {
                        xtype: 'atagcolumn',
                        draggable: false,
                        resizable: false,
                        text: i18n.getKey('订单'),
                        dataIndex: 'orders',
                        flex: 1,
                        // dataIndex: 'operatorEmail',
                        sortable: true,
                        getDisplayName: function (value) {
                            return '<a href="#">' + i18n.getKey('查看') + '</a>'
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
                        name: '_id',
                        itemId: '_id',
                        isLike: false,
                        fieldLabel: i18n.getKey('id'),
                    },
                    {
                        xtype: 'gridcombo',
                        fieldLabel: i18n.getKey('partner'),
                        valueField: 'id',
                        displayField: 'code',
                        store: partnerStore,
                        itemId: 'partnerId',
                        name: 'partnerId',
                        haveReset: true,
                        editable: false,
                        matchFieldWidth: false,
                        filterCfg: {
                            layout: {
                                type: 'column',
                                columns: 2
                            },
                            defaults: {},
                            items: [
                                {
                                    name: 'partnerStatus',
                                    xtype: 'hiddenfield',
                                    fieldLabel: i18n.getKey('partnerStatus'),
                                    itemId: 'partnerStatus',
                                    value: 'APPROVED'
                                },
                                {
                                    name: 'code',
                                    xtype: 'textfield',
                                    itemId: 'code',
                                    fieldLabel: i18n.getKey('code'),
                                    margin: '5 0 5 0',
                                },
                            ]
                        },
                        valueType: 'id',
                        gridCfg: {
                            store: partnerStore,
                            height: 450,
                            width: 750,
                            columns: [
                                {
                                    xtype: 'rownumberer'
                                },
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: 'id',
                                    width: 80
                                },
                                {
                                    text: i18n.getKey('code'),
                                    dataIndex: 'code',
                                    sortable: false
                                },
                                {
                                    text: i18n.getKey('name'),
                                    dataIndex: 'name',
                                    sortable: false,
                                    width: 180
                                },
                                {
                                    text: i18n.getKey('partner') + i18n.getKey('type'),
                                    dataIndex: 'partnerType',
                                    renderer: function (value) {
                                        var map = {
                                            'INTERNAL': i18n.getKey('inner'),
                                            'EXTERNAL': i18n.getKey('outside')
                                        }
                                        return map[value];
                                    }
                                },
                                {
                                    text: i18n.getKey('email'),
                                    dataIndex: 'email',
                                    flex: 1,
                                    minWidth: 150,
                                    sortable: false,
                                    renderer: function (value, metadata, record) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: partnerStore,
                            }
                        },
                        listeners: {
                            afterrender: function (comp) {
                                //默认值QPMN
                                var url = adminPath + 'api/partners?page=1&start=0&limit=25&filter=' + Ext.JSON.encode(
                                        [{
                                            name: 'id',
                                            value: 21478999,
                                            type: 'number'
                                        }]),
                                    data = controller.getQuery(url)[0];

                                comp.setValue(data);
                            }
                        }
                    },
                    {
                        xtype: 'datefield',
                        name: 'endBulkDate',
                        itemId: 'endBulkDate',
                        hideTrigger: true,
                        isLike: false,
                        scope: true,
                        fieldLabel: i18n.getKey('拼单时间'),
                    },
                    {
                        xtype: 'combo',
                        name: 'combineOrderType',
                        itemId: 'combineOrderType',
                        isLike: true,
                        editable: false,
                        haveReset: true,
                        valueField: 'value',
                        displayField: 'display',
                        fieldLabel: i18n.getKey('拼单类型'),
                        store: {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'PERIOD',
                                    display: '自动拼单',
                                },
                                {
                                    value: 'MANUAL',
                                    display: '手动拼单',
                                },
                                {
                                    value: 'DIRECT',
                                    display: '直接下单',
                                }
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