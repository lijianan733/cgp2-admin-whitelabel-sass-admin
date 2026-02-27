/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'CGP.currency.store.Currency',
]);
Ext.define('CGP.currencyconfig.view.CreateCurrencyGridWindow', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.createCurrencyGridWindow',
    getFilterIds: null,
    initComponent: function () {
        var me = this,
            {getFilterIds} = me,
            controller = Ext.create('CGP.currencyconfig.controller.Controller'),
            queryData = controller.getCurrencyData(),
            storeData = controller.getFilterFilterIdsData(queryData, getFilterIds),
            store = Ext.create("CGP.currency.store.Currency", {
                proxy: {
                    type: 'pagingmemory',
                },
                data: storeData
            })

        me.gridCfg = {
            store: store,
            frame: false,
            selType: 'simple',
            deleteAction: false,
            editAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    sortable: false,
                    dataIndex: 'id',
                    align: 'center',
                    flex: 1,
                },
                {
                    text: i18n.getKey('货币名称'),
                    sortable: false,
                    dataIndex: 'title',
                    align: 'center',
                    flex: 1,
                },
                {
                    text: i18n.getKey('货币代码'),
                    sortable: false,
                    dataIndex: 'code',
                    align: 'center',
                    flex: 1,
                },
            ],
        };
        me.filterCfg = {
            header: false,
            defaults: {
                isLike: false,
            },
            searchActionHandler: function (btn) { //重写本地查询
                var form = btn.ownerCt.ownerCt,
                    grid = form.ownerCt.grid,
                    store = grid.store,
                    newStoreData = Ext.clone(storeData),
                    filterData = form.getQuery();

                if (filterData.length) {
                    store.proxy.data = JSGetFilteredValues(filterData, newStoreData);
                } else {
                    store.proxy.data = storeData;
                }
                store.load();
            },
            items: [
                {
                    xtype: 'numberfield',
                    name: 'id',
                    itemId: 'id',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    xtype: 'textfield',
                    name: 'title',
                    itemId: 'title',
                    fieldLabel: i18n.getKey('货币名称'),
                },
                {
                    xtype: 'textfield',
                    name: 'code',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('货币代码'),
                },
                {
                    xtype: 'numberfield',
                    name: 'website.id',
                    itemId: 'website.id',
                    value: 11,
                    hidden: true,
                    fieldLabel: i18n.getKey('网站'),
                },
            ]
        };
        me.callParent();
    },
})