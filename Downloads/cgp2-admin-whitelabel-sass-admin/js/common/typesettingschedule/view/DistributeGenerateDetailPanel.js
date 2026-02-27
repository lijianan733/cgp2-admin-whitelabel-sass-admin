/**
 * @Description:分发配置结果
 * @author nan
 * @date 2022/11/3
 */
Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.model.Page',
    'CGP.common.typesettingschedule.view.DiyFieldSet',
    'CGP.common.typesettingschedule.model.DocumentLocal'
])
Ext.define('CGP.common.typesettingschedule.view.DistributeGenerateDetailPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.distributegeneratedetailpanel',
    autoScroll: true,
    frame: false,
    border: false,
    layout: 'anchor',
    defaults: {
        margin: '5px 10px 0 10px'
    },
    setValueInput: function (data) {
        var me = this;
        var distributeConfig = me.getComponent('distributeConfig');
        var input = me.getComponent('input');
        distributeConfig.setValue(data.config);
        input.setValue(data.input);
    },
    setValueOutput: function (data) {
        var me = this;
        var document = me.getComponent('document');
        document.setValue(data);
    },
    initComponent: function () {
        var me = this;
        var exportCount = 0;
        var inputExpandQuery = function () {
            if (!exportCount) {
                var inputUrl = composingPath + 'composing/result/distributions/input?jobTaskId=' + me.jobTaskId;
                JSAjaxRequest(inputUrl, 'GET', true, null, null, function (require, success, response) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var data = responseText.data;
                        me.setValueInput(data);
                        exportCount++;
                    }
                }, true)
            }
        }
        me.items = [
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= 'font-size:15px;color:green;font-weight:bold; color:green;'>" + i18n.getKey('输入') + '</font>'
                    },
                ]
            },
            {
                xtype: 'diyfieldset',
                title: i18n.getKey('分发配置'),
                itemId: 'distributeConfig',
                name: 'distributeConfig',
                padding: '3px 10px 0px 10px',
                extraButtons: {
                    edit: {
                        xtype: 'button',
                        margin: '0 5 0 5',
                        iconCls: 'icon_edit',
                        ui: 'default-toolbar-small',
                        text: i18n.getKey('edit'),
                        handler: function (btn) {
                            var jobConfigId = btn.ownerCt.ownerCt.items.items[0].value.jobConfigId
                            var url = path + 'partials/compose/jobconfig/impressiondistributeconfig/main.html?jobConfigId=' + jobConfigId;
                            JSOpen({
                                id: 'pageconfig_edit',
                                url: url,
                                title: i18n.getKey('edit') + i18n.getKey('pageConfig'),
                                refresh: true
                            })
                        }
                    }
                },
                listeners: {
                    beforeexpand: inputExpandQuery
                }
            },
            {
                xtype: 'diyfieldset',
                title: i18n.getKey('上下文数据'),
                itemId: 'input',
                name: 'input',
                listeners: {
                    beforeexpand: inputExpandQuery
                }
            },
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('输出') + '</font>'
                    }
                ]
            },
            {
                xtype: 'uxfieldset',
                itemId: 'document',
                name: 'document',
                padding: '3px 10px 0px 10px',
                title: "<div style= 'margin-top: 3px;font-size:15px;color:green;font-weight: bold'>分发的最终排版文档</div>",
                setValue: function (data) {
                    var me = this;
                    me.data = data;
                    var grid = me.getComponent('document');
                    if (data) {
                        grid.store.proxy.data = data;
                        grid.store.load();
                        me.expand();
                    }
                },
                collapsible: true,
                border: '1 0 0 0 ',
                collapsed: true,
                layout: 'fit',
                extraButtons: {
                    edit: {
                        xtype: 'button',
                        iconCls: 'icon_check',
                        margin: '0 5 0 5',
                        ui: 'default-toolbar-small',
                        text: i18n.getKey('查看源JSON'),
                        handler: function (btn) {
                            var impressionFieldSet = btn.ownerCt.ownerCt;
                            var data = impressionFieldSet.data;
                            var title = '源JSON';
                            JSShowJsonDataV2(data, title);
                        }
                    }
                },
                items: [
                    {
                        xtype: 'grid',
                        itemId: 'document',
                        name: 'document',
                        store: Ext.create('Ext.data.Store', {
                            model: 'CGP.common.typesettingschedule.model.DocumentLocal',
                            proxy: 'memory',
                            data: []
                        }),
                        columns: [
                            {
                                xtype: 'rownumberer'
                            },
                            {
                                text: i18n.getKey('qty'),
                                dataIndex: 'qty',
                                itemId: 'qty',
                                width: 80,
                            },
                            {
                                text: i18n.getKey('width'),
                                dataIndex: 'width',
                                width: 80,
                                sortable: true
                            },
                            {
                                text: i18n.getKey('height'),
                                dataIndex: 'height',
                                width: 80,
                                sortable: true
                            },
                            {
                                text: 'barCode',
                                dataIndex: 'barCode',
                                width: 150,
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('sheetId'),
                                dataIndex: 'sheetIds',
                                width: 120,
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                xtype: 'filecolumn',
                                text: i18n.getKey('file'),
                                dataIndex: 'location',
                                width: 500,
                                flex: 1,
                                signal: 'DistributeGenerateDetailPanel',
                                getDisplayName: function (value) {
                                    return JSAutoWordWrapStr(value.replace('smb:', ''))
                                },
                            },
                        ],
                    }
                ]
            },
        ];

        me.listeners = {
            afterrender: function () {
                var me = this;
                var outputUrl = composingPath + 'composing/result/distributions/output?page=1&limit=25' + '&jobTaskId=' + me.jobTaskId;

                JSAjaxRequest(outputUrl, 'GET', true, null, null, function (require, success, response) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var data = responseText.data.content;
                        me.setValueOutput(data);
                    }
                }, true)
            }
        };
        me.callParent();
    },
});
