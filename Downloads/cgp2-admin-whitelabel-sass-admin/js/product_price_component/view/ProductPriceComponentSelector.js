/**
 * @author nan
 * @date 2025/5/21
 * @description TODO
 */
Ext.define('CGP.product_price_component.view.ProductPriceComponentSelector', {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.product_price_component_selector',
    displayField: 'description',
    valueField: '_id',
    multiSelect: false,
    editable: false,
    matchFieldWidth: false,
    gotoConfigHandler: function () {
        var id = this.getSubmitValue()[0];
        JSOpen({
            id: 'product_price_componentpage',
            url: path + 'partials/product_price_component/main.html?_id=' + id,
            title: i18n.getKey('产品价格组成'),
            refresh: true,
        });
    },
    diyGetValue: function () {
        var me = this;
        return me.getArrayValue();
    },
    initComponent: function () {
        var me = this;
        var store = me.store = me.store || Ext.create('CGP.product_price_component.store.ProductPriceComponentStore', {});
        me.gridCfg = Ext.Object.merge({
            store: store,
            height: 300,
            width: 550,
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 40
                },
                {
                    text: i18n.getKey('id'),
                    width: 100,
                    dataIndex: '_id'
                },
                {
                    text: i18n.getKey('description'),
                    flex: 1,
                    dataIndex: 'description'
                },
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store,
            }
        }, me.gridCfg);
        me.filterCfg = Ext.Object.merge({
            height: 80,
            layout: {
                type: 'column',
                columns: 2
            },
            defaults: {
                width: 250,
            },
            items: [
                {
                    xtype: 'textfield',
                    name: '_id',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id',
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }]
        }, me.filterCfg);
        me.callParent();
    }
})
