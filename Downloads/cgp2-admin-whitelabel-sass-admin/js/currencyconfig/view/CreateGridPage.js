/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.define('CGP.currencyconfig.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    store: null,
    block: 'currencyconfig',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('currencyconfig'),
    initComponent: function () {
        var me = this,
            websiteId = JSGetQueryString('websiteId'),
            websiteMode = JSGetQueryString('websiteMode'),
            controller = Ext.create('CGP.currencyconfig.controller.Controller')

        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['clear', 'config', 'help', 'export', 'import'],
                btnCreate: {
                    handler: function () {
                        JSOpen({
                            id: 'edit_currencyconfig',
                            url: path + `partials/currencyconfig/edit.html`+
                                `?type=create&websiteId=${websiteId}&websiteMode=${websiteMode}`,
                            refresh: true,
                            title: i18n.getKey('创建_货币配置')
                        });
                    }
                },
                btnDelete: {
                    iconCls: 'icon_copy',
                    text: i18n.getKey('拷贝'),
                    handler: function () {
                        var grid = this.ownerCt.ownerCt,
                            selectItems = grid.getSelectionModel().getSelection(),
                            copyArray = selectItems.map(item => {
                                return item.getId();
                            }),
                            id = copyArray[0];

                        if (copyArray.length) {
                            JSOpen({
                                id: 'edit_currencyconfig',
                                url: path + `partials/currencyconfig/edit.html`+
                                    `?_id=${id}&type=copy&websiteId=${websiteId}&websiteMode=${websiteMode}`,
                                refresh: true,
                                title: i18n.getKey('拷贝_货币配置')
                            });
                        } else {
                            Ext.Msg.alert('提示', '请选择一条数据!');
                        }
                    }
                }
            },
            gridCfg: {
                store: me.store,
                frame: false,
                showRowNum: false,
                editAction: false,
                deleteAction: false,
                columns: [
                    {
                        xtype: 'rownumberer',
                        itemId: 'rownumberer',
                        width: 45,
                        resizable: true,
                        menuDisabled: true,
                        autoSizeColumn: false,
                        align: 'center',
                        tdCls: 'vertical-middle',
                    },
                    {
                        xtype: 'componentcolumn',
                        tdCls: 'vertical-middle',
                        sortable: false,
                        width: 60,
                        dataIndex: 'id',
                        renderer: function (value, mateData, record, rowIndex, colIndex, store) {
                            var status = record.get('status'),
                                isWaitEffect = status === 'WAITE_EFFECTIVE'
                            return {
                                xtype: 'fieldcontainer',
                                hidden: !isWaitEffect,
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'icon_edit icon_margin',
                                        itemId: 'actionedit',
                                        tooltip: 'Edit',
                                        componentCls: "btnOnlyIcon",
                                        handler: function () {
                                            var id = record.get('id');
                                            JSOpen({
                                                id: 'edit_currencyconfig',
                                                url: path + `partials/currencyconfig/edit.html`+
                                                    `?_id=${id}&type=edit&websiteId=${websiteId}&websiteMode=${websiteMode}`,
                                                refresh: true,
                                                title: i18n.getKey('编辑_货币配置')
                                            });
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'icon_remove icon_margin',
                                        itemId: 'actionremove',
                                        tooltip: 'Remove',
                                        componentCls: "btnOnlyIcon",
                                        handler: function () {
                                            var id = record.get('id'),
                                                url = adminPath + `api/platformCurrencySettings/${id}`;

                                            Ext.Msg.confirm('提示', '是否删除？', function (selector) {
                                                if (selector === 'yes') {
                                                    controller.deleteQuery(url, function () {
                                                        store.load();
                                                    });
                                                }
                                            });
                                        }
                                    }
                                ]
                            };
                        }
                    },
                    {
                        xtype: 'atagcolumn',
                        text: i18n.getKey("id"),
                        dataIndex: 'id',
                        width: 200,
                        align: 'center',
                        sortable: false,
                        getDisplayName: function (value, metaData, record) {
                            return JSCreateHyperLink(value);
                        },
                        clickHandler: function (value, metaData, record) {
                            JSOpen({
                                id: 'edit_currencyconfig',
                                url: path + `partials/currencyconfig/edit.html`+
                                    `?_id=${value}&type=edit&readOnly=true&websiteId=${websiteId}&websiteMode=${websiteMode}`,
                                refresh: true,
                                title: i18n.getKey('查看_货币配置')
                            });
                        }
                    },
                    {
                        text: i18n.getKey('version'),
                        dataIndex: 'version',
                        align: 'center',
                        width: 200,
                        sortable: true,
                    },
                    {
                        text: i18n.getKey('状态'),
                        dataIndex: 'status',
                        itemId: 'status',
                        sortable: false,
                        align: 'center',
                        width: 200,
                        bottomToolbarHeight: 30,
                        renderer: function (value, metadata) {
                            var statusGather = {
                                    EXPIRED: {
                                        color: 'grey',
                                        text: '过期'
                                    },
                                    WAITE_EFFECTIVE: {
                                        color: 'blue',
                                        text: '待生效'
                                    },
                                    EFFECTIVE: {
                                        color: 'green',
                                        text: '生效中'
                                    },
                                },
                                {color, text} = statusGather[value];

                            return JSCreateFont(color, true, text)
                        }
                    },
                    {
                        text: i18n.getKey('生效时间'),
                        dataIndex: 'effectiveTime',
                        flex: 1,
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            return controller.getEndTime(value);
                        }
                    }
                ]
            },
            filterCfg: {
                layout: {
                    type: 'column',
                    columns: 3
                },
                defaults: {
                    margin: '5 0 5 0',
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'id',
                        itemId: 'id',
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('id'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'version',
                        itemId: 'version',
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('version'),
                    },
                    {
                        xtype: 'combo',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        fieldLabel: i18n.getKey('status'),
                        name: 'status',
                        itemId: 'status',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['type', "value"],
                            data: [
                                {
                                    type: '过期',
                                    value: 'EXPIRED'
                                },
                                {
                                    type: '待生效',
                                    value: 'WAITE_EFFECTIVE'
                                },
                                {
                                    type: '生效中',
                                    value: 'EFFECTIVE'
                                }
                            ]
                        }),
                        displayField: 'type',
                        valueField: 'value',
                        queryMode: 'local',

                    },
                    {
                        xtype: 'datefield',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'effectiveTime',
                        itemId: 'effectiveTime',
                        scope: true,
                        fieldLabel: i18n.getKey('生效时间'),
                        width: 360,
                        format: 'Y/m/d'
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