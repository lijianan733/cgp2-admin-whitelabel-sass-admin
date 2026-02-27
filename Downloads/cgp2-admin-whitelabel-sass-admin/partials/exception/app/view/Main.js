/**
 * Main
 * @Author: miao
 * @Date: 2021/11/2
 */
Ext.define('CGP.exception.view.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.exceptionmain',
    config: {
        i18nblock: i18n.getKey('exception'),
        block: 'exception/app/view',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,

        gridCfg: {
            store: 'BusinessException',
            columns: [

                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('level'),
                    dataIndex: 'level',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('category'),
                    dataIndex: 'category',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('message'),
                    dataIndex: 'message',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('message_zh_CN'),
                    dataIndex: 'message',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('params'),
                    dataIndex: 'params',
                    xtype: 'componentcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        // metadata.tdAttr = 'data-qtip="' + value + '"';
                        if (value && value.length > 0) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" id="click-params" style="color: blue;text-decoration: none"">查看</a>',
                                listeners: {
                                    render: function (display) {
                                        var clickElement = document.getElementById('click-params');
                                        clickElement.addEventListener('click', function () {
                                            Ext.create('Ext.ux.window.SuperWindow', {
                                                title: Ext.String.format('查看{0}({1}){2}', record.get('name'), record.get('_id'), i18n.getKey('params')),
                                                isView: true,
                                                height: 300,
                                                items: [{
                                                    xtype: 'paramsgrid',
                                                    readOnly: true,
                                                    hideLabel: true,
                                                    border: 0,
                                                    listeners: {
                                                        afterrender: {
                                                            fn: function (comp) {
                                                                if (value) {
                                                                    comp.setSubmitValue(value);
                                                                }
                                                            }, single: true
                                                        }
                                                    },
                                                },]
                                            }).show();
                                        }, false);

                                    }
                                }
                            };
                        } else {
                            return '';
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var searchId = JSGetQueryString('exceptionId');
                            if (searchId) {
                                comp.setValue(searchId);
                            }
                        }
                    }
                },
                {
                    name: 'code',
                    xtype: 'numberfield',
                    itemId: 'codeSearch',
                    fieldLabel: i18n.getKey('code'),
                    hideTrigger:true
                },
                {
                    name: 'level',
                    xtype: 'combobox',
                    itemId: 'levelSearch',
                    fieldLabel: i18n.getKey('level'),
                    displayField: 'displayName',
                    valueField: 'value',
                    value: '',
                    editable: false,
                    haveReset:true,
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