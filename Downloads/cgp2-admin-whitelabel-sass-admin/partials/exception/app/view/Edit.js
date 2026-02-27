/**
 * Edit
 * @Author: miao
 * @Date: 2021/11/3
 */
Ext.define("CGP.exception.view.Edit", {
    extend: "Ext.ux.ui.EditPage",
    alias: 'widget.exceptionedit',
    config: {
        block: 'exception/app/view',
        accessControl: true,
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.exception.model.BusinessException',
            remoteCfg: false,
            useForEach: true,
            layout: {
                layout: 'table',
                columns: 1,
                tdAttrs: {
                    style: {
                        'padding-right': '120px'
                    }
                }
            },
            items: [
                {
                    name: '_id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    hidden: true
                },
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz',
                    hidden: true,
                    value: 'com.qpp.web.core.exception.BusinessExceptionInfo'
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code',
                    name: 'code',
                    allowBlank: false,
                },
                {
                    name: 'level',
                    xtype: 'combobox',
                    itemId: 'level',
                    fieldLabel: i18n.getKey('level'),
                    displayField: 'displayName',
                    valueField: 'value',
                    value: '',
                    editable: false,
                    haveReset: true,
                    allowBlank: false,
                    store: new Ext.data.Store({
                        fields: ['value', 'displayName'],
                        data: [
                            {
                                displayName: 'debug',
                                value: 'DEBUG'
                            },
                            {
                                displayName: 'info',
                                value: 'INFO'
                            },
                            {
                                displayName: 'warning',
                                value: 'WARNING'
                            },
                            {
                                displayName: 'error',
                                value: 'ERROR'
                            },
                            {
                                displayName: 'fatal',
                                value: 'FATAL'
                            }
                        ]
                    })
                },
                {
                    name: 'category',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('category'),
                    itemId: 'category',
                    // allowBlank: false,
                },
                {
                    name: 'message',
                    xtype: 'textarea',
                    grow: true,
                    fieldLabel: i18n.getKey('message'),
                    itemId: 'message',
                    maxHeight: 350,
                    allowBlank: false,
                },
                {
                    name: 'message_zh_CN',
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('中文信息'),
                    itemId: 'message_zh_CN',
                    grow: true,
                    maxHeight: 350,
                    allowBlank: false,
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    xtype: 'paramsgrid',
                    itemId: 'paramsGrid',
                    width: 750,
                    fieldLabel: i18n.getKey('params'),
                    name: 'params',
                    // allowBlank: false,

                }
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});
