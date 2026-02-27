Ext.Loader.syncRequire([
    'CGP.customerordermanagement.store.CustomerOrderTotalInfoStore',
])
Ext.define('CGP.customerordermanagement.view.CreateCustomerOrderTotalComp', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.customer_order_total',
    autoHeight: true,
    hideHeaders: true,
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.customerordermanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.customerordermanagement.defaults.CustomerordermanagementDefaults'),
            {customer_order_total_info} = config,
            {columnsText, filtersText} = customer_order_total_info,
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText);

        me.columns = columns;
        
        me.callParent(arguments);

    }
})
