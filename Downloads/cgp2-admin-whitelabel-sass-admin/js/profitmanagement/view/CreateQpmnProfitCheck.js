/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.view.CreateQpmnProfitCheck', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.qpmn_profit_check',
    layout: 'fit',
    store: null,
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.profitmanagement.defaults.OnlineshopmanagementDefaults'),
            {qpmn_profit_check} = config,
            {columnsText, filtersText} = qpmn_profit_check,
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText);

        me.columns = Ext.Array.merge([
            {
                xtype: 'rownumberer',
                autoSizeColumn: false,
                itemId: 'rownumberer',
                width: 45,
                resizable: true,
                menuDisabled: true,
                tdCls: 'vertical-middle'
            },
        ],columns);
        
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: me.store,
            displayInfo: false, // 是否 ? 示， 分 ? 信息
            displayMsg: false, //?示的分?信息
            emptyMsg: i18n.getKey('noData'),
            items: [
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('pageSize'),
                    editable: false,
                    labelWidth: 60,
                    width: 160,
                    value: 25,
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            {
                                value: 25,
                                name: '25'
                            },
                            {
                                value: 50,
                                name: '50'
                            },
                            {
                                value: 75,
                                name: '75'
                            },
                            {
                                value: 150,
                                name: '150'
                            }
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    listeners: {
                        select: function (combo, records) {
                            var newSize = records[0].data.value;
                            var store = Ext.data.StoreManager.lookup('myStore');
                            store.pageSize = newSize; // 更新 pageSize
                            store.loadPage(1); // 重新加载第一页
                        }
                    }
                }
            ]
        });
        me.callParent();
    },
})