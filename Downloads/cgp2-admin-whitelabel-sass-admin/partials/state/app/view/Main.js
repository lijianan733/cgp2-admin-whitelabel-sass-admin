/**
 * Main
 * @Author: miao
 * @Date: 2021/11/2
 */
Ext.define('CGP.state.view.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.statemain',
    config: {
        i18nblock: i18n.getKey('state'),
        block: 'state/app/view',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,

        gridCfg: {
            store: 'StateFlow',
            columns: [

                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('module'),
                    dataIndex: 'module',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('version'),
                    dataIndex: 'version',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        return value;
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        var displayValue='草稿';
                        if(value==2){
                            displayValue='测试';
                        }
                        else if(value==3){
                            displayValue='上线';
                        }
                        return displayValue;
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
                            var searchId = JSGetQueryString('stateId');
                            if (searchId) {
                                comp.setValue(searchId);
                            }
                        }
                    }
                },
                {
                    name: 'module',
                    xtype: 'textfield',
                    itemId: 'module',
                    fieldLabel: i18n.getKey('module')
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