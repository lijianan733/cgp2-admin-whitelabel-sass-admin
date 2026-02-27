/**
 * Created by miao on 2021/8/26.
 */
Ext.define('CGP.resource.view.ornament.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.imagemain',
    config: {
        i18nblock: i18n.getKey('ornament'),
        block: 'resource/app/view/ornament',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: 'Ornament',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 60
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    flex: 1,
                    sortable: true
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
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var searchId = JSGetQueryString('dataSourceId');
                            if (searchId) {
                                comp.setValue(searchId);
                            }
                        }
                    }
                },
                {
                    itemId: 'nameSearch',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
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