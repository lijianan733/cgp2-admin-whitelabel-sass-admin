/**
 * @Description:大版生成配置结果
 * @author nan
 * @date 2022/11/3
 */
Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.model.Page',
    'CGP.common.typesettingschedule.view.DiyFieldSet',
    'CGP.common.typesettingschedule.view.ImpressionFieldSet',
    'CGP.common.typesettingschedule.view.PageFieldSet'
])
Ext.define('CGP.common.typesettingschedule.view.ImpressionGenerateDetailPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.impressiongeneratedetailpanel',
    autoScroll: true,
    frame: false,
    border: false,
    layout: 'anchor',
    defaults: {
        margin: '5px 10px 0 10px'
    },
    jobTaskId: null,
    listeners: {
        afterrender: function () {
            var me = this
            var outputUrl = composingPath + 'composing/result/impressions/output?page=1&limit=25' + '&jobTaskId=' + me.jobTaskId;
            JSAjaxRequest(outputUrl, 'GET', true, null, null, function (require, success, response) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var data = responseText.data.content;
                    me.setValueOutput(data)
                }
            }, true)
        }
    },
    setValueInput: function (data) {
        var me = this;
        var impression = me.getComponent('impression');
        var input = me.getComponent('input');
        impression.setValue(data.config);
        input.setValue(data.input);
    },
    setValueOutput: function (data) {
        var me = this;
        var output = me.getComponent('output');
        output.setValue(data);
    },
    initComponent: function () {
        var me = this;
        var exportCount = 0;
        var inputExpandQuery = function () {
            if (!exportCount) {
                var inputUrl = composingPath + 'composing/result/impressions/input?jobTaskId=' + me.jobTaskId;
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
                title: i18n.getKey('大版配置'),
                itemId: 'impression',
                name: 'impression',
                padding: '3px 10px 0px 10px',
                extraButtons: {
                    edit: {
                        xtype: 'button',
                        margin: '0 5 0 5',
                        iconCls: 'icon_edit',
                        ui: 'default-toolbar-small',
                        text: i18n.getKey('edit'),
                        handler: function (btn) {
                            var jobConfigId = btn.ownerCt.ownerCt.items.items[0].value.jobConfigId;
                            JSOpen({
                                id: 'jobImpressionConfig',
                                url: location.origin + '/product-library/partials/compose/jobconfig/jobimpressionconfig/edit.html' +
                                    '?jobConfigId=' + jobConfigId,
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
                xtype: 'container',
                itemId: 'output',
                name: 'output',
                defaults: {
                    width: '100%',
                },
                items: [],
                setValue: function (data) {
                    var me = this;
                    me.suspendLayouts();
                    var components = [];
                    if (data) {
                        data.map(function (item, index) {
                            components.push({
                                xtype: 'impressionfieldset',
                                data: item,
                                title: "<div style= 'margin-top: 3px;font-size:15px;color:green;font-weight: bold'>大版模板<" + item.templateId + '>生成的sheet列表</div>'
                            })
                        })
                    }
                    me.add(components);
                    me.resumeLayouts();
                    me.doLayout();
                },
            }
        ];
        me.callParent();
    },
});
