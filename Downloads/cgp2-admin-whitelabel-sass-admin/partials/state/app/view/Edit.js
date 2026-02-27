/**
 * Edit
 * @Author: miao
 * @Date: 2021/11/3
 */
Ext.define("CGP.state.view.Edit", {
    extend: "Ext.ux.ui.EditPage",
    alias: 'widget.stateedit',
    config: {
        block: 'state/app/view',
        accessControl: true,
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.state.model.StateFlow',
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
                    value: 'com.qpp.web.core.state.StateFlowInfo'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('module'),
                    itemId: 'module',
                    name: 'module',
                    allowBlank: false,
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description',
                    // allowBlank: false,
                },
                {
                    name: 'version',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('version'),
                    itemId: 'version',
                    allowBlank: false,
                },
                {
                    name: 'status',
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    displayField: 'type',
                    valueField: 'value',
                    value: '',
                    editable: false,
                    haveReset: true,
                    allowBlank: false,
                    store: new Ext.data.Store({
                        fields: ['type', "value"],
                        data: [
                            {
                                type: '草稿', value: 1
                            },
                            {
                                type: '测试', value: 2
                            },
                            {
                                type: '上线', value: 3
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
