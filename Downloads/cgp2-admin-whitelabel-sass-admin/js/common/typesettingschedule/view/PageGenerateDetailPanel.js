/**
 * @Description:pageConfig生成结果
 * @author nan
 * @date 2022/11/3
 */
Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.model.Page',
    'CGP.common.typesettingschedule.view.DiyFieldSet',
    'CGP.common.typesettingschedule.view.PageFieldSet',
])
Ext.define('CGP.common.typesettingschedule.view.PageGenerateDetailPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.pagegeneratedetailpanel',
    autoScroll: true,
    frame: false,
    border: false,
    layout: 'anchor',
    time: null,
    orderItemId: null,
    jobConfigId: null,
    jobTaskId: null,
    pageConfigId: null,
    defaults: {
        margin: '5px 10px 0 10px'
    },
    exportCount: 0,
    setValue: function (data) {
        var me = this;
        var pageConfig = me.getComponent('pageConfig');
        var generateConfig = me.getComponent('generateConfig');
        var PCS = me.getComponent('PCS');
        var context = me.getComponent('context');
        pageConfig.setValue(data.config);
        generateConfig.setValue(data.pageGenerateConfig);
        PCS.setValue(data.pcs);
        context.setValue(data.input);
    },
    inputExpandQuery: function () {
        var me = this,
            {context, orderItemId, jobConfigId, pageConfigId} = me.params;

        if (!context.exportCount) {
            var inputUrl = composingPath + 'composing/result/pages/input?orderItemId=' + orderItemId + '&jobConfigId=' + jobConfigId + '&pageConfigId=' + pageConfigId;
            JSAjaxRequest(inputUrl, 'GET', true, null, null, function (require, success, response) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var data = responseText.data;
                    context.setValue(data);
                    context.exportCount++;
                }
            }, true)
        }
    },
    initComponent: function () {
        var me = this,
            {exportCount, orderItemId, jobConfigId, pageConfigId} = me;

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
                title: i18n.getKey('pageConfig'),
                padding: '3px 10px 0px 10px',
                name: 'pageConfig',
                itemId: 'pageConfig',
                extraButtons: {
                    edit: {
                        xtype: 'button',
                        margin: '0 5 0 5',
                        iconCls: 'icon_edit',
                        ui: 'default-toolbar-small',
                        text: i18n.getKey('edit'),
                        handler: function (btn) {
                            var pageConfigId = btn.ownerCt.ownerCt.items.items[0].value._id;

                            JSOpen({
                                id: 'pageconfig_edit',
                                url: location.origin + '/product-library/partials/compose/pageconfig/edit.html' +
                                    '?_id=' + pageConfigId,

                                title: i18n.getKey('edit') + i18n.getKey('pageConfig'),
                                refresh: true
                            })
                        }
                    }
                },
                params: {
                    context: me,
                    orderItemId: orderItemId,
                    jobConfigId: jobConfigId,
                    pageConfigId: pageConfigId
                },
                listeners: {
                    beforeexpand: me.inputExpandQuery
                }
            },
            {
                xtype: 'diyfieldset',
                title: i18n.getKey('generateConfig'),
                itemId: 'generateConfig',
                name: 'generateConfig',
                params: {
                    context: me,
                    orderItemId: orderItemId,
                    jobConfigId: jobConfigId,
                    pageConfigId: pageConfigId
                },
                listeners: {
                    beforeexpand: me.inputExpandQuery
                }
            },
            {
                xtype: 'diyfieldset',
                title: i18n.getKey('PCS'),
                itemId: 'PCS',
                name: 'PCS',
                params: {
                    context: me,
                    orderItemId: orderItemId,
                    jobConfigId: jobConfigId,
                    pageConfigId: pageConfigId
                },
                listeners: {
                    beforeexpand: me.inputExpandQuery
                }
            },
            {
                xtype: 'diyfieldset',
                title: i18n.getKey('context'),
                itemId: 'context',
                name: 'context',
                params: {
                    context: me,
                    orderItemId: orderItemId,
                    jobConfigId: jobConfigId,
                    pageConfigId: pageConfigId
                },
                listeners: {
                    beforeexpand: me.inputExpandQuery
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
                xtype: 'container',
                itemId: 'pageData',
                width: '100%',
                defaults: {
                    width: '100%',
                },
                layout: 'fit',
                items: [
                    {
                        xtype: 'pagefieldset',
                        itemId: 'pageData',
                        orderItemId: me.orderItemId,
                        jobConfigId: me.jobConfigId,
                        pageConfigId: me.pageConfigId,
                        title: "<div style= 'margin-top: 3px;font-size:15px;color:green;font-weight: bold'>生成的Page列表</div>",
                    }
                ],
                setValue: function (data) {
                    var me = this;
                    var pageData = me.getComponent('pageData');

                    pageData.setValue(data);
                }
            }
        ];
        me.callParent();
    },
});
