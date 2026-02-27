/**
 * @author nan
 * @date 2025/5/15
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.country.store.CountryStore'
])
Ext.define("CGP.product_location.view.ProductLocationSelector", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.product_location_selector',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    valueField: 'code',
    displayField: 'code',
    valueType: 'id',//recordData,idReference,id为可选的值类型
    gotoConfigHandler: function () {
        var code = this.getArrayValue();
        JSOpen({
            id: 'product_location',
            url: path + 'partials/product_location/main.html?code=' + code,
            title: '生产基地',
            refresh: true
        });
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product_location.store.ProductLocationStore');
        me.store = store;
        me.gridCfg = Ext.Object.merge({
            store: store,
            height: 420,
            width: 600,
            autoScroll: true,
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 120,
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('code'),
                    flex: 1,
                    dataIndex: 'code'
                },
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: store
            })
        }, me.gridCfg);
        me.filterCfg = {
            layout: {
                type: 'table',
                columns: 2
            },
            items: [{
                name: '_id',
                xtype: 'numberfield',
                allowDecimals: false,
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            },]
        };
        me.callParent(arguments);
    },
    diySetValue: function (data) {
        var me = this;
        if (data) {
            me.setValue({
                code: data
            });
        }
    },
    diyGetValue: function () {
        var comp = this,
            data = null;
        data = comp.getArrayValue();
        return data;
    }
})